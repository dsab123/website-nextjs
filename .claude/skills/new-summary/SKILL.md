---
name: new-summary
description: Scaffold a new book summary — fetch the book cover, generate the OG composite onto the book-stack template, append the index entry to data/summary.json, and create the markdown file in data/summaries/.
---

# new-summary

Use this skill when the user asks to "create a new summary", "add a book summary", or similar. The repo's summary index lives in [data/summary.json](data/summary.json) and summary bodies live in [data/summaries/](data/summaries/).

## What you collect from the user

Bundle into a single AskUserQuestion when possible.

- **title** — book title
- **author** — book author(s)
- **link** — purchase/info URL (WTS Books, Thrift Books, Zondervan, Amazon, etc.)
- **seller** — derived from link host (`WTS Books`, `Amazon`, `ThriftBooks`, `Zondervan`, etc.); confirm if ambiguous
- **teaser** — one short sentence (shows on the index)
- **category** — comma-separated keywords (e.g. `christian, theology`)
- **slug** — kebab-case from title; confirm
- **quality** — 1–5 (or null if not yet rated)
- **payoff** — 1–10 (or null if not yet rated)
- **isReady** — default `false`

## Steps

1. **Read [data/summary.json](data/summary.json)** and compute `summaryId = max(summaryId) + 1`.
2. **Fetch the cover**:
   ```
   bash .claude/skills/_lib/fetch-cover.sh "<title>" "<author>" public/summary/<slug>.jpg
   ```
   This tries Google Books first, then falls back to Open Library. If both fail, ask the user to provide a cover URL or local file path and download/copy it manually to `public/summary/<slug>.jpg`.
3. **Generate the OG composite** onto the book-stack template:
   ```
   bash .claude/skills/_lib/make-og.sh public/summary/<slug>.jpg public/summary/<slug>-book.png
   ```
   Show the result to the user. If the perspective is off (cover doesn't quite cover the underlying template book), re-run with overrides:
   ```
   TL=552,40 TR=910,80 BR=928,597 BL=560,548 \
     bash .claude/skills/_lib/make-og.sh ... ...
   ```
   Defaults are tuned for the existing template; nudge by 5–10px until the new cover fully obscures the original.
4. **Append the index entry** to [data/summary.json](data/summary.json) at the top of the `summaries` array (newest first):
   ```json
   {
     "summaryId": <new id>,
     "title": "<title>",
     "author": "<author>",
     "link": "<link>",
     "imageUri": "summary/<slug>.jpg",
     "ogImageUri": "summary/<slug>-book.png",
     "isReady": false,
     "slug": "<slug>",
     "quality": <1-5 or null>,
     "payoff": <1-10 or null>,
     "category": "<category>",
     "seller": "<seller>",
     "teaser": "<teaser>"
   }
   ```
   Use the Edit tool on the JSON. Keep the file's existing 2-space indentation.
5. **Create the markdown body** at `data/summaries/<slug>.md`. Look at [data/summaries/untangling-emotions.md](data/summaries/untangling-emotions.md) for the conventional structure (intro paragraph, optional per-chapter sections with TL;DR blocks, blockquote-style book quotes). Leave a `## TODO` placeholder unless the user asked you to draft.
6. **Report back**: new id, paths to the cover/OG/markdown files, and a reminder to flip `isReady` to `true` when finished.

## Notes

- The OG template lives at `.claude/skills/_lib/og-template.png` (a copy of the existing book-stack composite).
- Perspective corner defaults are encoded in `.claude/skills/_lib/make-og.sh` — override via `TL`/`TR`/`BR`/`BL` env vars (each as `x,y`).
- If `fetch-cover.sh` returns a low-resolution result that warps poorly, prompt the user for a better image URL.
- Do not run `git add` / `git commit` unless explicitly asked.
