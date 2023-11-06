import { headers } from "next/headers";
import { setCurrentUrlGetter } from "./";

setCurrentUrlGetter(() => new URL(headers().get("x-url") || ""));
