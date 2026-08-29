import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import readingTime from "reading-time";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function extractTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // remove markdown links and formatting if present
    const text = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_~]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    toc.push({ id, text, level });
  }

  return toc;
}

export function calculateReadingTime(content: string): string {
  const stats = readingTime(content);
  return stats.text;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = (unified() as any)
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["anchor-link"],
        ariaLabel: "Link to section",
      },
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
      keepBackground: true,
      onVisitLine(node: any) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
      onVisitHighlightedLine(node: any) {
        node.properties.className = ["line--highlighted"];
      },
      onVisitHighlightedWord(node: any) {
        node.properties.className = ["word--highlighted"];
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(markdown);
  return result.toString();
}
