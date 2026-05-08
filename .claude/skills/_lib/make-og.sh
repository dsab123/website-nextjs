#!/usr/bin/env bash
# Composite a book cover onto the OG book-stack template using a perspective warp.
# Usage: make-og.sh /abs/cover.jpg /abs/out.png
set -euo pipefail

COVER="${1:-}"
OUT="${2:-}"

if [[ -z "$COVER" || -z "$OUT" ]]; then
  echo "Usage: $0 <cover_path> <out_path>" >&2
  exit 2
fi
if [[ ! -f "$COVER" ]]; then
  echo "ERROR: cover not found: $COVER" >&2
  exit 1
fi
if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: ImageMagick (magick) is required (brew install imagemagick)" >&2
  exit 1
fi

LIB_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE="${OG_TEMPLATE:-$LIB_DIR/og-template.png}"
if [[ ! -f "$TEMPLATE" ]]; then
  echo "ERROR: template not found: $TEMPLATE" >&2
  exit 1
fi

# Destination corners on the 1200x630 template, where the leaning book cover sits.
# Order: TL -> TR -> BR -> BL
: "${TL:=500,44}"
: "${TR:=744,45}"
: "${BR:=881,453}"
: "${BL:=644,537}"

DIMS=$(magick identify -format "%w %h" "$COVER")
CW=${DIMS% *}
CH=${DIMS#* }

TDIMS=$(magick identify -format "%w %h" "$TEMPLATE")
TW=${TDIMS% *}
TH=${TDIMS#* }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

WARPED="$TMP/cover-warped.png"

magick "$COVER" \
  -alpha set -background none -virtual-pixel transparent \
  -set option:distort:viewport "${TW}x${TH}+0+0" \
  -distort Perspective \
    "0,0 ${TL}  ${CW},0 ${TR}  ${CW},${CH} ${BR}  0,${CH} ${BL}" \
  "$WARPED"

magick "$TEMPLATE" "$WARPED" -composite "$OUT"

echo "$OUT"
