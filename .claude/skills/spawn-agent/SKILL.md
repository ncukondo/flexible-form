# Skill: spawn-agent

Launch an agent in a tmux pane with an isolated worktree.

## Trigger

User runs `/spawn-agent <role> [options]`.

Roles: `implement`, `review`

Options:
- `--task <task-file>` — Specify task to work on
- `--pr <number>` — Specify PR to review
- `--branch <name>` — Specify branch name

## Workflow

1. **Create worktree** if needed — `scripts/spawn-worker.sh` or `scripts/spawn-reviewer.sh`
2. **Launch agent** in new tmux pane
3. **Set role** in worktree's CLAUDE.md
4. **Send initial prompt** based on role

## Rules

- Maximum 4 concurrent agent panes
- All work in worktrees, never main repo
- Send text and Enter separately with `sleep 1` between
