# Roadmap

## Task Guidelines

- Each task = 1 PR that is **safe to merge independently**
- If merging task A without task B would leave the app broken or inconsistent for users, combine them into a single task

---

## Issue #17: Add prefilledParams and viewUrl to POST payload

| # | Task | Deps | Status | Task File |
|---|------|------|--------|-----------|
| 1 | Extract `makePrefilledParams` function from `makePrevilledUrl` | — | ✅ Done | [20260309-01](completed/20260309-01-extract-make-prefilled-params.md) |
| 2 | Add `prefilledParams` and `viewUrl` to POST payload | 1 | ✅ Done | [20260309-02](completed/20260309-02-add-prefilled-params-to-payload.md) |
| 3 | Close issue #17 | 1, 2 | ✅ Done | [20260309-03](completed/20260309-03-close-issue-17.md) |

## Issue #20: Add conditional visibility for form items using dynamic-form-rules

| # | Task | Deps | Status | Task File |
|---|------|------|--------|-----------|
| 1 | Add `visible_when` field to form item schema | — | | [20260311-01](20260311-01-add-visible-when-schema.md) |
| 2 | Render conditional visibility with validation and submission handling | 1 | | [20260311-02](20260311-02-render-conditional-visibility.md) |
| 3 | Update documentation and close issue #20 | 1, 2 | | [20260311-04](20260311-04-update-docs-and-close-issue.md) |
