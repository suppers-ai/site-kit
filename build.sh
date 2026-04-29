#!/usr/bin/env bash
# build.sh — concatenate src/*.css into dist/design-system.css.
# No minification, no PostCSS — browsers gzip on the wire and only
# modern targets are supported.

set -euo pipefail

cd "$(dirname "$0")"
mkdir -p dist

out=dist/design-system.css

{
  printf '/* site-kit/design-system.css — built %s.\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '   Source: src/{tokens,reset,typography}.css. Do not edit. */\n\n'
  cat src/tokens.css
  printf '\n'
  cat src/reset.css
  printf '\n'
  cat src/typography.css
} > "$out"

# Order-of-concatenation assertion: :root (token declarations) must
# appear before any var(--sa-*) reference, otherwise a future reorder
# silently breaks the cascade.
root_line=$(grep -n '^:root\b' "$out" | head -1 | cut -d: -f1)
first_var_line=$(grep -n 'var(--sa-' "$out" | head -1 | cut -d: -f1)
if [[ -z "$root_line" || -z "$first_var_line" ]]; then
  echo "build.sh: assertion failed — could not locate :root or var(--sa-) in $out" >&2
  exit 1
fi
if (( root_line >= first_var_line )); then
  echo "build.sh: assertion failed — :root at line $root_line is not before first var(--sa-) at line $first_var_line in $out" >&2
  exit 1
fi

bytes=$(wc -c < "$out")
printf 'wrote %s (%d bytes; tokens before vars OK)\n' "$out" "$bytes"
