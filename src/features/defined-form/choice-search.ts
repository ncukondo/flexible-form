const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;

const normalize = (text: string) =>
  text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, char =>
      String.fromCharCode(char.charCodeAt(0) - KATAKANA_TO_HIRAGANA_OFFSET),
    )
    .trim();

const matchesQuery = (title: string, query: string) => {
  const normalizedQuery = normalize(query);
  return normalizedQuery !== "" && normalize(title).includes(normalizedQuery);
};

/** A checkbox group holds an array, but a url can give a single value and an empty one is false. */
const toSelectedValues = (value: unknown): readonly string[] => {
  if (Array.isArray(value)) return value;
  return typeof value === "string" && value !== "" ? [value] : [];
};

export { matchesQuery, toSelectedValues };
