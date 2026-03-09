# Skill: status

Show project health dashboard.

## Trigger

User runs `/status`.

## Workflow

1. **Git status** — Branch, uncommitted changes
2. **Worktrees** — List active worktrees
3. **Active agents** — Check tmux panes
4. **Tasks** — Read ROADMAP, show counts (Done / In Progress / Not Started)
5. **Open PRs** — `gh pr list`
6. **Open issues** — `gh issue list`

## Output Format

```
Branch:     main (clean)
Worktrees:  2 active
Agents:     1 working, 1 idle
Tasks:      3 total (1 done, 1 in progress, 1 not started)
PRs:        1 open (#18)
Issues:     2 open (#13, #17)
```
