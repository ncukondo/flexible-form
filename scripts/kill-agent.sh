#!/usr/bin/env bash
# Gracefully terminate an agent in a tmux pane.
# Usage: kill-agent.sh <pane-id>
set -euo pipefail

PANE_ID="${1:?Usage: kill-agent.sh <pane-id>}"

# Send Ctrl+C to interrupt
tmux send-keys -t "$PANE_ID" C-c
sleep 1

# Send /exit command
tmux send-keys -t "$PANE_ID" "/exit"
sleep 1
tmux send-keys -t "$PANE_ID" Enter
sleep 1

# Confirm exit
tmux send-keys -t "$PANE_ID" "y"
sleep 1
tmux send-keys -t "$PANE_ID" Enter
sleep 2

# Kill the pane
tmux kill-pane -t "$PANE_ID" 2>/dev/null || true

# Clean up state file
rm -f "/tmp/claude-agent-states/$PANE_ID"

echo "Agent in pane $PANE_ID terminated"
