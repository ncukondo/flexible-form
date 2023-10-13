import { z } from "zod";

const makeSafeIdValidator = () => {
  const sanitize = (text: string) => {
    const percentEscape = (char: string) => `%${char.charCodeAt(0).toString(16)}`
    const escapceNumberOnly = (text: string) => (/^\d+$/.test(text) ? `_${text}` : text);
    return escapceNumberOnly(text)
      .replace(/[ "#$%&'+,./:;<=>\?@\[\\\]^_`\{|\}\,]/g, percentEscape)

  }
  const duplicates = new Map<string, number>();
  const ensureSafeId = (item: string): string => {
    const text = sanitize(item);
    const ok = !duplicates.has(text);
    if (ok) {
      duplicates.set(text, 0);
      return text;
    } else {
      const count = duplicates.get(text) ?? 0;
      return ensureSafeId(text + (count + 1).toString())
    }
  }
  return ensureSafeId;
}
const makeNonDuplicatedSafeIds = (idSources: readonly string[]) => {
  const ensureSafeId = makeSafeIdValidator();
  return idSources.map(ensureSafeId);
}


const title = z.string().default("Untitled Form");
const description = z.string().default("");

const basicFormItem = z.object({
  question: z.string(),
  description: z.string().default(""),
  required: z.boolean().default(false),
  type: z.string(),
  id: z.string().default(""),
});
const basicFormItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  const value = item.required ? z.string().min(1) : z.string().default("");
  return value;
}
const inputItem = basicFormItem.extend({
  type: z.literal("short_text"),
})
const textAreaItem = basicFormItem.extend({
  type: z.literal("long_text"),
})
const choiceItem = basicFormItem.extend({
  type: z.literal("choice"),
  multiple: z.boolean().default(false),
  items: z.string().array().refine(items => new Set(items).size === items.length, {
    message: 'Must be an array of unique strings',
  }).pipe(z.string().array().min(1)),
})
const makeChoiceOptionSchema = <T extends readonly string[]>(choices: [...T], multiple: boolean, required: boolean) => {
  const [firstChoice, secondChoice, ...restChoices] = choices.map(text => z.literal(text));
  if (!firstChoice) return z.never();
  const choiceItem = secondChoice ? z.union([firstChoice, secondChoice, ...restChoices]) : firstChoice;
  const multipleChoiceValue = required ? choiceItem.array().nonempty() : choiceItem.array().or(z.literal(false).transform(_ => []));
  const singleChoiceValue = required ? choiceItem : choiceItem.or(z.literal(null).transform(_ => ""));
  return multiple ? multipleChoiceValue : singleChoiceValue;
}
const choiceItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice") return z.never();
  return makeChoiceOptionSchema(item.items, item.multiple, item.required);
}
const choiceTableItem = basicFormItem.extend(
  {
    type: z.literal("choice_table"),
    multiple: z.boolean().default(false),
    items: z.string().min(1).array().refine(items => new Set(items).size === items.length).pipe(z.string().array().min(1).transform(makeNonDuplicatedSafeIds)),
    scales: z.string().array().refine(items => new Set(items).size === items.length).pipe(z.string().array().min(1)),
  }
)
const choiceTableItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  if (item.type !== "choice_table") return z.never();
  const values = makeChoiceOptionSchema(item.scales, item.multiple, item.required);
  const object = Object.fromEntries(item.items.map(key => [key, values] as const));
  return z.object(object);
}

const constantItem = basicFormItem.extend({
  type: z.literal("constant"),
  value: z.string()
})



const formItemSchema = z.union([inputItem, textAreaItem, choiceItem, constantItem, choiceTableItem]);
const formItemsSchema = formItemSchema.array().transform(items => {
  const ensureSafeId = makeSafeIdValidator();
  return items.map(
    item => {
      const id = ensureSafeId(item.id || item.question)
      return { ...item, id };
    }
  )
});
const makeFormItemsValueSchema = (formItemsDefinition: FormItemsDefinition | undefined) => {
  if (!formItemsDefinition) return z.object({});
  const functionDict = {
    "short_text": basicFormItemValueSchema,
    "long_text": basicFormItemValueSchema,
    "choice": choiceItemValueSchema,
    "constant": basicFormItemValueSchema,
    "choice_table": choiceTableItemValueSchema,
  } as const satisfies { [K in FormItemTypes]: unknown };
  const entries = Object.fromEntries(formItemsDefinition.map((item) => {
    const valueItem = functionDict[item.type](item);
    return [item.id, valueItem] as const;
  }));
  return z.object(entries);
}

const formDefinitionSchema = z.object({
  title,
  description,
  items: formItemsSchema.default([]),
})
type FormItemTypes = FormItemDefinition["type"];
type FormItemsDefinition = z.infer<typeof formItemsSchema>
type FormItemDefinition = z.infer<typeof formItemSchema>
type FormDefinition = z.infer<typeof formDefinitionSchema>;
type ChoiceTableItemDefinition = z.infer<typeof choiceTableItem>;

const safeParse = (x: unknown) => formDefinitionSchema.safeParse(x);

export { safeParse, makeFormItemsValueSchema };
export type { FormDefinition, FormItemDefinition, ChoiceTableItemDefinition }