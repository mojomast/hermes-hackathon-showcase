#!/usr/bin/env bash
# Builds WebP derivatives of every raster image in assets/<slug>/img/:
#   thumbs/<slug>/<name>.t.webp  — max 640 px wide (gallery tiles)
#   thumbs/<slug>/<name>.l.webp  — max 1600 px wide (lightbox, heroes)
# Originals in assets/ are untouched and still linked from the lightbox.
set -euo pipefail
cd "$(dirname "$0")/.."
for src in assets/*/img/*.{png,jpg,jpeg}; do
  [ -e "$src" ] || continue
  slug=$(echo "$src" | cut -d/ -f2)
  name=$(basename "${src%.*}")
  mkdir -p "thumbs/$slug"
  for spec in "t:640:72" "l:1600:80"; do
    IFS=: read -r tag w q <<<"$spec"
    out="thumbs/$slug/$name.$tag.webp"
    [ -e "$out" ] && [ "$out" -nt "$src" ] && continue
    ffmpeg -loglevel error -y -i "$src" -vf "scale='min($w,iw)':-2:flags=lanczos" \
      -c:v libwebp -quality "$q" -compression_level 6 "$out"
  done
done
echo "thumbs done"
