import { z } from "zod";
import * as m from "@/paraglide/messages.js";

const deleteRuleSchema = z.object({
  id: z.string({}).min(1),
});

export type DeleteRuleInput = z.infer<typeof deleteRuleSchema>;

export default deleteRuleSchema;
