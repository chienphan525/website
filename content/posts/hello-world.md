---
title: "Hello World: Welcome to My Personal Blog"
date: "2026-08-25"
excerpt: "Welcome to my new personal blog and portfolio! Powered by Next.js, Tailwind CSS, and pure Markdown files, designed for 1-click deployment on Vercel."
tags: ["Welcome", "Nextjs", "Markdown", "Vercel"]
featured: true
published: true
author: "Chien Phan"
---

Welcome to my personal digital garden and portfolio! This website was engineered with a minimalist mindset: **zero database overhead, 100% Markdown-driven content, and instant static performance on Vercel.**

## Why Markdown-Driven?

Managing content in simple `.md` files provides immense advantages:
- **Portability**: Your content is never locked into a proprietary CMS database.
- **Git Versioning**: Every post edit, revision, and draft is tracked through standard Git commits.
- **Offline Writing**: You can write articles in Obsidian, VS Code, or any text editor on any operating system.
- **Zero Ongoing Costs**: Static Markdown sites can be hosted virtually for free on Vercel with lightning-fast edge delivery.

## Key Features of this Template

Here is a quick overview of what is baked into this personal blog:

1. **One-Click Vercel Deployment**: Clone the repo, hit Deploy, and your blog is live in seconds.
2. **Interactive Search**: Real-time fuzzy search across titles, summaries, and tags with `Cmd + K`.
3. **Automatic Table of Contents**: Generated dynamically from heading tags with active scroll tracking.
4. **Syntax Highlighting**: Shiki-powered code blocks with dark and light theme switching.
5. **SEO & Social Optimization**: Dynamic OpenGraph tags, automated `sitemap.xml`, and `/rss.xml` feed generation.

```typescript
// Sample TypeScript snippet showcasing syntax highlighting
interface BlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export function createPost(post: BlogPost): void {
  console.log(`🚀 New post published: ${post.title} (${post.readingTime})`);
}
```

## How to Add Your Own Post

Adding a new post is as simple as creating a file in `content/posts/my-post-title.md` with standard YAML frontmatter:

```yaml
---
title: "My Amazing Post Title"
date: "2026-08-29"
excerpt: "A brief summary of what this post covers."
tags: ["Technology", "Tutorial"]
featured: false
published: true
---
```

Stay tuned for more deep dives into software architecture, developer productivity, and AI tooling!
