import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime, extractTOC, markdownToHtml, TOCItem } from "./markdown";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");
const PROJECTS_DIRECTORY = path.join(process.cwd(), "content/projects");
const ABOUT_FILE = path.join(process.cwd(), "content/about.md");

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  coverImage?: string;
  author?: string;
}

export interface PostItem extends PostFrontmatter {
  slug: string;
  readingTime: string;
  rawContent: string;
}

export interface PostDetail extends PostItem {
  htmlContent: string;
  toc: TOCItem[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  date: string;
  coverImage?: string;
  content: string;
}

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getPostSlugs(): string[] {
  ensureDirectoryExists(POSTS_DIRECTORY);
  const files = fs.readdirSync(POSTS_DIRECTORY);
  return files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): PostDetail | null {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const postData = data as PostFrontmatter;
    const readingTime = calculateReadingTime(content);
    const toc = extractTOC(content);

    return {
      slug,
      title: postData.title || "Untitled Post",
      date: postData.date || new Date().toISOString().split("T")[0],
      excerpt: postData.excerpt || "",
      tags: postData.tags || [],
      published: postData.published ?? true,
      featured: postData.featured ?? false,
      coverImage: postData.coverImage,
      author: postData.author,
      readingTime,
      rawContent: content,
      htmlContent: "", // populated asynchronously when rendering detail
      toc,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getPostDetailWithHtml(slug: string): Promise<PostDetail | null> {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const htmlContent = await markdownToHtml(post.rawContent);
  return {
    ...post,
    htmlContent,
  };
}

export function getAllPosts(): PostItem[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      const { htmlContent, toc, ...item } = post;
      return item;
    })
    .filter((post): post is PostItem => post !== null)
    .filter((post) => (process.env.NODE_ENV === "production" ? post.published !== false : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getFeaturedPosts(limit: number = 3): PostItem[] {
  const allPosts = getAllPosts();
  const featured = allPosts.filter((p) => p.featured);
  if (featured.length > 0) {
    return featured.slice(0, limit);
  }
  return allPosts.slice(0, limit);
}

export interface TagCount {
  name: string;
  count: number;
}

export function getAllTags(): TagCount[] {
  const posts = getAllPosts();
  const tagCounts: { [tag: string]: number } = {};

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostItem[] {
  const posts = getAllPosts();
  const normalizedTag = tag.toLowerCase();
  return posts.filter((post) => post.tags?.some((t) => t.toLowerCase() === normalizedTag));
}

export function getRelatedPosts(currentSlug: string, currentTags: string[] = [], limit: number = 3): PostItem[] {
  const allPosts = getAllPosts().filter((p) => p.slug !== currentSlug);
  if (!currentTags || currentTags.length === 0) {
    return allPosts.slice(0, limit);
  }

  const scoredPosts = allPosts.map((post) => {
    const commonTags = post.tags?.filter((t) => currentTags.includes(t)) || [];
    return { post, score: commonTags.length };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post)
    .slice(0, limit);
}

export function getAllProjects(): ProjectItem[] {
  ensureDirectoryExists(PROJECTS_DIRECTORY);
  const files = fs.readdirSync(PROJECTS_DIRECTORY);
  const projects = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(PROJECTS_DIRECTORY, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        tags: data.tags || [],
        link: data.link || "",
        github: data.github || "",
        featured: data.featured ?? false,
        date: data.date || "",
        coverImage: data.coverImage || "",
        content,
      };
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return projects;
}

export async function getAboutContent(): Promise<{ frontmatter: any; htmlContent: string }> {
  try {
    if (!fs.existsSync(ABOUT_FILE)) {
      return {
        frontmatter: {},
        htmlContent: "<p>Welcome to my personal website and blog.</p>",
      };
    }
    const fileContents = fs.readFileSync(ABOUT_FILE, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = await markdownToHtml(content);
    return { frontmatter: data, htmlContent };
  } catch (e) {
    return {
      frontmatter: {},
      htmlContent: "<p>Error loading about content.</p>",
    };
  }
}
