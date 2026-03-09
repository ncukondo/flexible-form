# Flexible Form — Agent Guidelines

## Project

A Next.js-based dynamic form builder with Prisma + PostgreSQL.

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma
- **Email:** Resend

## Key Paths

| Path | Purpose |
|------|---------|
| `src/common/` | Shared utilities (URL helpers, flatten-object, etc.) |
| `src/features/` | Feature modules (defined-form, form-definition, etc.) |
| `src/app/` | Next.js app router pages |
| `prisma/` | Database schema |
| `spec/tasks/` | Task specs and ROADMAP |
| `scripts/` | Shell scripts for agent workflow |

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx prisma generate  # Generate Prisma client
```

## Conventions

- Spec files and task files are written in **English**
- Task file naming: `YYYYMMDD-NN-kebab-case.md`
- Completed tasks are moved to `spec/tasks/completed/`
- Follow TDD: Red → Green → Refactor
- Commit messages: concise, lowercase, imperative

## Agent Workflow

### tmux Standards

- Send text and Enter separately with `sleep 1` between
- Use `tmux send-keys` for reliable delivery
- Maximum 4 concurrent worker panes

### Worktree Isolation

- All agent work occurs in worktrees at `/workspaces/flexible-form--worktrees/<branch-name>`
- Never modify main repo directly from worker agents

### Roles

<!-- role: none -->

- **implement**: Follow task spec TDD steps, create PR on completion
- **review**: Assess PR quality, post findings via `gh`, no code changes
