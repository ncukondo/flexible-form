#!/usr/bin/env bash
# Send a prompt to an agent in a tmux pane.
# Usage: send-to-agent.sh <pane-id> <prompt>
set -euo pipefail

PANE_ID="${1:?Usage: send-to-agent.sh <pane-id> <prompt>}"
PROMPT="${2:?Usage: send-to-agent.sh <pane-id> <prompt>}"

# Send text first
tmux send-keys -t "$PANE_ID" "$PROMPT"
# Wait before sending Enter (tmux standard)
sleep 1
tmux send-keys -t "$PANE_ID" Enter

echo "Sent prompt to pane $PANE_ID"
