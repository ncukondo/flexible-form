import { z } from "zod";

const makeSafeIdValidator = () => {
  const sanitize = (text: string) => {
    const percentEscape = (char: string) => `%${char.charCodeAt(0).toString(16)}`
    const escapceNumberOnly = (text: string) => (/^\d+$/.test(text) ? `_${text}` : text);
    return escapceNumberOnly(text)
      .replace(/[ "#$%&'+,./:;<=>\?@\[\\\]^`\{|\}\,]/g, percentEscape)

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

const title = z.string().min(2).default("Untitled Form");
const description = z.string().default("");

const basicFormItem = z.object({
  question: z.string(),
  description: z.string().default(""),
  required: z.boolean().default(false),
  type: z.string(),
  id: z.string().default(""),
});
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

const choiceTableItem = basicFormItem.extend(
  {
    type: z.literal("choice_table"),
    multiple: z.boolean().default(false),
    items: z.string().min(1).array().refine(items => new Set(items).size === items.length).pipe(z.string().array().min(1).transform(makeNonDuplicatedSafeIds)),
    scales: z.string().array().refine(items => new Set(items).size === items.length).pipe(z.string().array().min(1)),
  }
)


const constantItem = basicFormItem.extend({
  type: z.literal("constant"),
  value: z.string()
})

export const formItemSchema = z.union([inputItem, textAreaItem, choiceItem, constantItem, choiceTableItem]);
const formItemsSchema = formItemSchema.array().transform(items => {
  const ensureSafeId = makeSafeIdValidator();
  return items.map(
    item => {
      const id = ensureSafeId(item.id || item.question)
      return { ...item, id };
    }
  )
});


const formDefinitionSchema = z.object({
  title,
  description,
  items: formItemsSchema.default([]),
})

export type FormItemTypes = FormItemDefinition["type"];
export type FormItemsDefinition = z.infer<typeof formItemsSchema>
type FormItemDefinition = z.infer<typeof formItemSchema>
type FormDefinition = z.infer<typeof formDefinitionSchema>;
type ChoiceTableItemDefinition = z.infer<typeof choiceTableItem>;
type ChoiceItemDefinition = z.infer<typeof choiceItem>;

const safeParse = (x: unknown) => formDefinitionSchema.safeParse(x);

export { safeParse };
export type { FormDefinition, FormItemDefinition, ChoiceTableItemDefinition, ChoiceItemDefinition }