"use server";

// import * as m from "@/paraglide/messages.js";
import { createServerAction, m } from "@/lib/utils/createServerAction";
import updateRuleSchema from "../_schemas/updateRuleSchema";

const updateRule = createServerAction(
  updateRuleSchema,
  async ({ id, enLabel, kaLabel, price, svg }, db) => {
    await db.rule.update({
      where: {
        id,
      },
      data: {
        price,
        labels: {
          en: enLabel,
          ka: kaLabel,
        },
        svg,
      },
    });
  },
  {
    roles: ["ADMIN"],
    revalidatePath: "/admin/rules",
    successMessage: m.born_even_macaw_grasp(),
  }
);

export default updateRule;
