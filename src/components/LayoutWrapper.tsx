"use client";

import * as React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SearchModal } from "./SearchModal";
import { PostItem } from "@/lib/posts";

interface LayoutWrapperProps {
  children: React.ReactNode;
  allPosts: PostItem[];
}

export function LayoutWrapper({ children, allPosts }: LayoutWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Global Cmd+K / Ctrl+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={allPosts}
      />
    </div>
  );
}
