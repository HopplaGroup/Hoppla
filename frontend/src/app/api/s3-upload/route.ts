import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getUser } from "@/lib/utils/auth";
import { menv } from "@/lib/utils/menv";
import { v4 as uuidv4 } from "uuid";
import { MAX_FILE_SIZE } from "./constants";
import { uploadSchema } from "./schema";
import path from "path";
import { uploadRateLimiter } from "./rateLimiter";

// S3 client configuration
const s3Client = new S3Client({
  endpoint: menv.MINIO_ENDPOINT,
  region: menv.MINIO_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: menv.MINIO_ACCESS_KEY,
    secretAccessKey: menv.MINIO_SECRET_KEY,
  },
});

// Function to upload file to S3
async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  folder: string,
  mimeType: string
): Promise<string> {
  const params = {
    Bucket: menv.MINIO_BUCKET,
    Key: `${folder}/${fileName}`,
    Body: file,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const encodedFileName = encodeURIComponent(fileName);
  const encodedFolderName = encodeURIComponent(folder);
  return `https://minioapi.hoppla.ge/${menv.MINIO_BUCKET}/${encodedFolderName}/${encodedFileName}`;
}

export const POST = async (req: NextRequest) => {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await uploadRateLimiter.consume(user.id);
  } catch {
    return NextResponse.json({ error: "RATE_LIMIT" }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    const parsed = uploadSchema.safeParse({
      category,
      file,
    });

    // console.log errors exactly
    if (parsed.error) {
      console.error("Validation errors:", parsed.error.format());
    }

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const data = parsed.data;
    if (data.file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        },
        { status: 400 }
      );
    }

    const folder = data.category ? `uploads/${data.category}` : "uploads/misc";

    const buffer = Buffer.from(await data.file.arrayBuffer());
    const extension = path.extname(data.file.name);
    const id = `${uuidv4()}${extension}`;
    const fileUrl = await uploadFileToS3(buffer, id, folder, data.file.type);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
