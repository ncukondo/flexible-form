import { headers } from "next/headers";

const currentUrl = () => {
  // set x-url header in middleware.ts
  const url = headers().get("x-url") || "";
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

export { currentUrl, loginUrl, logoutUrl };
