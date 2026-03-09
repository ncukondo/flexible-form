#!/usr/bin/env bash
# Monitor active agent panes.
# Usage: monitor-agents.sh [--watch]
set -euo pipefail

REPO_ROOT="/workspaces/flexible-form"
WATCH=false

if [[ "${1:-}" == "--watch" ]]; then
  WATCH=true
fi

show_status() {
  echo "=== Agent Status ==="
  echo ""

  # List tmux panes
  PANES=$(tmux list-panes -a -F '#{pane_id} #{pane_current_path} #{pane_pid}' 2>/dev/null || echo "")

  if [[ -z "$PANES" ]]; then
    echo "No tmux panes found."
    return
  fi

  printf "%-10s %-40s %-10s\n" "Pane" "Path" "State"
  printf "%-10s %-40s %-10s\n" "----" "----" "-----"

  while IFS= read -r line; do
    PANE_ID=$(echo "$line" | awk '{print $1}')
    PANE_PATH=$(echo "$line" | awk '{print $2}')
    STATE=$(bash "$REPO_ROOT/scripts/check-agent-state.sh" "$PANE_ID" 2>/dev/null || echo "unknown")
    printf "%-10s %-40s %-10s\n" "$PANE_ID" "$PANE_PATH" "$STATE"
  done <<< "$PANES"

  echo ""
  echo "Worktrees:"
  git -C "$REPO_ROOT" worktree list 2>/dev/null || echo "  (none)"
}

if $WATCH; then
  while true; do
    clear
    show_status
    sleep 5
  done
else
  show_status
fi
