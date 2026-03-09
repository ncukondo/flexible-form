# Task: Add prefilledParams and viewUrl to POST Payload

## Purpose

Add `prefilledParams` and `viewUrl` fields to the POST payload so that receiving services can construct a prefilled URL with simple string concatenation, without implementing dot-notation flattening logic themselves (issue #17).

## Related Source Files

- `src/features/defined-form/actions.ts` — builds and sends the POST payload
- `src/common/url/index.ts` — provides `makePrefilledParams` (from task 1) and `getViewUrl`

## Implementation Steps

### Step 1: Add `prefilledParams` and `viewUrl` to the payload

- [ ] Import `makePrefilledParams` and `getViewUrl` in `actions.ts`
- [ ] Add `prefilledParams` field using `makePrefilledParams(value)`
- [ ] Add `viewUrl` field using the full absolute URL from `getViewUrl(idForView)`
- [ ] Run `npm run lint && npm run typecheck`
- [ ] Acceptance: POST payload includes both new fields as described in issue #17

### Expected payload shape

```json
{
  "form": "abc123xyz",
  "title": "Form Title",
  "description": "Description",
  "value": { ... },
  "keys": ["name", "email", "category"],
  "schema": [...],
  "prefilledParams": "data.name=%E5%B1%B1%E7%94%B0&data.email=taro%40example.com",
  "viewUrl": "https://your-domain.com/v/abc123xyz"
}
```
