# Skill: test

Run quality checks and report results.

## Trigger

User runs `/test`.

## Workflow

1. **Run lint** — `npm run lint`
2. **Run build** — `npm run build`
3. **Report results** — Pass/fail summary with error details if any

## Rules

- Run all checks even if one fails
- Show concise output, highlight failures
- Suggest fixes for common issues
