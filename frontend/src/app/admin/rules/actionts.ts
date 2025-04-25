"use server";
import db from "@/lib/utils/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for validation
const RuleSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  enLabel: z.string().min(1, "English label is required"),
  kaLabel: z.string().min(1, "Georgian label is required"),
  svg: z.string().min(1, "SVG is required"),
});

export async function updateRule(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return {
        success: false,
        error: "Rule ID is required",
      };
    }

    const price = parseFloat(formData.get("price") as string);
    const enLabel = formData.get("labelEn") as string;
    const kaLabel = formData.get("labelKa") as string;
    const svg = formData.get("svg") as string;

    // Validate input
    const validatedData = RuleSchema.parse({
      price,
      enLabel,
      kaLabel,
      svg,
    });

    await db.rule.update({
      where: { id },
      data: {
        price: validatedData.price,
        labels: {
          en: validatedData.enLabel,
          ka: validatedData.kaLabel,
        },
        svg: validatedData.svg,
      },
    });

    revalidatePath("/admin/rules");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    console.error("Failed to update rule:", error);
    return {
      success: false,
      error: "Failed to update rule",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
