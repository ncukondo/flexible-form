import { ParamObject, flattenObject } from "../_lib/flatten-object";
import { toShortUUID } from "../_lib/uuid";

const currentUrl = () => {
  // set x-url header in middleware.ts
  const url = typeof document !== "undefined" ? document.URL : "";
  return new URL(url);
};

const makePrevilledUrl = (values: ParamObject, id_for_view: string) => {
  const origin = currentUrl().origin;
  console.log(values);
  const flatten = flattenObject({ data: values as any });
  const params = Object.fromEntries(
    Object.entries(flatten).filter(
      ([k, v]) => v !== undefined || v !== null || v !== "" || v !== false,
    ),
  );
  console.log(params);
  const search = new URLSearchParams(params).toString();
  return `${origin}/v/${toShortUUID(id_for_view)}?${search}`;
};

export { currentUrl, makePrevilledUrl };
