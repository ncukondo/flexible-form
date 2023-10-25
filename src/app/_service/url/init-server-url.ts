import { headers } from "next/headers";
import { initCurrentUrl } from ".";

const url =
  typeof window !== "undefined"
    ? window.location.href
    : // set x-url header in middleware.ts
      headers().get("x-url") || "";

initCurrentUrl(url);
