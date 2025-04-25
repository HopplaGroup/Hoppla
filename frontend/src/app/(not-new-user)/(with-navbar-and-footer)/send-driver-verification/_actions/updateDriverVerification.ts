// send-driver-verification/_actions/updateDriverVerification.ts
"use server";

import { z } from "zod";
import { getUser } from "@/lib/utils/auth";
import db from "@/lib/utils/db";
import { createServerAction } from "@/lib/utils/createServerAction";
import { DriverVerificationRequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Define the schema for driver verification updates
const updateVerificationSchema = z.object({
  requestId: z.string(),
  licencePhotos: z.array(z.string().url()).min(2, "At least two license photos are required"),
  selfie: z.string().url("A valid selfie URL is required"),
});

// Type for the schema
type UpdateVerificationInput = z.infer<typeof updateVerificationSchema>;

// The logic to handle updating the driver verification
const handleUpdateVerification = async (data: UpdateVerificationInput) => {
  const user = await getUser();

  if (!user) {
    throw new Error("You must be logged in to update a driver verification request");
  }

  // Check if the verification request exists and belongs to the user
  const existingRequest = await db.driverVerificationRequest.findUnique({
    where: {
      id: data.requestId,
      driverId: user.id,
    },
  });

  if (!existingRequest) {
    throw new Error("Verification request not found or you don't have permission to update it");
  }

  // If the request was already approved, don't allow updates
  if (existingRequest.status === DriverVerificationRequestStatus.APPROVED) {
    throw new Error("Cannot update an already approved verification request");
  }

  // Update the verification request
  const updatedRequest = await db.driverVerificationRequest.update({
    where: {
      id: data.requestId,
    },
    data: {
      licencePhotos: data.licencePhotos,
      selfie: data.selfie,
      // If it was rejected, set back to pending when updated
      status: existingRequest.status === DriverVerificationRequestStatus.REJECTED
        ? DriverVerificationRequestStatus.PENDING
        : existingRequest.status,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/")
  return updatedRequest;
};

// Create and export the server action
export const updateDriverVerification = createServerAction(
  updateVerificationSchema,
  handleUpdateVerification
);