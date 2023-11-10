import { z } from "zod";

const makeSafeIdValidator = () => {
  const sanitize = (text: string) => {
    const escapceNumberOnly = (text: string) => (/^\d+$/.test(text) ? `_${text}` : text);
    return escapceNumberOnly(text).replaceAll(".", "");
  };
  const duplicates = new Map<string, number>();
  const ensureSafeId = (item: string): string => {
    const text = sanitize(item);
    const ok = !duplicates.has(text);
    if (ok) {
      duplicates.set(text, 0);
      return text;
    } else {
      const count = duplicates.get(text) ?? 0;
      return ensureSafeId(text + `(${count + 1})`.toString());
    }
  };
  return ensureSafeId;
};

const makeNonDuplicatedSafeIds = (idSources: readonly string[]): string[] => {
  const ensureSafeId = makeSafeIdValidator();
  return idSources.map(ensureSafeId);
};

const title = z.string().min(2).default("Untitled Form");
const description = z.string().default("");
const postSubmit = z
  .object({
    message: z.string().default(""),
  })
  .optional();
const action = z
  .union([
    z.string().startsWith("https://"),
    z.string().startsWith("mailto:"),
    z.string().startsWith("log:"),
  ])
  .describe("URL or mailto: or log:");
const actions = z
  .union([action, action.array()])
  .transform(x => (Array.isArray(x) ? x : [x]))
  .pipe(action.array().min(1));

const basicFormItem = z.object({
  title: z.string().default(`Set title here`),
  description: z.string().default(""),
  required: z.boolean().default(false),
  id: z.string().default(""),
});
const inputItem = basicFormItem.extend({
  type: z.literal("short_text").default("short_text"),
});
const textAreaItem = basicFormItem.extend({
  type: z.literal("long_text"),
});
const choiceOption = z.union([
  z
    .string()
    .transform(value => ({ title: value, value }))
    .pipe(z.object({ title: z.string(), value: z.string() })),
  z.object({ title: z.string(), value: z.string() }),
]);
const itemOption = z.union([
  z
    .string()
    .transform(value => ({ title: value, id: "" }))
    .pipe(z.object({ title: z.string(), id: z.string() })),
  z.object({ title: z.string(), id: z.string() }),
]);
const hasDuplicatedValue = <T extends { [key: string]: string }>(items: readonly T[]) => {
  const valuesMap = new Map<string, string[]>();
  items.forEach(item => {
    Object.entries(item).forEach(([key, value]) => {
      const values = valuesMap.get(key) ?? [];
      valuesMap.set(key, [...values, value]);
    });
  });
  const res = Array.from(valuesMap.values()).some(values => new Set(values).size !== values.length);
  return res;
};

const choiceItem = basicFormItem.extend({
  type: z.literal("choice"),
  multiple: z.boolean().default(false),
  items: choiceOption
    .array()
    .refine(items => !hasDuplicatedValue(items), {
      message: "Must be an array of unique strings",
    })
    .pipe(choiceOption.array().min(1)),
});

const choiceTableItem = basicFormItem
  .extend({
    type: z.literal("choice_table"),
    multiple: z.boolean().default(false),
    items: itemOption.array(),
    scales: choiceOption
      .array()
      .refine(items => !hasDuplicatedValue(items), {
        message: "Must be an array of unique strings",
      })
      .pipe(choiceOption.array().min(1)),
  })
  .transform((item, ctx) => {
    const parentId = item.id || item.title;
    const items = item.items.map(({ title, id }) => {
      id = id || parentId + "/" + title;
      return { title, id };
    });
    if (hasDuplicatedValue(items))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["items"],
        message: "Must be an array of unique strings",
      });
    return { ...item, items, id: parentId };
  })
  .pipe(
    basicFormItem.extend({
      type: z.literal("choice_table"),
      multiple: z.boolean(),
      items: itemOption.array().min(1),
      scales: choiceOption.array().min(1),
    }),
  );

const constantItem = basicFormItem.extend({
  type: z.literal("constant"),
  value: z.string(),
});

export const formItemSchema = z
  .discriminatedUnion("type", [inputItem, textAreaItem, choiceItem, constantItem])
  .or(choiceTableItem)
  .or(inputItem);
const formItemsSchema = formItemSchema.array().transform((items, ctx) => {
  const ensureSafeId = makeSafeIdValidator();
  const prevIds = new Set<string>();
  return items.map(item => {
    if (prevIds.has(item.id || item.title))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [item.id],
        message: "Must be unique",
      });
    prevIds.add(item.id || item.title);
    const id = ensureSafeId(item.id || item.title);
    if (item.type === "choice_table") {
      item.items.forEach(subItem => {
        if (prevIds.has(subItem.id))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [item.id, subItem.id],
            message: "Must be unique",
          });
        prevIds.add(subItem.id);
      });
    }
    return { ...item, id };
  });
});

const formDefinitionSchema = z.object({
  title,
  description,
  actions,
  post_submit: postSubmit,
  items: formItemsSchema.default([]),
});
const formDefinitionForViewSchema = formDefinitionSchema.omit({ actions: true });

export type FormItemTypes = FormItemDefinition["type"];
export type FormItemsDefinition = z.infer<typeof formItemsSchema>;
type FormItemDefinition = z.infer<typeof formItemSchema>;
type FormDefinition = z.infer<typeof formDefinitionSchema>;
type FormDefinitionForView = z.infer<typeof formDefinitionForViewSchema>;
type ChoiceTableItemDefinition = z.infer<typeof choiceTableItem>;
type ChoiceItemDefinition = z.infer<typeof choiceItem>;
type ConstantItemDefinition = z.infer<typeof constantItem>;

const safeParseFormDefinition = (x: unknown) => formDefinitionSchema.safeParse(x);
const safeParseFormDefinitionForView = (x: unknown) => formDefinitionForViewSchema.safeParse(x);

export {
  safeParseFormDefinition,
  safeParseFormDefinitionForView,
  type FormDefinitionForView,
  type FormDefinition,
  type FormItemDefinition,
  type ChoiceTableItemDefinition,
  type ChoiceItemDefinition,
  type ConstantItemDefinition,
};
