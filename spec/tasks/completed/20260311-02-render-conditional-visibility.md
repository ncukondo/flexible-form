# Task: Render conditional visibility with validation and submission handling

## Purpose

Evaluate `visible_when` rules at render time and show/hide form items based on other fields' values. Hidden fields must not block validation and their stale values must be excluded from the submission payload (issue #20).

## Related Source Files

- `src/features/defined-form/defined-form.tsx` — form rendering, needs `watch()` integration
- `src/features/defined-form/form-item.tsx` — individual form item rendering (no change expected)
- `src/features/defined-form/form-value-schema.ts` — Zod validation schema generation
- `src/features/defined-form/actions.ts` — server action payload construction

## Implementation Steps

### Step 1: Add visibility evaluation logic

- [ ] Create a helper (e.g. `useVisibleItems` hook or inline function) that:
  - Parses `visible_when` via `safeParseSource`
  - Evaluates parsed rule against current form values via `evaluateRule`
  - Returns `true` if no `visible_when` is set or rule evaluates to `true`
- [ ] Use `watch()` from React Hook Form to observe form values for re-evaluation
- [ ] Conditionally render `<FormItem>` only when visibility evaluates to `true`
- [ ] Run `npm run lint && npm run build`
- [ ] Acceptance: form items with `visible_when` appear/disappear as dependent field values change

### Step 2: Make hidden fields optional in validation

- [ ] Modify `makeFormItemsValueSchema` (or the submit flow) so that fields whose `visible_when` evaluates to `false` are treated as optional, regardless of `required` flag
- [ ] Run `npm run lint && npm run build`
- [ ] Acceptance: a hidden required field does not prevent form submission

### Step 3: Exclude hidden field values from submission payload

- [ ] On submit, evaluate each item's `visible_when` against submitted values
- [ ] Remove or clear values of hidden fields before sending payload
- [ ] Run `npm run lint && npm run build`
- [ ] Acceptance: submitted payload does not contain values for fields that were hidden at submission time
