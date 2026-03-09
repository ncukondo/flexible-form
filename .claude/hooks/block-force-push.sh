#!/usr/bin/env bash
# Block dangerous force-push commands
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ -z "$COMMAND" ]]; then
  echo '{"decision":"allow"}'
  exit 0
fi

if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--(force|force-with-lease|force-if-includes)'; then
  echo '{"decision":"block","reason":"Force push is blocked. Use normal push or ask the user explicitly."}'
  exit 0
fi

if echo "$COMMAND" | grep -qE 'git\s+push\s+-[^-]*f'; then
  echo '{"decision":"block","reason":"Force push (-f) is blocked. Use normal push or ask the user explicitly."}'
  exit 0
fi

echo '{"decision":"allow"}'
