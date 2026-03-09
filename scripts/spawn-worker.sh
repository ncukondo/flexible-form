#!/usr/bin/env bash
# Spawn a worker agent on a new branch in a worktree.
# Usage: spawn-worker.sh <branch-name> [prompt]
set -euo pipefail

BRANCH_NAME="${1:?Usage: spawn-worker.sh <branch-name> [prompt]}"
PROMPT="${2:-}"

REPO_ROOT="/workspaces/flexible-form"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/flexible-form--worktrees"
WORKTREE_PATH="$WORKTREE_DIR/$BRANCH_NAME"

# Create worktree directory
mkdir -p "$WORKTREE_DIR"

# Create worktree if not exists
if [[ ! -d "$WORKTREE_PATH" ]]; then
  cd "$REPO_ROOT"
  git fetch origin main
  git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME" origin/main
  echo "Created worktree at $WORKTREE_PATH"
fi

# Install dependencies
cd "$WORKTREE_PATH"
npm install --silent 2>/dev/null || true

# Set role in CLAUDE.md
if [[ -f "$WORKTREE_PATH/CLAUDE.md" ]]; then
  sed -i 's/<!-- role: .* -->/<!-- role: implement -->/' "$WORKTREE_PATH/CLAUDE.md"
fi

# Launch agent
bash "$REPO_ROOT/scripts/launch-agent.sh" "$WORKTREE_PATH" "$PROMPT"
