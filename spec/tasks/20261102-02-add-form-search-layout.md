# Task: Add a search layout for long multiple choice forms

## Purpose

Forms with hundreds of multiple choice options are hard to read and fill in, especially on a
smartphone. An optional form-level setting replaces the long lists with one search box and a list
of selected choices per item, without changing the url format or the submitted data.

## Related Source Files

- `src/features/form-definition/schema.ts`
- `src/features/defined-form/defined-form.tsx`
- `src/features/defined-form/form-item.tsx`
- `src/features/defined-form/choice-search.ts`
- `src/features/defined-form/choice-search-panel.tsx`

## Implementation Steps

### Step 1: Pin the current behaviour

- [x] Write test: initial selection and webhook body of the default layout, as literal values

### Step 2: Add the setting and the search panel

- [x] Write test: the webhook body is byte-identical between layouts, untouched and after changes
- [x] Write test: partial match across items, category names, selected groups, input method
- [x] Implement: optional `layout = "search"` and the search panel
- [x] Run `npm test`, `npx tsc --noEmit`, `npm run lint` and `npm run build`
- [x] Acceptance: forms without the setting render as before

### Step 3: Verify in a browser

- [x] Compare `log:` output between layouts on a local database, at smartphone width
