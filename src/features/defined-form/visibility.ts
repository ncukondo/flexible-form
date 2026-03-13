import { zodResolver } from "@hookform/resolvers/zod";
import {
  evaluateRule,
  safeParseSource,
  type KeyValues,
} from "@ncukondo/dynamic-form-rules";
import type { FieldValues, Resolver } from "react-hook-form";
import { makeFormItemsValueSchema } from "./form-value-schema";
import type { FormItemsDefinition } from "../form-definition/schema";

const isVisible = (
  visibleWhen: string | undefined,
  formValues: KeyValues,
): boolean => {
  if (!visibleWhen) return true;
  const parsed = safeParseSource(visibleWhen);
  if (!parsed.ok) return true;
  try {
    return evaluateRule(formValues, parsed.value);
  } catch {
    return true;
  }
};

const toStringValues = (
  items: FormItemsDefinition | undefined,
  formValues: Record<string, unknown>,
): KeyValues => {
  const defaults: KeyValues = {};
  if (items) {
    for (const item of items) {
      if (item.type === "choice_table") {
        for (const sub of item.items) defaults[sub.id] = "";
      } else {
        defaults[item.id] = "";
      }
    }
  }
  for (const [k, v] of Object.entries(formValues)) {
    defaults[k] = String(v ?? "");
  }
  return defaults;
};

const getVisibleItems = (
  items: FormItemsDefinition | undefined,
  formValues: Record<string, unknown>,
): FormItemsDefinition => {
  if (!items) return [];
  const stringValues = toStringValues(items, formValues);
  return items.filter(item => isVisible(item.visible_when, stringValues));
};

const getVisibleIds = (
  items: FormItemsDefinition | undefined,
  formValues: Record<string, unknown>,
): Set<string> => {
  const visible = getVisibleItems(items, formValues);
  return new Set(visible.flatMap(item => {
    if (item.type === "choice_table") {
      return item.items.map(sub => sub.id);
    }
    return [item.id];
  }));
};

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

export { getVisibleItems, getVisibleIds, isVisible, makeVisibilityAwareResolver };
