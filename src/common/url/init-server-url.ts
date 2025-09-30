import { headers } from "next/headers";
import { setCurrentUrlGetter } from "./";

export const initServerUrl = async () => {
  const headerList = await headers();
  const url = headerList.get("x-url");
  if (!url) return;
  setCurrentUrlGetter(() => new URL(url));
};
