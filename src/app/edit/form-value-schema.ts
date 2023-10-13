import { z } from "zod";
import { formItemSchema, FormItemsDefinition, FormItemTypes } from "./form-definition-schema";


const basicFormItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  const value = item.required ? z.string().min(1) : z.string().default("");
  return value;
};
const makeChoiceOptionSchema = <T extends readonly string[]>(choices: [...T], multiple: boolean, required: boolean) => {
  const [firstChoice, secondChoice, ...restChoices] = choices.map(text => z.literal(text));
  if (!firstChoice) return z.never();
  const choiceItem = secondChoice ? z.union([firstChoice, secondChoice, ...restChoices]) : firstChoice;
  const multipleChoiceValue = required ? choiceItem.array().nonempty() : choiceItem.array().or(z.literal(false).transform(_ => []));
  const singleChoiceValue = required ? choiceItem : choiceItem.or(z.literal(null).transform(_ => ""));
  return multiple ? multipleChoiceValue : singleChoiceValue;
};
const choiceItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice") return z.never();
  return makeChoiceOptionSchema(item.items, item.multiple, item.required);
};
const choiceTableItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice_table") return z.never();
  const values = makeChoiceOptionSchema(item.scales, item.multiple, item.required);
  const object = Object.fromEntries(item.items.map(key => [key, values] as const));
  return z.object(object);
};
const makeFormItemsValueSchema = (formItemsDefinition: FormItemsDefinition | undefined) => {
  if (!formItemsDefinition) return z.object({});
  const functionDict = {
    "short_text": basicFormItemValueSchema,
    "long_text": basicFormItemValueSchema,
    "choice": choiceItemValueSchema,
    "constant": basicFormItemValueSchema,
    "choice_table": choiceTableItemValueSchema,
  } as const satisfies {
      [K in FormItemTypes]: unknown;
    };
  const entries = Object.fromEntries(formItemsDefinition.map((item) => {
    const valueItem = functionDict[item.type](item);
    return [item.id, valueItem] as const;
  }));
  return z.object(entries);
};

export { makeFormItemsValueSchema }
