import { z } from "zod";
import {
  formItemSchema,
  FormItemsDefinition,
  FormItemTypes,
} from "../../features/form-definition/schema";

const basicFormItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  const value = item.required ? z.string().min(1) : z.string().default("");
  return value;
};
const makeChoiceOptionSchema = <T extends readonly { title: string; value: string }[]>(
  choices: [...T],
  multiple: boolean,
  required: boolean,
) => {
  const [firstChoice, secondChoice, ...restChoices] = choices.map(({ value }) => z.literal(value));
  if (!firstChoice) return z.never();
  const choiceItem = secondChoice
    ? z.union([firstChoice, secondChoice, ...restChoices])
    : firstChoice;
  const multipleChoiceValue = required
    ? choiceItem.array().nonempty()
    : z
        .union([
          choiceItem.array(),
          z
            .literal(false)
            .transform(_ => [])
            .pipe(z.string().array()),
        ])
        .default([]);

  const singleChoiceValue = required
    ? choiceItem
    : z.union([
        choiceItem,
        z
          .literal(null)
          .transform(_ => "")
          .pipe(z.string()),
        z.literal(""),
      ]);
  return multiple ? multipleChoiceValue : singleChoiceValue;
};
const choiceItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice") return z.never();
  return makeChoiceOptionSchema(item.choices, item.multiple, item.required);
};
const choiceTableItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice_table") return z.never();
  const values = makeChoiceOptionSchema(item.choices, item.multiple, item.required);
  return item.items.map(({ id }) => [id, values] as const);
};
const makeFormItemsValueSchema = (formItemsDefinition: FormItemsDefinition | undefined) => {
  if (!formItemsDefinition) return z.object({});
  const functionDict = {
    short_text: basicFormItemValueSchema,
    long_text: basicFormItemValueSchema,
    choice: choiceItemValueSchema,
    constant: basicFormItemValueSchema,
    choice_table: choiceTableItemValueSchema,
  } as const satisfies {
    [K in FormItemTypes]: unknown;
  };
  const entries = Object.fromEntries(
    formItemsDefinition.flatMap(item => {
      const valueItem = functionDict[item.type](item);
      if (Array.isArray(valueItem)) return valueItem;
      return [[item.id, valueItem]] as const;
    }),
  );
  return z.object(entries);
};

export { makeFormItemsValueSchema };