# Task: Stop logging mail content

## Purpose

The mailto action logs the whole message: the address, the subject and the body. The body holds
respondents' input, so it should not remain in server logs. This follows the same change for https
actions.

## Related Source Files

- `src/features/defined-form/send-mail.ts`
- `src/features/defined-form/__test__/send-mail-log.test.ts`

## Implementation Steps

### Step 1: Remove the message from the log

- [x] Write test: the log holds no address, subject or body
- [x] Write test: the mail sent stays the same
- [x] Implement: remove the log of the message and keep `mail sent`
- [x] Run `npm test`, `npx tsc --noEmit` and `npm run lint`
- [x] Acceptance: no message content in mailto logs
