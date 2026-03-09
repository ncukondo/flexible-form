#!/usr/bin/env bash
# Arrange tmux panes: main on left (45%), workers stacked on right.
# Usage: apply-layout.sh
set -euo pipefail

tmux select-layout main-vertical 2>/dev/null || true

# Resize main pane to 45%
WINDOW_WIDTH=$(tmux display-message -p '#{window_width}')
MAIN_WIDTH=$((WINDOW_WIDTH * 45 / 100))
tmux resize-pane -t 0 -x "$MAIN_WIDTH" 2>/dev/null || true

echo "Layout applied: main-vertical (45/55)"
