import {
  evaluateRule,
  safeParseSource,
  type KeyValues,
} from "@ncukondo/dynamic-form-rules";
import type { FormItemsDefinition } from "../form-definition/schema";

const isVisible = (
  visibleWhen: string | undefined,
  formValues: KeyValues,
): boolean => {
  if (!visibleWhen) return true;
  const parsed = safeParseSource(visibleWhen);
  if (!parsed.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[visible_when] failed to parse: "${visibleWhen}"`);
    }
    return true;
  }
  try {
    return evaluateRule(formValues, parsed.value);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[visible_when] evaluation error for: "${visibleWhen}"`, e);
    }
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

export { getVisibleItems, getVisibleIds, isVisible, toStringValues };
