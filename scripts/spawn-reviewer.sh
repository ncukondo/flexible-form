#!/usr/bin/env bash
# Spawn a reviewer agent for a PR.
# Usage: spawn-reviewer.sh <pr-number>
#        spawn-reviewer.sh <branch-name> <pr-number>
set -euo pipefail

if [[ $# -eq 1 ]]; then
  PR_NUMBER="$1"
  BRANCH_NAME=$(gh pr view "$PR_NUMBER" --json headRefName -q '.headRefName')
elif [[ $# -eq 2 ]]; then
  BRANCH_NAME="$1"
  PR_NUMBER="$2"
else
  echo "Usage: spawn-reviewer.sh <pr-number>" >&2
  echo "       spawn-reviewer.sh <branch-name> <pr-number>" >&2
  exit 1
fi

REPO_ROOT="/workspaces/flexible-form"
WORKTREE_DIR="$(dirname "$REPO_ROOT")/flexible-form--worktrees"
WORKTREE_PATH="$WORKTREE_DIR/$BRANCH_NAME"

# Create worktree directory
mkdir -p "$WORKTREE_DIR"

# Create worktree if not exists
if [[ ! -d "$WORKTREE_PATH" ]]; then
  cd "$REPO_ROOT"
  git fetch origin "$BRANCH_NAME"
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
  echo "Created worktree at $WORKTREE_PATH"
fi

cd "$WORKTREE_PATH"

# Set role in CLAUDE.md
if [[ -f "$WORKTREE_PATH/CLAUDE.md" ]]; then
  sed -i 's/<!-- role: .* -->/<!-- role: review -->/' "$WORKTREE_PATH/CLAUDE.md"
fi

# Launch agent with review prompt
PROMPT="Review PR #${PR_NUMBER}. Run /review-pr ${PR_NUMBER}"
bash "$REPO_ROOT/scripts/launch-agent.sh" "$WORKTREE_PATH" "$PROMPT"
