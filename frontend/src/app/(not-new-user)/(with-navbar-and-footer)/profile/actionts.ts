"use server";

import { createServerAction } from "@/lib/utils/createServerAction";
import db from "@/lib/utils/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const changeProfileImg = createServerAction(
    z.object({
        img: z.string().min(1),
        userId: z.string().min(1),
    }),
    async (data) => {
        await db.user.update({
            where: {
                id: data.userId,
            },
            data: {
                profileImg: data.img,
            },
        });
        revalidatePath("/");
    }
);
