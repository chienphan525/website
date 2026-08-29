import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = siteConfig.url;

  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.description,
    id: baseUrl,
    link: baseUrl,
    language: "en",
    image: `${baseUrl}/favicon.ico`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.name}`,
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      link: baseUrl,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.excerpt,
      content: post.rawContent,
      author: [
        {
          name: post.author || siteConfig.author.name,
          email: siteConfig.author.email,
          link: baseUrl,
        },
      ],
      date: new Date(post.date),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
