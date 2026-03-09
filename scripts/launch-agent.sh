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

if [ -z "${TMUX:-}" ]; then
  echo "Error: Not in a tmux session" >&2
  exit 1
fi

# Create new tmux pane
PANE_ID=$(tmux split-window -h -d -c "$WORKTREE_PATH" -P -F '#{pane_id}')
echo "[launch-agent] Agent pane: $PANE_ID"

# Setup state tracking
WORKER_STATE_DIR="/tmp/claude-agent-states"
mkdir -p "$WORKER_STATE_DIR"
STATE_FILE="$WORKER_STATE_DIR/$PANE_ID"

# Create settings.local.json for state tracking hooks
mkdir -p "$WORKTREE_PATH/.claude"
cat > "$WORKTREE_PATH/.claude/settings.local.json" << SETTINGS_EOF
{
  "permissions": {
    "allow": [
      "Bash(*)",
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Grep(*)",
      "Glob(*)"
    ]
  },
  "hooks": {
    "Stop": [{ "hooks": [{ "type": "command", "command": "echo idle > '$STATE_FILE'" }] }],
    "PreToolUse": [{ "hooks": [{ "type": "command", "command": "echo working > '$STATE_FILE'", "async": true }] }],
    "Notification": [
      { "matcher": "idle_prompt", "hooks": [{ "type": "command", "command": "echo idle > '$STATE_FILE'" }] }
    ],
    "SessionStart": [{ "hooks": [{ "type": "command", "command": "echo starting > '$STATE_FILE'" }] }],
    "SessionEnd": [{ "hooks": [{ "type": "command", "command": "rm -f '$STATE_FILE'" }] }]
  }
}
SETTINGS_EOF

echo "starting" > "$STATE_FILE"

# Launch Claude Code
tmux send-keys -t "$PANE_ID" "CLAUDE_WORKER_ID='$PANE_ID' claude"
sleep 1
tmux send-keys -t "$PANE_ID" Enter

# Wait for Claude to start
sleep 5

# Send prompt if provided
if [[ -n "$PROMPT" ]]; then
  sleep 1
  tmux send-keys -t "$PANE_ID" "$PROMPT"
  sleep 1
  tmux send-keys -t "$PANE_ID" Enter
fi

echo "[launch-agent] Agent launched in pane $PANE_ID at $WORKTREE_PATH"
