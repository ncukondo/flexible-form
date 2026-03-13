import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import { makeFormItemsValueSchema } from "./form-value-schema";
import { getVisibleIds } from "./visibility";
import type { FormItemsDefinition } from "../form-definition/schema";

const makeVisibilityAwareResolver = (
  items: FormItemsDefinition | undefined,
): Resolver<FieldValues> => {
  const baseResolver = zodResolver(makeFormItemsValueSchema(items));
  return async (values, context, options) => {
    const result = await baseResolver(values, context, options);
    if (!result.errors || Object.keys(result.errors).length === 0) {
      return result;
    }
    const visibleIds = getVisibleIds(items, values);
    const filteredErrors = Object.fromEntries(
      Object.entries(result.errors).filter(([key]) => visibleIds.has(key)),
    );
    if (Object.keys(filteredErrors).length === 0) {
      return { values, errors: {} };
    }
    return { values: result.values, errors: filteredErrors };
  };
};

export { makeVisibilityAwareResolver };
