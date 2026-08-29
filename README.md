# Chiến Phan — Personal Journal

A clean, fast personal blog for life notes and love stories. It is made with Next.js and can deploy directly to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME)

Before clicking the button, replace `YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME` with the GitHub repository you create.

## Publish a new article

1. Open `content/posts`.
2. Copy any `.md` file and give it a web-friendly name, for example `our-first-trip.md`.
3. Edit the information between the `---` lines, then write the article below it.
4. Save, commit, and push to GitHub. Vercel automatically publishes the change.

```md
---
title: "Title of your story"
date: "2026-08-29"
category: "Nhật ký"
excerpt: "A short introduction shown on the home page."
---
Your article begins here.

## A section heading

Write another paragraph here.
```

Dates must use `YYYY-MM-DD`; the newest date appears first. Supported writing: normal paragraphs and `##` headings.

## Bring over WordPress articles

This project includes an importer for the current public WordPress site. Run `npm run import:wordpress` once after `npm install`; it fetches the public articles from `chienphan.com` into `content/posts/` as Markdown and never overwrites an existing file. Review the generated files, then commit them before deploying.

## Run locally

Install Node.js 20 or newer, then run `npm install` and `npm run dev`. Open `http://localhost:3000`. Before deployment, run `npm run build`.

## Deploy to Vercel

1. Create a new GitHub repository and upload this project.
2. Import that repository in [Vercel](https://vercel.com/new).
3. Keep the detected Next.js settings and click **Deploy**.
4. In Vercel, add `chienphan.com` under **Settings → Domains** and follow its DNS instructions.

Every GitHub push triggers a new deployment. No database or WordPress login is required for writing.

## Project map

- `content/posts/` — your articles; this is the only folder needed for normal publishing.
- `app/page.tsx` — home page.
- `app/bai-viet/[slug]/page.tsx` — article page.
- `app/globals.css` — visual design.

The first love-story post is adapted from the public article on the former site, so the new journal begins with a familiar memory.
