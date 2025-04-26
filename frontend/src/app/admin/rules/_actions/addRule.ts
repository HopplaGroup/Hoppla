"use server";

// import * as m from "@/paraglide/messages.js";
import { createServerAction, m } from "@/lib/utils/createServerAction";
import addRuleSchema, { addRuleErrorMap } from "../_schemas/addRuleSchema";

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
    userShouldBeActive: true,
    roles: ["ADMIN"],
    revalidatePath: "/admin/rules",
    fieldsZodGeneralErrorMap: addRuleErrorMap,
    errorMessage: m.civil_sharp_octopus_peel(),
    successMessage: m.elegant_nice_mouse_adore(),
  }
);

export default addRule;
