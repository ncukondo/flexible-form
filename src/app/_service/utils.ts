import { ParamObject, unFlattenObject } from "../_lib/flatten-object";
import { SearchParams } from "../edit/page";

export const makeDefaultValues = (urlParams: SearchParams) => {
  if (!urlParams) return {};
  if (typeof urlParams === "string") return {};
  const { data } = unFlattenObject(urlParams);
  return (data as ParamObject) ?? {};
};
