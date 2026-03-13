import { makeFormItemsValueSchema, makeFormItemsValueSchemaKeys } from "./form-value-schema";
import { getVisibleItems } from "./visibility";
import { FormDefinitionForView } from "../../features/form-definition/schema";

const parseValue = (formValue: unknown, formDefinition: FormDefinitionForView) => {
  const formRecord = formValue as Record<string, unknown>;
  const visibleItems = getVisibleItems(formDefinition.items, formRecord);
  const parsed = makeFormItemsValueSchema(visibleItems).parse(formValue);
  const keys = makeFormItemsValueSchemaKeys(visibleItems);
  const schema = formDefinition.items;
  return { value: parsed, keys, schema };
};

export { parseValue };
