#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"
if [[ -z "${FILE}" || ! -f "${FILE}" ]]; then
  echo "Usage: $0 path/to/post.md" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required. Install with: brew install jq" >&2
  exit 1
fi

OUTDIR="../../public/blogpost"
mkdir -p "$OUTDIR"

UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
CURL_COMMON=(-fsSL --compressed -A "$UA" -H 'Accept-Language: en-US,en;q=0.9')

urlencode() { printf '%s' "$1" | jq -sRr @uri; }

slugify() {
  local s="$1"
  s="$(printf '%s' "$s" | tr '[:upper:]' '[:lower:]')"
  s="$(printf '%s' "$s" | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g')"
  [[ -n "$s" ]] && printf '%s' "$s" || printf '%s' "cover"
}

is_theological_section() {
  case "$1" in
    "Biblical Theology"|"Theology General") return 0 ;;
    *) return 1 ;;
  esac
}

# Google Books cover URL from volume id (more reliable than thumbnail fields)
googlebooks_cover_url() {
  local title="$1" author="$2"
  local q qenc api_url json vid

  q="intitle:${title} inauthor:${author}"
  qenc="$(urlencode "$q")"
  api_url="https://www.googleapis.com/books/v1/volumes?q=${qenc}&maxResults=5&printType=books"

  json="$(curl "${CURL_COMMON[@]}" "$api_url" 2>/dev/null || true)"
  [[ -z "$json" ]] && { printf ''; return 0; }

  # First volume id
  vid="$(printf '%s' "$json" | jq -r '.items[]?.id' | head -n 1)"
  [[ -z "$vid" || "$vid" == "null" ]] && { printf ''; return 0; }

  printf 'https://books.google.com/books/content?id=%s&printsec=frontcover&img=1&zoom=3&source=gbs_api' "$vid"
}

download_cover() {
  local img_url="$1" slug="$2"
  local out="${OUTDIR}/${slug}.jpg"
  [[ -z "$img_url" ]] && return 0
  [[ -f "$out" ]] && return 0

  # If we accidentally download HTML, this may still save; that's OK—you can spot-check.
  curl "${CURL_COMMON[@]}" -L "$img_url" -o "$out" >/dev/null 2>&1 || true
}

wts_product_url() {
  local title="$1" author="$2"
  local q search_url html rel

  q="$(urlencode "$title $author")"
  search_url="https://www.wtsbooks.com/search?keyword=${q}"

  html="$(curl "${CURL_COMMON[@]}" -L "$search_url" 2>/dev/null || true)"
  [[ -z "$html" ]] && { echo "$search_url"; return 0; }

  rel="$(printf '%s' "$html" | tr '\n' ' ' | grep -Eo '/products/[^"]+\.html' | head -n 1 || true)"
  [[ -n "$rel" ]] && echo "https://www.wtsbooks.com${rel}" || echo "$search_url"
}

thriftbooks_product_url_or_search() {
  local title="$1" author="$2"
  local q search_url html url

  q="$(urlencode "$title $author")"
  search_url="https://www.thriftbooks.com/browse/?b.search=${q}"

  html="$(curl "${CURL_COMMON[@]}" -L "$search_url" 2>/dev/null || true)"
  [[ -z "$html" ]] && { echo "$search_url"; return 0; }

  # Grab first book detail URL
  url="$(printf '%s' "$html" | tr '\n' ' ' | grep -Eo 'https://www\.thriftbooks\.com/w/[^"]+' | head -n 1 || true)"
  [[ -n "$url" ]] && echo "$url" || echo "$search_url"
}

make_div() {
  local href="$1" image_uri="$2"
  cat <<HTML
<div className="postImageContainer"><a href="${href}" target="_blank"><BookHover imageUri="${image_uri}" size='large' /></a></div>
HTML
}

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

current_section=""
await_div=0
skip_div_block=0
title=""
author=""

while IFS= read -r line; do
  # If we're skipping the old div block, ignore until we hit its closing </div>
  if [[ $skip_div_block -eq 1 ]]; then
    if [[ "$line" == *"</div>"* ]]; then
      skip_div_block=0
    fi
    continue
  fi

  # Track section headings
  if [[ "$line" =~ ^##[[:space:]]+(.+)$ ]]; then
    current_section="${BASH_REMATCH[1]}"
    await_div=0
    printf '%s\n' "$line" >> "$tmp"
    continue
  fi

  # Book heading: ### _Title_ by Author
  if [[ "$line" =~ ^###[[:space:]]+_(.+)_[[:space:]]+by[[:space:]]+(.+)$ ]]; then
    title="${BASH_REMATCH[1]}"
    author="${BASH_REMATCH[2]}"
    await_div=1
    printf '%s\n' "$line" >> "$tmp"
    continue
  fi

  # Replace the first postImageContainer div after a book heading
  if [[ $await_div -eq 1 && "$line" == *'<div className="postImageContainer">'* ]]; then
    # Build href
    if is_theological_section "$current_section"; then
      href="$(wts_product_url "$title" "$author")"
    else
      href="$(thriftbooks_product_url_or_search "$title" "$author")"
    fi

    # Build cover URL + download + imageUri
    slug="$(slugify "${title}-${author}")"
    image_uri="/blogpost/${slug}.jpg"

    cover_url="$(googlebooks_cover_url "$title" "$author")"
    if [[ -n "$cover_url" ]]; then
      download_cover "$cover_url" "$slug"
    else
      echo "GOOGLEBOOKS_COVER_NOT_FOUND_FOR: ${title} by ${author}" >&2
    fi

    # Write new div (single-line div, like your original style)
    make_div "$href" "$image_uri" >> "$tmp"

    # Skip old div block until closing </div>
    skip_div_block=1
    await_div=0

    continue
  fi

  # Default: passthrough
  printf '%s\n' "$line" >> "$tmp"
done < "$FILE"

# Edit in place
mv "$tmp" "$FILE"
trap - EXIT
