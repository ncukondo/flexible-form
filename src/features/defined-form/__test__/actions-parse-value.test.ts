import { describe, it, expect } from "vitest";
import type { FormDefinitionForView } from "../../form-definition/schema";
import { parseValue } from "../parse-value";

const makeDefinition = (
  overrides?: Partial<FormDefinitionForView>,
): FormDefinitionForView => ({
  title: "Test",
  description: "",
  items: [
    {
      type: "short_text",
      id: "name",
      title: "Name",
      description: "",
      required: true,
      visible_when: undefined,
    },
    {
      type: "long_text",
      id: "reason",
      title: "Reason",
      description: "",
      required: true,
      visible_when: 'name = "Alice"',
    },
  ],
  ...overrides,
});

describe("parseValue", () => {
  it("succeeds when hidden required field is missing from payload", () => {
    const result = parseValue({ name: "Bob" }, makeDefinition());
    expect(result.value).toEqual({ name: "Bob" });
    expect(result.keys).toEqual(["name"]);
  });

  it("parses both fields when both are visible", () => {
    const result = parseValue(
      { name: "Alice", reason: "test" },
      makeDefinition(),
    );
    expect(result.value).toEqual({ name: "Alice", reason: "test" });
    expect(result.keys).toEqual(["name", "reason"]);
  });

  it("throws when visible required field is empty", () => {
    expect(() => parseValue({ name: "" }, makeDefinition())).toThrow();
  });

  it("throws when visible required field is missing", () => {
    expect(() => parseValue({}, makeDefinition())).toThrow();
  });

  it("returns full schema in result regardless of visibility", () => {
    const def = makeDefinition();
    const result = parseValue({ name: "Bob" }, def);
    expect(result.schema).toEqual(def.items);
  });
});
