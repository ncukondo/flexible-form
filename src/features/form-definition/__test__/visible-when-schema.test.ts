import { describe, it, expect } from "vitest";
import { safeParseFormDefinition } from "../schema";

const makeFormDef = (itemOverrides: Record<string, unknown> = {}) => ({
  title: "Test Form",
  actions: "https://example.com",
  items: [
    {
      type: "short_text" as const,
      title: "Name",
      ...itemOverrides,
    },
  ],
});

describe("visible_when schema field", () => {
  it("accepts a form item without visible_when", () => {
    const result = safeParseFormDefinition(makeFormDef());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items[0].visible_when).toBeUndefined();
    }
  });

  it("accepts a valid visible_when expression", () => {
    const result = safeParseFormDefinition(makeFormDef({ visible_when: 'age = "18"' }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items[0].visible_when).toBe('age = "18"');
    }
  });

  it("accepts a visible_when with 'in' operator", () => {
    const def = makeFormDef({ visible_when: 'color in ["red","blue"]' });
    const result = safeParseFormDefinition(def);
    expect(result.success).toBe(true);
  });

  it("accepts a visible_when with logical operators", () => {
    const def = makeFormDef({ visible_when: '(a = "1") and (b = "2")' });
    const result = safeParseFormDefinition(def);
    expect(result.success).toBe(true);
  });

  it("rejects empty string visible_when", () => {
    const result = safeParseFormDefinition(makeFormDef({ visible_when: "" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages.some(m => m.startsWith("Invalid visible_when:"))).toBe(true);
    }
  });

  it("rejects invalid visible_when syntax with descriptive message", () => {
    const result = safeParseFormDefinition(makeFormDef({ visible_when: "{{{invalid" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      const msg = messages.find(m => m.startsWith("Invalid visible_when:"));
      expect(msg).toBeDefined();
      expect(msg).toMatch(/expected .+ at position \d+/);
    }
  });

  it("works with choice item type", () => {
    const result = safeParseFormDefinition({
      title: "Test Form",
      actions: "https://example.com",
      items: [
        {
          type: "choice",
          title: "Favorite Color",
          choices: ["red", "blue"],
          visible_when: 'name = "Alice"',
        },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items[0].visible_when).toBe('name = "Alice"');
    }
  });

  it("works with constant item type", () => {
    const result = safeParseFormDefinition({
      title: "Test Form",
      actions: "https://example.com",
      items: [
        {
          type: "constant",
          title: "Hidden Note",
          value: "some value",
          visible_when: 'status = "active"',
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
