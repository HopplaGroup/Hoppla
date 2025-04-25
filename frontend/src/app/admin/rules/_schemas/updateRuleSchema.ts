import { z } from "zod";
import * as m from "@/paraglide/messages.js";

const updateRuleSchema = z.object({
  id: z.string().min(1),
  price: z.number().min(0, m.empty_mellow_raven_swim()),
  enLabel: z.string().min(1, m.any_tangy_polecat_cherish()),
  kaLabel: z.string().min(1, m.gaudy_mellow_snake_breathe()),
  svg: z.string().min(1, m.zany_misty_lark_pick()),
});

export type updateRuleInput = z.infer<typeof updateRuleSchema>;

export default updateRuleSchema;
