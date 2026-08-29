"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostItem, TagCount } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { TagBadge } from "@/components/TagBadge";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface BlogListClientProps {
  posts: PostItem[];
  tags: TagCount[];
}

export function BlogListClient({ posts, tags }: BlogListClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = searchParams.get("tag") || "";
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      !selectedTag ||
      post.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesTag && matchesSearch;
  });

  const handleTagClick = (tag: string) => {
    if (selectedTag.toLowerCase() === tag.toLowerCase()) {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Articles & Notes
        </h1>
        <p className="text-muted-foreground text-base">
          Thoughts, technical guides, and architecture insights. All written in pure Markdown.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by title, excerpt, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <button
              onClick={() => router.push("/blog")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 text-xs font-semibold hover:bg-primary-500/20 transition-colors"
            >
              <span>Tag: #{selectedTag}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tag Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Topics:
          </span>
          <button
            onClick={() => router.push("/blog")}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
              !selectedTag
                ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                : "bg-muted/80 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            }`}
          >
            All ({posts.length})
          </button>
          {tags.map((tag) => {
            const isActive = selectedTag.toLowerCase() === tag.name.toLowerCase();
            return (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className="transition-transform active:scale-95"
              >
                <TagBadge
                  tag={tag.name}
                  count={tag.count}
                  isActive={isActive}
                  clickable={false}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredPosts.length} of {posts.length} articles
          </span>
          {(selectedTag || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery("");
                router.push("/blog");
              }}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
            <p className="text-base font-semibold text-foreground">No articles found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any articles matching your search criteria. Try removing filters or searching for different terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                router.push("/blog");
              }}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} featured={post.featured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
