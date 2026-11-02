# Task: Stop logging https action payloads

## Purpose

The https action logs the full payload, the destination URL and the response body.
The payload holds respondents' input and the URL may contain a signature, so neither
should remain in server logs.

## Related Source Files

- `src/features/defined-form/actions.ts`
- `src/features/defined-form/__test__/actions-log.test.ts`

## Implementation Steps

### Step 1: Log only destination type and status

- [x] Write test: https logs contain only the type and status, on success and on failure
- [x] Write test: the https request, the redirect and the `log:` output stay unchanged
- [x] Implement: remove the payload, URL and response body from https logs
- [x] Run `npm test`, `npx tsc --noEmit` and `npm run lint`
- [x] Acceptance: no respondent input, URL or response body in https logs

## Out of Scope

- `log:` output, which is an explicit choice of the form owner
- `mailto:` logging in `send-mail.ts`
