import { initCurrentUrl } from ".";

const url = typeof window !== "undefined" ? window.location.href : "";

initCurrentUrl(url);
