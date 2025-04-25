"use server";

// import * as m from "@/paraglide/messages.js";
import { createServerAction, m } from "@/lib/utils/createServerAction";
import deleteRuleSchema from "../_schemas/deleteRuleSchema";

const deleteRule = createServerAction(
  deleteRuleSchema,
  async ({ id }, db) => {
    await db.rule.delete({
      where: {
        id,
      },
    });
    return { id };
  },
  {
    roles: ["ADMIN"],
    revalidatePath: "/admin/rules",
    successMessage: m.white_sound_chicken_snip(),
  }
);

export default deleteRule;
