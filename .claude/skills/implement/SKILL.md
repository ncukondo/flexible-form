# Skill: implement

Implement tasks from spec files using TDD in isolated worktrees.

## Trigger

User runs `/implement <task-file>` or `/implement` (auto-detect next task from ROADMAP).

## Workflow

1. **Read ROADMAP** — Find the next "Not Started" or "In Progress" task
2. **Read task spec** — Understand purpose, related files, and steps
3. **Create worktree branch** — `task/<YYYYMMDD-NN-short-name>`
4. **For each implementation step:**
   - Follow the TDD cycle (Red → Green → Refactor)
   - Update task checkboxes as steps complete
   - Commit after each step
5. **Run quality checks** — `npm run lint && npm run build`
6. **Create PR** — Reference the issue number
7. **Update ROADMAP** — Mark task as "In Progress"

## Rules

- Work only in your worktree, never touch main directly
- Commit specific files, never `git add -A`
- Do not merge PRs, update ROADMAP status to "Done", or move task files to completed
- If context is running low, commit current progress and create the PR with [WIP] prefix
