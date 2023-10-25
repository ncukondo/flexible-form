import { ParamObject, flattenObject } from "@lib/flatten-object";
import { toShortUUID } from "@lib/uuid";

let url: null | string = null;

const initCurrentUrl = (url_: string) => {
  url = url_;
};

const currentUrl = () => {
  if (url === null)
    throw new Error(
      "url is not initialized. Please call initCurrentUrl(url) in url/server.ts or url/client.ts",
    );
  return new URL(url);
};

const loginUrl = () => {
  const url = currentUrl().origin + "/api/auth/login";
  const currentPath = currentUrl().pathname + currentUrl().search;
  return url + "?returnTo=" + encodeURIComponent(currentPath);
};

const logoutUrl = () => {
  return currentUrl().origin + "/api/auth/logout";
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
  const search = new URLSearchParams(params).toString();
  return `${origin}/v/${toShortUUID(id_for_view)}?${search}`;
};

export { currentUrl, makePrevilledUrl, initCurrentUrl, loginUrl, logoutUrl };
