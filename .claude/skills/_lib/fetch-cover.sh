#!/usr/bin/env bash
# Fetch a book cover from Google Books, falling back to Open Library.
# Detects Google's "image not available" placeholder via low color variance.
# Usage: fetch-cover.sh "Book Title" "Author" /abs/path/out.jpg
set -euo pipefail

TITLE="${1:-}"
AUTHOR="${2:-}"
OUT="${3:-}"

if [[ -z "$TITLE" || -z "$OUT" ]]; then
  echo "Usage: $0 <title> <author> <out_path>" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required (brew install jq)" >&2
  exit 1
fi
if ! command -v magick >/dev/null 2>&1; then
  echo "ERROR: ImageMagick is required (brew install imagemagick)" >&2
  exit 1
fi

UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
CURL=(-fsSL --compressed -A "$UA" -H 'Accept-Language: en-US,en;q=0.9')

urlencode() { printf '%s' "$1" | jq -sRr @uri; }

# is_real_cover <path> [min_width]: true if the image is a real book cover.
# Checks: real image file, std-dev > 0.10 (rules out monochromatic placeholders),
# width >= min_width (default 250), and aspect ratio h/w in [1.1, 1.9] (rules
# out cropped slices and weird search hits).
is_real_cover() {
  local p="$1"
  local minw="${2:-250}"
  [[ -f "$p" ]] || return 1
  file "$p" | grep -qiE 'image|JPEG|PNG' || return 1
  local info
  info=$(magick "$p" -format "%w %h %[fx:standard_deviation]" info: 2>/dev/null || echo "0 0 0")
  awk -v info="$info" -v minw="$minw" 'BEGIN {
    n = split(info, a, " ");
    w=a[1]+0; h=a[2]+0; std=a[3]+0;
    if (w < minw || std <= 0.10) exit 1;
    ratio = (w > 0) ? h / w : 0;
    if (ratio < 1.1 || ratio > 1.9) exit 1;
    exit 0
  }'
}

mkdir -p "$(dirname "$OUT")"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# --- Try Google Books ---
gb_q="intitle:${TITLE}"
[[ -n "$AUTHOR" ]] && gb_q+=" inauthor:${AUTHOR}"
gb_qenc="$(urlencode "$gb_q")"
gb_api="https://www.googleapis.com/books/v1/volumes?q=${gb_qenc}&maxResults=10&printType=books"
gb_json="$(curl "${CURL[@]}" "$gb_api" 2>/dev/null || true)"

GB_VIDS=()
if [[ -n "$gb_json" ]]; then
  # Prefer volumes whose title actually contains the searched title (case-insensitive).
  while IFS= read -r line; do
    [[ -n "$line" && "$line" != "null" ]] && GB_VIDS+=("$line")
  done < <(printf '%s' "$gb_json" | jq -r --arg t "$TITLE" '
    .items[]?
    | select(.volumeInfo.imageLinks != null)
    | select((.volumeInfo.title // "" | ascii_downcase) | contains($t | ascii_downcase))
    | .id
  ')
  # Fall back: any volume with images, no title filter.
  if [[ ${#GB_VIDS[@]} -eq 0 ]]; then
    while IFS= read -r line; do
      [[ -n "$line" && "$line" != "null" ]] && GB_VIDS+=("$line")
    done < <(printf '%s' "$gb_json" | jq -r '.items[]? | select(.volumeInfo.imageLinks != null) | .id')
  fi
fi

# First pass: prefer high-res Google Books covers
for vid in ${GB_VIDS[@]+"${GB_VIDS[@]}"}; do
  for zoom in 3 2; do
    cover_url="https://books.google.com/books/content?id=${vid}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api"
    if curl "${CURL[@]}" -L "$cover_url" -o "$TMP" 2>/dev/null && is_real_cover "$TMP" 400; then
      mv "$TMP" "$OUT"
      echo "$OUT"
      exit 0
    fi
  done
done

# --- Fall back to Open Library ---
ol_t_enc="$(urlencode "$TITLE")"
ol_a_enc="$(urlencode "$AUTHOR")"
ol_url="https://openlibrary.org/search.json?title=${ol_t_enc}&author=${ol_a_enc}&limit=5"
ol_json="$(curl "${CURL[@]}" "$ol_url" 2>/dev/null || true)"

if [[ -n "$ol_json" ]]; then
  OL_IDS=()
  while IFS= read -r line; do
    [[ -n "$line" && "$line" != "null" ]] && OL_IDS+=("$line")
  done < <(printf '%s' "$ol_json" | jq -r '.docs[]?.cover_i // empty')

  for cid in ${OL_IDS[@]+"${OL_IDS[@]}"}; do
    cover_url="https://covers.openlibrary.org/b/id/${cid}-L.jpg"
    if curl "${CURL[@]}" -L "$cover_url" -o "$TMP" 2>/dev/null && is_real_cover "$TMP" 250; then
      mv "$TMP" "$OUT"
      echo "$OUT"
      exit 0
    fi
  done
fi

# Last resort: any Google Books image, even low-res
for vid in ${GB_VIDS[@]+"${GB_VIDS[@]}"}; do
  for zoom in 1 5; do
    cover_url="https://books.google.com/books/content?id=${vid}&printsec=frontcover&img=1&zoom=${zoom}&source=gbs_api"
    if curl "${CURL[@]}" -L "$cover_url" -o "$TMP" 2>/dev/null && is_real_cover "$TMP" 100; then
      mv "$TMP" "$OUT"
      echo "$OUT"
      exit 0
    fi
  done
done

echo "ERROR: no usable cover found for: $TITLE / $AUTHOR" >&2
echo "Tried Google Books volumes: ${#GB_VIDS[@]}; Open Library covers: ${#OL_IDS[@]:-0}" >&2
exit 1
