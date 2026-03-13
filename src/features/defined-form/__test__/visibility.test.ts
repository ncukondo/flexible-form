import { describe, it, expect } from "vitest";
import type { FormItemsDefinition } from "../../form-definition/schema";
import { isVisible, getVisibleItems, getVisibleIds } from "../visibility";

describe("isVisible", () => {
  it("returns true when visibleWhen is undefined", () => {
    expect(isVisible(undefined, {})).toBe(true);
  });

  it("returns true when expression evaluates to true", () => {
    expect(isVisible('color = "red"', { color: "red" })).toBe(true);
  });

  it("returns false when expression evaluates to false", () => {
    expect(isVisible('color = "red"', { color: "blue" })).toBe(false);
  });

  it("returns true for invalid syntax (safe fallback)", () => {
    expect(isVisible("{{{bad", { x: "1" })).toBe(true);
  });

  it("returns true when referenced key is missing", () => {
    expect(isVisible('missing = "yes"', {})).toBe(false);
  });
});

const makeItems = (): FormItemsDefinition => [
  {
    type: "short_text",
    id: "name",
    title: "Name",
    description: "",
    required: false,
    visible_when: undefined,
  },
  {
    type: "long_text",
    id: "reason",
    title: "Reason",
    description: "",
    required: false,
    visible_when: 'name = "Alice"',
  },
];

describe("getVisibleItems", () => {
  it("returns all items when no visible_when rules", () => {
    const items = makeItems();
    items[1].visible_when = undefined;
    const result = getVisibleItems(items, { name: "" });
    expect(result).toHaveLength(2);
  });

  it("filters out items where visible_when is false", () => {
    const result = getVisibleItems(makeItems(), { name: "Bob" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("name");
  });

  it("shows items where visible_when is true", () => {
    const result = getVisibleItems(makeItems(), { name: "Alice" });
    expect(result).toHaveLength(2);
  });

  it("returns empty array for undefined items", () => {
    expect(getVisibleItems(undefined, {})).toEqual([]);
  });

  it("defaults missing field keys to empty string", () => {
    const result = getVisibleItems(makeItems(), {});
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("name");
  });
});

describe("getVisibleIds", () => {
  it("returns item ids for visible items", () => {
    const ids = getVisibleIds(makeItems(), { name: "Alice" });
    expect(ids.has("name")).toBe(true);
    expect(ids.has("reason")).toBe(true);
  });

  it("expands choice_table sub-item ids", () => {
    const items: FormItemsDefinition = [
      {
        type: "choice_table",
        id: "ratings",
        title: "Ratings",
        description: "",
        required: false,
        visible_when: undefined,
        multiple: false,
        items: [
          { title: "Q1", id: "ratings/q1" },
          { title: "Q2", id: "ratings/q2" },
        ],
        choices: [
          { title: "Good", value: "good" },
          { title: "Bad", value: "bad" },
        ],
      },
    ];
    const ids = getVisibleIds(items, {});
    expect(ids.has("ratings/q1")).toBe(true);
    expect(ids.has("ratings/q2")).toBe(true);
    expect(ids.has("ratings")).toBe(false);
  });

  it("excludes hidden item ids", () => {
    const ids = getVisibleIds(makeItems(), { name: "Bob" });
    expect(ids.has("name")).toBe(true);
    expect(ids.has("reason")).toBe(false);
  });
});