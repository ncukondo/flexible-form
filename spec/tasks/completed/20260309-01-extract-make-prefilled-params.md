# Task: Extract makePrefilledParams Function

## Purpose

Extract the query string generation logic from `makePrevilledUrl` into a standalone `makePrefilledParams` function. This is a prerequisite for including prefilled parameters in the POST payload (issue #17).

## Related Source Files

- `src/common/url/index.ts` — contains `makePrevilledUrl`
- `src/common/flatten-object.ts` — provides `flattenObject` and `ParamObject`

## Implementation Steps

### Step 1: Create `makePrefilledParams` function

Extract the flattening and URLSearchParams logic from `makePrevilledUrl` into a new exported function `makePrefilledParams(values: ParamObject): string`.

- [x] Add `makePrefilledParams` to `src/common/url/index.ts`
  - Takes `values: ParamObject` as input
  - Flattens with `flattenObject({ data: values })`
  - Filters out empty/falsy values
  - Returns `new URLSearchParams(params).toString()`
- [x] Refactor `makePrevilledUrl` to use `makePrefilledParams` internally
- [x] Run `npm run lint && npm run typecheck`
- [x] Acceptance: `makePrefilledParams` is exported and `makePrevilledUrl` still works correctly
