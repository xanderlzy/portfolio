#!/bin/sh
# Make web-sized copies of every film's stills.
#   in:  assets/works/<slug>/frames/*   (originals, any image format, kept locally)
#   out: assets/stills/<slug>/01.jpg, 02.jpg, …   (what the site loads)
# Files are numbered in natural name order (R2 before R10). Uses macOS `sips`.
set -e
cd "$(dirname "$0")/.."

for dir in assets/works/*/frames; do
  slug=$(basename "$(dirname "$dir")")
  out="assets/stills/$slug"
  rm -rf "$out"
  mkdir -p "$out"
  n=0
  # read line by line so filenames with spaces ("Screenshot … PM.png") work
  list=$(ls "$dir" | sort -V)
  while IFS= read -r f; do
    case "$f" in .*|"") continue ;; esac
    n=$((n + 1))
    sips -s format jpeg -s formatOptions 78 -Z 1600 "$dir/$f" --out "$out/$(printf %02d $n).jpg" >/dev/null
  done <<EOF
$list
EOF
  echo "$slug: $n stills"
done
