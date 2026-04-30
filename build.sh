#!/usr/bin/env bash
# build.sh — concatenate src/*.css into dist/design-system.css, and
# copy src/components/*.js into dist/components/ with a syntax check.
# No minification, no PostCSS — browsers gzip on the wire and only
# modern targets are supported.

set -euo pipefail

cd "$(dirname "$0")"
mkdir -p dist

out=dist/design-system.css

{
  printf '/* site-kit/design-system.css — concatenation of\n'
  printf '   src/{tokens,reset,typography}.css. Do not edit. */\n\n'
  cat src/tokens.css
  printf '\n'
  cat src/reset.css
  printf '\n'
  cat src/typography.css
} > "$out"

# Order-of-concatenation assertion: the first non-comment, non-blank
# line of the dist file must open the `:root` token block. Anything
# else means a future source reorder slipped non-token CSS in front of
# the declarations and would silently break `var(--sa-*)` references
# that come before `:root` in the cascade.
first_code_line=$(awk '
  # strip /* … */ that begin and end on the same line
  { gsub(/\/\*[^*]*\*\//, ""); }
  # state 0 = not in block comment, 1 = inside
  in_comment == 1 {
    if (match($0, /\*\//)) {
      $0 = substr($0, RSTART + 2)
      in_comment = 0
    } else {
      next
    }
  }
  {
    if (match($0, /\/\*/)) {
      $0 = substr($0, 1, RSTART - 1)
      in_comment = 1
    }
    if ($0 ~ /[^[:space:]]/) {
      print NR ":" $0
      exit
    }
  }
' "$out")
if [[ -z "$first_code_line" ]]; then
  echo "build.sh: assertion failed — no non-comment code in $out" >&2
  exit 1
fi
if [[ "$first_code_line" != *':root'* ]]; then
  line_no=${first_code_line%%:*}
  content=${first_code_line#*:}
  echo "build.sh: assertion failed — first non-comment line in $out should open ':root {', got line $line_no: $content" >&2
  exit 1
fi

bytes=$(wc -c < "$out")

# Components: 1-to-1 copy from src/components/ to dist/components/,
# with a syntax check via `node --check`.
mkdir -p dist/components
shopt -s nullglob
component_count=0
for src_js in src/components/*.js; do
  dest=dist/components/$(basename "$src_js")
  cp "$src_js" "$dest"
  node --check "$dest"
  component_count=$((component_count + 1))
done
shopt -u nullglob

printf 'wrote %s (%d bytes; first code line opens :root)\n' "$out" "$bytes"
printf 'copied %d component(s) to dist/components/\n' "$component_count"
