# Task: Improve TOML editor error messages

## Purpose

The TOML editor currently displays raw Zod error JSON and a generic "Invalid visible_when syntax" message, making it hard for form creators to understand what went wrong and where. This task restructures error display to show per-issue messages with item context and TOML line numbers.

## Related Source Files

- `src/features/form-definition/schema.ts` — Zod schemas with validation rules
- `src/features/form-definition/store.ts` — stores raw `error.message` string
- `src/features/form-definition/toml/error-display.tsx` — renders error alert
- `src/features/form-definition/toml/store.ts` — TOML parse and derived JSON store

## Current Behavior

- `store.ts` saves `res.error.message` (Zod's JSON-serialized issue array) as a plain string
- `error-display.tsx` renders that string inside a single alert box
- `visible_when` validation returns a fixed message: `"Invalid visible_when syntax"`
- Users see something like: `SchemaError: [{"code":"too_small","minimum":2,...}]`

## Desired Behavior

Structured, human-readable error list with location context:

```
title (line 1): String must contain at least 2 characters
actions (line 2): Invalid url
choices in 1st item (line 12): Must be an array of unique strings
visible_when in 2nd item (line 18): Expected value after "=" at position 5: "key1= and key2=2"
```

## Implementation Steps

### Step 1: Change store to keep structured ZodIssues

- [ ] In `src/features/form-definition/store.ts`, change `error: string` to `error: ZodIssue[]` (empty array = no error)
- [ ] On validation failure, store `res.error.issues` instead of `res.error.message`
- [ ] Acceptance: store exposes `ZodIssue[]`; existing `error-display.tsx` will break (expected, fixed in step 3)

### Step 2: Improve `visible_when` validation messages

- [ ] In `schema.ts`, change the `visibleWhen` refine to call `safeParseSource(val)` and, on failure, build a message from `result.pos` and `result.expect`
- [ ] Message format: `Invalid visible_when: expected <expect> at position <pos>`
- [ ] Acceptance: a malformed `visible_when` value produces a descriptive message including what was expected and where

### Step 3: Add TOML line number resolution

- [ ] Create a utility function `resolveTomlLineNumber(tomlText: string, zodPath: (string | number)[]) => number | null`
- [ ] Logic: split TOML text by lines, track `[[items]]` occurrences to map item index, then search for the field name within that block
- [ ] Acceptance: given a Zod path like `["items", 0, "choices"]` and TOML text, returns the correct line number

### Step 4: Format error messages with context

- [ ] Create a formatter function `formatZodIssue(issue: ZodIssue, tomlText: string) => string`
- [ ] For top-level fields (e.g., `["title"]`): `title (line X): <message>`
- [ ] For item fields (e.g., `["items", N, "choices"]`): `choices in Nth item (line X): <message>`
- [ ] Use ordinal formatting: 1st, 2nd, 3rd, 4th, ...
- [ ] If line number cannot be resolved, omit the `(line X)` part
- [ ] Acceptance: each ZodIssue is formatted as a single readable line

### Step 5: Update error-display component

- [ ] Rewrite `error-display.tsx` to read `ZodIssue[]` from the store and TOML text from `useTomlText`
- [ ] Render each formatted error as a list item inside the alert
- [ ] Keep SyntaxError (TOML parse error) display as-is — it already includes position info from `@ltd/j-toml`
- [ ] Run `npm run lint && npm run build`
- [ ] Acceptance: TOML editor shows a readable list of errors with field names, item context, and line numbers
