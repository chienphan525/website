import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostSlugs, getPostDetailWithHtml, getRelatedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { TagBadge } from "@/components/TagBadge";
import { PostCard } from "@/components/PostCard";
import { Calendar, Clock, ArrowLeft, User, ChevronRight } from "lucide-react";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostDetailWithHtml(params.slug);
  if (!post) return { title: "Post Not Found" };

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author || siteConfig.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url,
      authors: [post.author || siteConfig.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function SinglePostPage({ params }: PostPageProps) {
  const post = await getPostDetailWithHtml(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.tags, 3);
  const currentUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <div className="space-y-12">
      {/* Scroll Progress Bar */}
      <ReadingProgress />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-md font-medium">
          {post.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <TagBadge key={tag} tag={tag} clickable={true} />
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              {post.author || siteConfig.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>

          <ShareButtons title={post.title} url={currentUrl} />
        </div>
      </header>

      {/* Main Body + Sticky TOC Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 items-start">
        {/* Rendered Markdown Prose */}
        <article className="min-w-0">
          <div
            className="prose dark:prose-invert prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-2xl prose-pre:bg-card prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* Post Footer Share & Back to Blog */}
          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>

            <ShareButtons title={post.title} url={currentUrl} />
          </div>

          {/* Author Bio Box */}
          <div className="mt-8 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {siteConfig.author.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-sm">
                Written by {siteConfig.author.name}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {siteConfig.author.bio}
              </p>
            </div>
          </div>
        </article>

        {/* Sticky Table of Contents (Desktop) */}
        {post.toc && post.toc.length > 0 && (
          <aside className="hidden lg:block sticky top-24 space-y-6">
            <TableOfContents toc={post.toc} />
          </aside>
        )}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
