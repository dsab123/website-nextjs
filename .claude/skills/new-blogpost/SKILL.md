---
name: new-blogpost
description: Scaffold a new blog post — create the markdown file in data/blogposts/, append the index entry to data/blogpost.json, and (optionally for book-themed posts) fetch a book cover and generate the OG image composite onto the book-stack template.
---

# new-blogpost

Use this skill when the user asks to "create a new blog post", "scaffold a blog post", or similar. The repo's blog index lives in [data/blogpost.json](data/blogpost.json) and post bodies live in [data/blogposts/](data/blogposts/).

## What you collect from the user

Ask only for what you don't already have. Bundle into a single AskUserQuestion when possible.

- **title** — the post title
- **slug** — kebab-case from title; confirm if non-obvious
- **teaser** — one short sentence (shows on the index)
- **tags** — comma-separated; check existing tags in `data/blogpost.json` and reuse where reasonable
- **date** — default to today (`MM-DD-YYYY`)
- **imageUri** — relative path under `public/`, e.g. `blogpost/foo.jpg`. If the post centers on a specific book, ask whether to generate the book-cover composite (see below).

## Steps

1. **Read [data/blogpost.json](data/blogpost.json)** and compute `blogpostId = max(blogpostId) + 1`.
2. **(Optional) Generate book composite** if the post is centered on a book:
   - Ask the user for the book title and author.
   - Run `bash .claude/skills/_lib/fetch-cover.sh "<title>" "<author>" public/blogpost/<slug>.jpg` to download the cover (Google Books → Open Library fallback).
   - Run `bash .claude/skills/_lib/make-og.sh public/blogpost/<slug>.jpg public/blogpost/<slug>-book.png` to produce the skewed-onto-book-stack OG image.
   - Set `imageUri` to `blogpost/<slug>-book.png` (or whichever variant the user prefers).
   - Show the generated PNG to the user and offer to nudge perspective coordinates if it doesn't fit (see "Tuning perspective" in `.claude/skills/_lib/make-og.sh`).
3. **Append the index entry** to [data/blogpost.json](data/blogpost.json) at the top of the `blogposts` array (newest first):
   ```json
   {
     "blogpostId": <new id>,
     "slug": "<slug>",
     "title": "<title>",
     "teaser": "<teaser>",
     "tags": [<tags>],
     "imageUri": "<imageUri>",
     "date": "<MM-DD-YYYY>",
     "isReady": false
   }
   ```
   Use the Edit tool on the JSON. Keep the file's existing 2-space indentation.
4. **Create the markdown body** at `data/blogposts/<slug>.md`. Start with the leading hero `<div>` block matching the project's existing pattern (see [data/blogposts/isaiah-36-45-biblical-theology-readings.md](data/blogposts/isaiah-36-45-biblical-theology-readings.md) for the convention) and an empty body the user can fill in. Do not invent content — leave a `## TODO` placeholder unless the user asked you to draft.
5. **Report back** to the user with: the new id, the path to the markdown file, the generated OG image (if any), and a reminder to flip `isReady` to `true` when ready to publish.

## Notes

- `isReady: false` is the default for new posts — it hides them from the index until the user is ready.
- If the user already provided a generic `imageUri` (not a book composite), skip step 2 entirely.
- For book-themed posts that already use `<BookHover>` blocks in the body, [data/blogposts/booklinkify.sh](data/blogposts/booklinkify.sh) can fill in cover images and seller links — point the user there rather than duplicating that logic.
- Do not run `git add` / `git commit` unless explicitly asked.
