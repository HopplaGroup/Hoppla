"use server";

// import * as m from "@/paraglide/messages.js";
import { createServerAction, m } from "@/lib/utils/createServerAction";
import addRuleSchema from "../_schemas/addRuleSchema";

const addRule = createServerAction(
  addRuleSchema,
  async ({ enLabel, kaLabel, price, svg }, db) => {
    await db.rule.create({
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
    successMessage: m.elegant_nice_mouse_adore(),
  }
);

export default addRule;
