// send-driver-verification/_actions/submitDriverVerification.ts
"use server";

import { z } from "zod";
import { getUser } from "@/lib/utils/auth";
import db from "@/lib/utils/db";
import { createServerAction } from "@/lib/utils/createServerAction";
import { DriverVerificationRequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Define the schema for driver verification submission
const driverVerificationSchema = z.object({
  licencePhotos: z.array(z.string().url()).min(2, "At least two license photos are required"),
  selfie: z.string().url("A valid selfie URL is required"),
});

// Type for the schema
type DriverVerificationInput = z.infer<typeof driverVerificationSchema>;

// The logic to handle the driver verification submission
const handleDriverVerification = async (data: DriverVerificationInput) => {
  const user = await getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a driver verification request");
  }

  // Check if user already has a pending verification request
  const existingRequest = await db.driverVerificationRequest.findUnique({
    where: {
      driverId: user.id,
    },
  });

  if (existingRequest) {
    throw new Error("You already have a pending driver verification request");
  }

  // Create a new driver verification request
  const verificationRequest = await db.driverVerificationRequest.create({
    data: {
      licencePhotos: data.licencePhotos,
      selfie: data.selfie,
      status: DriverVerificationRequestStatus.PENDING,
      driver: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath("/")
  return verificationRequest;
};

// Create and export the server action
export const submitDriverVerification = createServerAction(
  driverVerificationSchema,
  handleDriverVerification
);