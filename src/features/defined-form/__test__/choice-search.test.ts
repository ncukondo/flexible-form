import { describe, expect, it } from "vitest";
import { matchesQuery, toSelectedValues } from "../choice-search";

describe("matchesQuery", () => {
  it("matches any part of the title", () => {
    expect(matchesQuery("全身倦怠感", "倦怠")).toBe(true);
    expect(matchesQuery("全身倦怠感", "腹痛")).toBe(false);
  });

  it("does not match an empty or blank query", () => {
    expect(matchesQuery("発熱", "")).toBe(false);
    expect(matchesQuery("発熱", "  　")).toBe(false);
  });

  it("ignores surrounding spaces, including full-width ones", () => {
    expect(matchesQuery("発熱", "　発熱 ")).toBe(true);
  });

  it("treats full-width and half-width characters alike", () => {
    expect(matchesQuery("CT検査", "ｃｔ")).toBe(true);
    expect(matchesQuery("ビタミンB12欠乏性貧血", "ﾋﾞﾀﾐﾝ")).toBe(true);
  });

  it("treats hiragana and katakana alike", () => {
    expect(matchesQuery("ビタミンB12欠乏性貧血", "びたみん")).toBe(true);
    expect(matchesQuery("めまい", "メマイ")).toBe(true);
  });
});

describe("toSelectedValues", () => {
  it("returns an array of values as it is", () => {
    expect(toSelectedValues(["a", "b"])).toEqual(["a", "b"]);
  });

  it("wraps a single value given by the url", () => {
    expect(toSelectedValues("a")).toEqual(["a"]);
  });

  it("treats anything else as no selection", () => {
    expect(toSelectedValues(false)).toEqual([]);
    expect(toSelectedValues(undefined)).toEqual([]);
    expect(toSelectedValues("")).toEqual([]);
  });
});
