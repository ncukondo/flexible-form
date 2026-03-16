import { describe, it, expect } from "vitest";
import { type ZodIssue, ZodIssueCode } from "zod";
import { resolveTomlLineNumber, formatZodIssue } from "../toml/error-format";

const sampleToml = `title = "My Form"
actions = "https://example.com"

[[items]]
type = "short_text"
title = "Name"

[[items]]
type = "choice"
title = "Color"
choices = ["red", "blue"]

[[items]]
type = "short_text"
title = "Age"
visible_when = 'name = "test"'`;

describe("resolveTomlLineNumber", () => {
  it("resolves a top-level field", () => {
    expect(resolveTomlLineNumber(sampleToml, ["title"])).toBe(1);
  });

  it("resolves actions field", () => {
    expect(resolveTomlLineNumber(sampleToml, ["actions"])).toBe(2);
  });

  it("resolves a field in the first item (index 0)", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 0, "title"])).toBe(6);
  });

  it("resolves a field in the second item (index 1)", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 1, "choices"])).toBe(11);
  });

  it("resolves a field in the third item (index 2)", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 2, "visible_when"])).toBe(16);
  });

  it("resolves [[items]] header when path is just items and index", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 1])).toBe(8);
  });

  it("returns null for a non-existent field", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 0, "nonexistent"])).toBeNull();
  });

  it("returns null for an out-of-range item index", () => {
    expect(resolveTomlLineNumber(sampleToml, ["items", 10, "title"])).toBeNull();
  });
});

describe("formatZodIssue", () => {
  const makeIssue = (path: (string | number)[], message: string): ZodIssue =>
    ({ code: ZodIssueCode.custom, path, message }) as ZodIssue;

  it("formats a top-level field error with line number", () => {
    const issue = makeIssue(
      ["title"],
      "String must contain at least 2 characters",
    );
    const result = formatZodIssue(issue, sampleToml);
    expect(result).toBe(
      "title (line 1): String must contain at least 2 characters",
    );
  });

  it("formats an item field error with ordinal and line number", () => {
    const result = formatZodIssue(makeIssue(["items", 0, "title"], "Required"), sampleToml);
    expect(result).toBe("title in 1st item (line 6): Required");
  });

  it("formats 2nd item correctly", () => {
    const issue = makeIssue(
      ["items", 1, "choices"],
      "Must be an array of unique strings",
    );
    const result = formatZodIssue(issue, sampleToml);
    expect(result).toBe(
      "choices in 2nd item (line 11): Must be an array of unique strings",
    );
  });

  it("formats 3rd item correctly", () => {
    const result = formatZodIssue(makeIssue(["items", 2, "visible_when"], "Invalid"), sampleToml);
    expect(result).toBe("visible_when in 3rd item (line 16): Invalid");
  });

  it("omits line number when it cannot be resolved", () => {
    const result = formatZodIssue(makeIssue(["items", 10, "title"], "Required"), sampleToml);
    expect(result).toBe("title in 11th item: Required");
  });

  it("uses ordinal 4th for index 3", () => {
    const result = formatZodIssue(makeIssue(["items", 3, "title"], "Required"), sampleToml);
    expect(result).toMatch(/4th item/);
  });
});
