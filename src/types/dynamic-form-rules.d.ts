declare module "@ncukondo/dynamic-form-rules" {
  export function safeParseSource(source: string): { ok: true; pos: number; value: unknown } | { ok: false; pos: number; expect: string };
  export function evaluateRule(rule: unknown, values: Record<string, string | string[]>): boolean;
  export function evaluateRuleDict(rules: Record<string, unknown>, values: Record<string, string | string[]>): Record<string, boolean>;
  export function extractDependentKeys(rule: unknown): string[];
  export function ruleToSource(rule: unknown): string;
  export function safeParseObject(obj: unknown): { ok: true; value: unknown } | { ok: false };
  export type Rule = unknown;
  export type KeyValues = Record<string, string | string[]>;
}
