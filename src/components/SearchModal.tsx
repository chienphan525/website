"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PostItem } from "@/lib/posts";
import { Search, X, Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostItem[];
}

export function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle global Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPosts = posts.filter((post) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const matchTitle = post.title.toLowerCase().includes(q);
    const matchExcerpt = post.excerpt.toLowerCase().includes(q);
    const matchTags = post.tags?.some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchExcerpt || matchTags;
  });

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles by title, keyword, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-muted border border-border text-muted-foreground rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 divide-y divide-border/60">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No articles found matching &quot;{query}&quot;.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.slug}
                onClick={() => handleSelect(post.slug)}
                className="group py-3.5 px-3 rounded-xl hover:bg-muted/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-base">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} found</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
