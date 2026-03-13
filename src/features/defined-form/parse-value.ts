import { makeFormItemsValueSchema, makeFormItemsValueSchemaKeys } from "./form-value-schema";
import { getVisibleItems } from "./visibility";
import { FormDefinitionForView } from "../../features/form-definition/schema";

const parseValue = (formValue: unknown, formDefinition: FormDefinitionForView) => {
  const formRecord = formValue as Record<string, unknown>;
  const visibleItems = getVisibleItems(formDefinition.items, formRecord);
  const keys = makeFormItemsValueSchemaKeys(visibleItems);
  const visibleFormValue = Object.fromEntries(
    Object.entries(formRecord).filter(([key]) => new Set(keys).has(key)),
  );
  const parsed = makeFormItemsValueSchema(visibleItems).parse(visibleFormValue);
  const schema = formDefinition.items;
  return { value: parsed, keys, schema };
};

export { parseValue };
