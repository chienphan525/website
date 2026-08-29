import Link from "next/link";
import { PostItem } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

interface PostCardProps {
  post: PostItem;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
        featured
          ? "bg-gradient-to-br from-card via-card to-primary-500/5 border-primary-500/30 hover:border-primary-500/60 shadow-sm hover:shadow-md"
          : "bg-card border-border hover:border-primary-500/40 hover:shadow-md"
      }`}
    >
      <div>
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>

          {post.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
          <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
          {post.excerpt}
        </p>
      </div>

      {/* Footer: Tags & Read more */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4 mt-auto">
        <div className="flex flex-wrap gap-1.5 z-10">
          {post.tags?.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} clickable={true} />
          ))}
          {(post.tags?.length || 0) > 3 && (
            <span className="text-[11px] text-muted-foreground self-center">
              +{(post.tags?.length || 0) - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
          Read <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
}
