import { z } from "zod";

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
  }),
})
const choiceItemValueSchema = (item: z.infer<typeof formItemSchema>) => {
  const multiple = item.type === "choice" && item.multiple;
  const requiredValue = multiple ? z.string().array().nonempty() : z.string();
  const optionalValue = multiple ? z.string().array().default([]) : z.string().default("")
  const value = item.required ? requiredValue : optionalValue;
  return value;
}
const radioTableItem = basicFormItem.extend({
  type: z.literal("radio_table"),
  items: z.string().array(),
  sub_items: z.string().array()
})

const constantItem = basicFormItem.extend({
  type: z.literal("constant"),
  value: z.string()
})

const sanitize = (text: string) => {
  return text.replace(
    /[&'`"<>\s \.]/g,
    (match) => {
      return {
        '&': '&amp;',
        "'": '&#x27;',
        '`': '&#x60;',
        '"': '&quot;',
        '<': '&lt;',
        '>': '&gt;',
      }[match] ?? ""
    }
  )
}


const formItemSchema = z.union([inputItem, textAreaItem, choiceItem, constantItem]);
const formItemsSchema = formItemSchema.array().transform(items => {
  const duplicates = new Map<string, number>();
  const ensureNotDuplicate = (item: string): string => {
    const text = sanitize(item);
    const ok = !duplicates.has(text);
    if (ok) {
      duplicates.set(text, 0);
      return text;
    } else {
      const count = duplicates.get(text) ?? 0;
      return ensureNotDuplicate(text + (count + 1).toString())
    }
  }
  return items.map(
    item => {
      const id = ensureNotDuplicate(item.id || item.question)
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

const safeParse = (x: unknown) => formDefinitionSchema.safeParse(x);

export { safeParse, makeFormItemsValueSchema };
export type { FormDefinition, FormItemDefinition }