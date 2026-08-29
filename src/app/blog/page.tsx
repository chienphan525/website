import { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { BlogListClient } from "./BlogListClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog & Articles",
  description: "Browse all articles, tutorials, and insights on web architecture, Next.js, and software engineering.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground text-sm">Loading articles...</div>}>
      <BlogListClient posts={posts} tags={tags} />
    </Suspense>
  );
}
