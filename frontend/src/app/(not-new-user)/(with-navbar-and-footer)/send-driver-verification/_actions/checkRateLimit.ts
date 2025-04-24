// send-driver-verification/_actions/checkRateLimitAction.ts
"use server";

import { z } from "zod";
import { uploadRateLimiter } from "@/app/api/s3-upload/rateLimiter";
import { getUser } from "@/lib/utils/auth";
import { createServerAction } from "@/lib/utils/create-server-action";

// Define the logic function
async function checkRateLimitLogic(_: {}) {
    const user = await getUser();
    if (!user) {
        throw new Error("Authentication required");
    }

    const userId = user.id;
    // await uploadRateLimiter.consume(user.id);
    try {
        const rateLimitInfo = await uploadRateLimiter.get(userId);
        console.log(rateLimitInfo)
        if (!rateLimitInfo) {
            return {
                canUpload: true,
                remainingPoints: 0,
                msBeforeNext: 0
            }
        }

        const canUpload = rateLimitInfo.remainingPoints >= 3;

        return {
            canUpload,
            remainingPoints: rateLimitInfo.remainingPoints,
            msBeforeNext: rateLimitInfo.msBeforeNext,
        };
    } catch (error) {
        if (error instanceof Error && 'msBeforeNext' in error) {
            return {
                canUpload: false,
                remainingPoints: 0,
                msBeforeNext: (error as any).msBeforeNext as number,
            };
        }

        throw error;
    }
}

// Create schema for empty input
const emptySchema = z.object({});

// Create the server action
export const checkRateLimitAction = createServerAction(emptySchema, checkRateLimitLogic);
