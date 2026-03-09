# Skill: review-pr

Review a pull request thoroughly and post findings.

## Trigger

User runs `/review-pr <number>` or `/review-pr` (auto-detect open PRs).

## Workflow

1. **Fetch PR details** — `gh pr view <number>`
2. **Read the diff** — `gh pr diff <number>`
3. **Read related task spec** — Understand acceptance criteria
4. **Run checks locally** (if in worktree):
   - `npm run lint`
   - `npm run build`
5. **Post review** via `gh pr review`:
   - Critical/major issues → `--request-changes`
   - Minor/suggestions only → `--approve` or `--comment`
6. **Report findings** — All issues including minor ones

## Rules

- Do not modify code
- Do not merge PRs
- Report ALL findings, not just blockers
- Use structured format: Critical / Major / Minor / Suggestions
