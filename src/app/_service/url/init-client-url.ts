import { setCurrentUrlGetter } from ".";

const url = typeof window !== "undefined" ? window.location.href : "";

setCurrentUrlGetter(() => new URL(typeof window !== "undefined" ? window.location.href : ""));
