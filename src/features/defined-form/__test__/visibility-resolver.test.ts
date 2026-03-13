import { describe, it, expect } from "vitest";
import type { FormItemsDefinition } from "../../form-definition/schema";
import { makeVisibilityAwareResolver } from "../visibility-resolver";

const makeItems = (): FormItemsDefinition => [
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
];

const resolve = async (
  items: FormItemsDefinition,
  values: Record<string, unknown>,
) => {
  const resolver = makeVisibilityAwareResolver(items);
  return resolver(values, undefined, {} as any);
};

describe("makeVisibilityAwareResolver", () => {
  it("returns no errors when all visible required fields are filled", async () => {
    const result = await resolve(makeItems(), { name: "Alice", reason: "test" });
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("returns error for visible required field that is empty", async () => {
    const result = await resolve(makeItems(), { name: "Alice", reason: "" });
    expect(result.errors).toHaveProperty("reason");
  });

  it("filters out errors for hidden required fields", async () => {
    const result = await resolve(makeItems(), { name: "Bob", reason: "" });
    expect(result.errors).not.toHaveProperty("reason");
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("returns error for visible required field even when hidden field also has error", async () => {
    const result = await resolve(makeItems(), { name: "", reason: "" });
    expect(result.errors).toHaveProperty("name");
    expect(result.errors).not.toHaveProperty("reason");
  });

  it("handles undefined items", async () => {
    const resolver = makeVisibilityAwareResolver(undefined);
    const result = await resolver({}, undefined, {} as any);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
