# Modern Markdown Personal Blog & Portfolio

A blazing-fast, minimalist personal blog and developer portfolio engineered for **Vercel 1-Click Deployment** and **100% Markdown (`.md`) content management**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchienphan525%2Fwebsite)

---

## ✨ Features

- 🚀 **1-Click Vercel Deploy**: Zero-config deployment with instant CDN edge caching.
- 📝 **100% Markdown-Driven**: Manage all blog articles, portfolio projects, and about page entirely via `.md` files in the `/content` folder.
- ⚡ **Blazing Performance**: Pre-rendered static pages (SSG) with sub-second page loads.
- 🎨 **Clean & Minimalist Design**: Modern typography, responsive layout, and smooth Dark / Light mode toggle.
- 🔍 **Interactive Search**: Instant fuzzy search across all titles, excerpts, and tags (`Cmd + K` / `Ctrl + K`).
- 📑 **Automatic Table of Contents**: Extracted dynamically from heading tags with real-time active scroll highlighting.
- 💻 **Syntax Highlighting**: Shiki-powered code blocks with multi-theme support and line highlight capabilities.
- 🏷️ **Tag Filtering**: Filter and explore articles by topic with real-time counters.
- 📡 **SEO & Feeds**: Automated dynamic OpenGraph metadata, `sitemap.xml`, `robots.txt`, and RSS 2.0 (`/rss.xml`).

---

## 🚀 One-Click Deployment to Vercel

1. Click the button below:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchienphan525%2Fwebsite)

2. Sign in to your Vercel account and select your GitHub account.
3. Name your repository and click **Create**.
4. Vercel will automatically build and deploy your site in ~45 seconds!

---

## ✍️ How to Manage Content with Markdown

All site content is stored in the `content/` folder:

```
content/
├── posts/          # Blog articles (.md)
├── projects/       # Portfolio projects (.md)
└── about.md        # About page bio & profile
```

### 1. Creating a New Blog Post

Create a new file in `content/posts/my-new-post.md`:

```markdown
---
title: "My New Article Title"
date: "2026-08-29"
excerpt: "A short summary of what this article covers for preview cards and SEO."
tags: ["Nextjs", "WebDev", "Tutorial"]
featured: true
published: true
author: "Your Name"
---

# Your Heading Here

Write your markdown content here. You can use:
- **Bold**, *Italics*, and [Links](https://example.com)
- Standard tables and task lists
- Code blocks with syntax highlighting:

```typescript
function helloWorld(): string {
  return "Hello from Markdown!";
}
```
```

#### Frontmatter Reference

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title displayed on the post and in search. |
| `date` | `YYYY-MM-DD` | Publication date (used for sorting and RSS). |
| `excerpt` | `string` | Short preview summary. |
| `tags` | `string[]` | Array of topic tags (e.g. `["React", "Design"]`). |
| `featured` | `boolean` | If `true`, pinned to the homepage featured section. |
| `published` | `boolean` | Set to `false` to keep the post as a draft. |
| `author` | `string` | (Optional) Override author name. |

---

### 2. Adding a Project to Portfolio

Create a file in `content/projects/my-project.md`:

```markdown
---
title: "Project Name"
description: "Brief summary of what this project does."
tags: ["TypeScript", "Next.js", "Tailwind"]
link: "https://myproject.com"
github: "https://github.com/username/repo"
featured: true
date: "2026"
---

Optional extended description about the project architecture and highlights.
```

---

### 3. Updating the About Page

Edit `content/about.md` to update your bio, skills, and background.

---

## ⚙️ Site Configuration

Edit `src/lib/siteConfig.ts` to customize your personal branding, avatar, social handles, and navigation:

```typescript
export const siteConfig = {
  title: "Your Name | Personal Blog & Portfolio",
  name: "Your Name",
  description: "A fast, modern personal blog engineered for Markdown management.",
  url: "https://your-domain.vercel.app",
  author: {
    name: "Your Name",
    role: "Software Engineer",
    bio: "Passionate about building clean web products...",
    avatar: "https://avatars.githubusercontent.com/u/...",
    location: "Your City, Country",
    email: "you@example.com",
    github: "https://github.com/yourhandle",
    twitter: "https://twitter.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
  },
  navLinks: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
  ],
};
```

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chienphan525/website.git
   cd website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Site Generation)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Markdown Pipeline**: `gray-matter`, `remark-gfm`, `rehype-slug`, `rehype-pretty-code`, `shiki`
- **Search**: Fuzzy search indexing with `Cmd + K` dialog
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Light / Dark mode)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting**: [Vercel](https://vercel.com)

---

## 📄 License

MIT © [Chien Phan](https://github.com/chienphan525)
