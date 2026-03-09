# Skill: merge-pr

Merge an approved PR and clean up.

## Trigger

User runs `/merge-pr <number>`.

## Workflow

1. **Check PR status** — Must be approved, CI passing
2. **Merge** — `gh pr merge <number> --squash --delete-branch`
3. **Clean up worktree** if exists:
   - `git worktree remove <path>`
4. **Update task spec** — Check all boxes
5. **Move task file** to `spec/tasks/completed/`
6. **Update ROADMAP** — Mark as "Done"
7. **Check if all tasks for the issue are done** — If so, note it for closure

## Rules

- Only merge approved PRs with passing CI
- Default to squash merge
- Always clean up worktrees and branches
