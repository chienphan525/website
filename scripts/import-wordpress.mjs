import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const source = "https://chienphan.com/wp-json/wp/v2/posts?per_page=100&_embed";
const destination = join(process.cwd(), "content", "posts");
const decode = (text) => text.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#8217;/g, "’");
const markdown = (html) => decode(html)
  .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n\n## $1\n\n")
  .replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, "**$2**")
  .replace(/<(em|i)>(.*?)<\/(em|i)>/gi, "*$2*")
  .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
  .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<\/(p|div|blockquote)>/gi, "\n\n")
  .replace(/<[^>]+>/g, "")
  .replace(/\n{3,}/g, "\n\n").trim();

await mkdir(destination, { recursive: true });
const existing = new Set(await readdir(destination));
const response = await fetch(source);
if (!response.ok) throw new Error(`WordPress returned ${response.status}`);
const posts = await response.json();
let created = 0;
for (const post of posts) {
  const file = `${post.slug}.md`;
  if (existing.has(file)) continue;
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Nhật ký";
  const body = markdown(post.content.rendered);
  const excerpt = markdown(post.excerpt.rendered).replace(/\n/g, " ").slice(0, 180);
  const document = `---\ntitle: "${decode(post.title.rendered).replace(/"/g, '\\"')}"\ndate: "${post.date.slice(0, 10)}"\ncategory: "${category}"\nexcerpt: "${excerpt.replace(/"/g, '\\"')}"\n---\n${body}\n`;
  await writeFile(join(destination, file), document, "utf8");
  created++;
}
console.log(`Imported ${created} new articles. Existing files were left unchanged.`);
