#!/usr/bin/env bash
# Launch a Claude agent in a new tmux pane within a worktree.
# Usage: launch-agent.sh <worktree-path> [prompt]
set -euo pipefail

WORKTREE_PATH="${1:?Usage: launch-agent.sh <worktree-path> [prompt]}"
PROMPT="${2:-}"

PARENT_DIR="$(dirname "$(cd /workspaces/flexible-form && pwd)")"
ALLOWED_PREFIX="${PARENT_DIR}/flexible-form--worktrees"

if [[ "$WORKTREE_PATH" != "$ALLOWED_PREFIX"/* ]]; then
  echo "Error: worktree must be under $ALLOWED_PREFIX" >&2
  exit 1
fi

# Create new tmux pane
PANE_ID=$(tmux split-window -h -c "$WORKTREE_PATH" -P -F '#{pane_id}' 'bash')

# Wait for shell to be ready
sleep 2

# Launch Claude Code
tmux send-keys -t "$PANE_ID" "claude" Enter

# Wait for Claude to start
sleep 5

# Send prompt if provided
if [[ -n "$PROMPT" ]]; then
  sleep 1
  tmux send-keys -t "$PANE_ID" "$PROMPT"
  sleep 1
  tmux send-keys -t "$PANE_ID" Enter
fi

echo "Agent launched in pane $PANE_ID at $WORKTREE_PATH"
