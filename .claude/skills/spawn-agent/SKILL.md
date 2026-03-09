---
name: spawn-agent
description: Spawns a Claude agent in a worktree for implementation, review, or custom tasks.
---

# Spawn Agent

Claude agent to launch in a worktree for implementation, review, research, or custom tasks.

## Usage

```bash
# Worker agent for a task
./scripts/spawn-worker.sh <branch-name> "<prompt>"

# Reviewer agent for a PR
./scripts/spawn-reviewer.sh <pr-number>
./scripts/spawn-reviewer.sh <branch-name> <pr-number>

# Generic agent (existing worktree)
./scripts/spawn-agent.sh feat/my-feature -- "investigate auth flow"

# Generic agent (auto-create worktree)
./scripts/spawn-agent.sh feat/new-feature --create -- "design new feature"

# PR comment response agent
./scripts/spawn-agent.sh --pr 123 -- "address PR #123 comments"

# Interactive mode (no prompt)
./scripts/spawn-agent.sh feat/my-feature

# Main repo agent
./scripts/spawn-agent.sh --main -- "investigate overall architecture"
```

## Options

| Option | Description |
|:-------|:------------|
| `--pr <number>` | Launch from PR number (auto-detect branch, auto-create worktree) |
| `--create` | Create worktree if it doesn't exist |
| `--role <role>` | Set role in CLAUDE.md (implement, review) |
| `--main` | Use main repo instead of worktree |
| `-- <prompt>` | Prompt to send on start (omit for interactive) |

## Monitoring

```bash
# Check active agents
./scripts/monitor-agents.sh

# Watch continuously
./scripts/monitor-agents.sh --watch

# Start orchestrator (auto-detects events)
./scripts/orchestrate.sh --background
```

## Rules

- Maximum 4 concurrent agent panes
- All work in worktrees, never main repo
- Send text and Enter separately with `sleep 1` between
- Use `scripts/send-to-agent.sh` for reliable prompt delivery
