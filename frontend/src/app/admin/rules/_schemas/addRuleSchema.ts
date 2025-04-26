import { z } from "zod";
import * as m from "@/paraglide/messages.js";

const addRuleSchema = z.object({
  price: z.number().min(0),
  enLabel: z.string().min(1),
  kaLabel: z.string().min(1),
  svg: z
    .string()
    .min(1)
    .refine((value) => {
      const svgRegex = /<svg[\s\S]*?<\/svg>/i;
      return svgRegex.test(value);
    }),
});

export type AddRuleInput = z.infer<typeof addRuleSchema>;

export const addRuleErrorMap = (
  m: any
): Partial<Record<keyof AddRuleInput, string>> => {
  return {
    price: m.heroic_frail_firefox_explore(),
    enLabel: m.early_giant_cow_yell(),
    kaLabel: m.wide_whole_sloth_pause(),
    svg: m.grassy_even_mule_heal(),
  };
};

export const addRuleErrorMapClient = addRuleErrorMap(m);

export default addRuleSchema;
