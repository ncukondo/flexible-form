import { setCurrentUrlGetter } from ".";


setCurrentUrlGetter(() => new URL(typeof window !== "undefined" ? window.location.href : ""));
