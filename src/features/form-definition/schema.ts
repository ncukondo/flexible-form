import { z } from "zod";

// ------- general functions -------

const hasDuplicated = (array: string[]): boolean => {
  return new Set(array).size !== array.length;
};

const getDuplicated = (array: string[]): string[] => {
  return [...new Set(array.filter((item, index, self) => self.indexOf(item) !== index))];
};

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

const makeSafeId = (text: string) => {
  const escapceNumberOnly = (text: string) => (/^\d+$/.test(text) ? `_${text}` : text);
  return escapceNumberOnly(text).replaceAll(".", "");
};

// ------- schema utils -------

const addDuplicationIssue = (ctx: z.RefinementCtx, path: readonly string[]) =>
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path: [...path],
    message: "Item ID must be unique",
  });

// ------- general schema -------

const choiceOption = z.union([
  z
    .string()
    .transform(value => ({ title: value, value }))
    .pipe(z.object({ title: z.string(), value: z.string() })),
  z.object({ title: z.string(), value: z.string() }),
]);

const choiceOptions = choiceOption
  .array()
  .refine(items => !hasDuplicatedValue(items), {
    message: "Must be an array of unique strings",
  })
  .pipe(choiceOption.array().min(1));

const itemOption = z.union([
  z
    .string()
    .transform(value => ({ title: value, id: "" }))
    .pipe(z.object({ title: z.string(), id: z.string() })),
  z.object({ title: z.string(), id: z.string() }),
]);
const itemOptions = itemOption
  .array()
  .refine(items => !hasDuplicated(items.map(({ title }) => title)), {
    message: "Must be an array of unique strings(items)",
  })
  .pipe(itemOption.array().min(1));

// ------- form definition schema -------

const title = z.string().min(2).default("Untitled Form");
const description = z.string().default("");
const postSubmit = z
  .object({
    message: z.string().default(""),
  })
  .optional();
const action = z
  .union([
    z.string().startsWith("https://").url(),
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

const choiceItem = basicFormItem.extend({
  type: z.literal("choice"),
  multiple: z.boolean().default(false),
  choices: choiceOptions,
});

const choiceTableItem = basicFormItem.extend({
  type: z.literal("choice_table"),
  multiple: z.boolean().default(false),
  items: itemOptions,
  choices: choiceOptions,
});

const constantItem = basicFormItem.extend({
  type: z.literal("constant"),
  value: z.string(),
});

const formItemSchema = z
  .discriminatedUnion("type", [inputItem, textAreaItem, choiceItem, constantItem])
  .or(choiceTableItem)
  .or(inputItem);

const formItemsSchema = formItemSchema
  .array()
  .transform(items => {
    return items.map(item => {
      const id = item.id || makeSafeId(item.title);
      if (item.type === "choice_table") {
        const subItems = item.items.map(({ title, id: subId }) => {
          subId = subId || id + "/" + makeSafeId(title);
          return { title, id: subId };
        });
        return { ...item, items: subItems, id };
      }
      return { ...item, id };
    });
  })
  .pipe(
    formItemSchema
      .array()
      .superRefine((items, ctx) => {
        const idEntries = items.flatMap(item => {
          const id = [item.id, [item.id]] as const;
          const subIds =
            item.type === "choice_table"
              ? item.items.map(subItem => [subItem.id, [item.id, subItem.id]] as const)
              : [];
          return [id, ...subIds];
        });
        const duplicated = getDuplicated(idEntries.map(([id]) => id));
        const duplicatedIdPaths = idEntries
          .filter(([id]) => duplicated.includes(id))
          .map(([, path]) => path);
        duplicatedIdPaths.forEach(path => addDuplicationIssue(ctx, path));
      })
      .pipe(formItemSchema.array()),
  );

const formDefinitionSchema = z.object({
  title,
  description,
  actions,
  post_submit: postSubmit,
  items: formItemsSchema.default([]),
});

const formDefinitionForViewSchema = formDefinitionSchema.omit({ actions: true });

type FormItemTypes = FormItemDefinition["type"];
type FormItemsDefinition = z.infer<typeof formItemsSchema>;
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
  formItemSchema,
  type FormItemsDefinition,
  type FormItemTypes,
  type FormDefinitionForView,
  type FormDefinition,
  type FormItemDefinition,
  type ChoiceTableItemDefinition,
  type ChoiceItemDefinition,
  type ConstantItemDefinition,
};
