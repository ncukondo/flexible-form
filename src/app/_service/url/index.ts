import { ParamObject, flattenObject } from "@lib/flatten-object";
import { toShortUUID } from "@lib/uuid";

let url: null | string = null;
let currentUrlGetter: (() => URL) | null = null;

const setCurrentUrlGetter = (getter: () => URL) => {
  currentUrlGetter = getter;
};

const currentUrl = () => {
  if (currentUrlGetter === null)
    throw new Error(
      `url is not initialized. Please call import @service/url/init-client-url or @service/url/init-server-url`,
    );
  return currentUrlGetter();
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

export { currentUrl, makePrevilledUrl, setCurrentUrlGetter, loginUrl, logoutUrl };
