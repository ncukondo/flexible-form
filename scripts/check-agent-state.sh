#!/usr/bin/env bash
# Check the state of an agent in a tmux pane.
# Usage: check-agent-state.sh <pane-id>
# Returns: idle | working | permission | trust | starting | unknown
set -euo pipefail

PANE_ID="${1:?Usage: check-agent-state.sh <pane-id>}"

# Check state file first (reliable up to 120s)
STATE_DIR="/tmp/claude-agent-states"
STATE_FILE="$STATE_DIR/$PANE_ID"
if [[ -f "$STATE_FILE" ]]; then
  cat "$STATE_FILE"
  exit 0
fi

# Fallback: inspect tmux pane content
CONTENT=$(tmux capture-pane -t "$PANE_ID" -p -l 10 2>/dev/null || echo "")

if [[ -z "$CONTENT" ]]; then
  echo "unknown"
  exit 0
fi

if echo "$CONTENT" | grep -q "Allow\|Deny\|permission"; then
  echo "permission"
elif echo "$CONTENT" | grep -q "Trust\|trust"; then
  echo "trust"
elif echo "$CONTENT" | grep -qE '^\$\s*$|^>\s*$'; then
  echo "idle"
elif echo "$CONTENT" | grep -q "claude"; then
  echo "working"
else
  echo "starting"
fi
