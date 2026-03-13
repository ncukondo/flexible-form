# Task: Add `visible_when` field to form item schema

## Purpose

Add an optional `visible_when` field to the form item schema so that form items can declare visibility conditions. This is the foundation for conditional form item visibility (issue #20).

## Related Source Files

- `src/features/form-definition/schema.ts` — form item Zod schema
- `package.json` — add `@ncukondo/dynamic-form-rules` dependency

## Implementation Steps

### Step 1: Install `@ncukondo/dynamic-form-rules`

- [ ] Run `npm install @ncukondo/dynamic-form-rules`
- [ ] Acceptance: package is listed in `package.json` dependencies

### Step 2: Add `visible_when` to `basicFormItem`

- [ ] Import `safeParseSource` from `@ncukondo/dynamic-form-rules`
- [ ] Add `visible_when: z.string().optional()` to `basicFormItem`
- [ ] Add a `.refine()` that validates syntax via `safeParseSource` when value is present
- [ ] Run `npm run lint && npm run build`
- [ ] Acceptance: form definitions with valid `visible_when` parse correctly; invalid syntax produces a validation error
