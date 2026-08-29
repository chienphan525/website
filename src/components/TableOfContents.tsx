"use client";

import * as React from "react";
import { TOCItem } from "@/lib/markdown";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  toc: TOCItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -70% 0%",
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <nav className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 font-semibold text-xs text-foreground uppercase tracking-wider mb-3">
        <List className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>On this page</span>
      </div>
      <ul className="space-y-2 text-xs">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
              className="line-clamp-1"
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-0.5 transition-colors leading-normal",
                  isActive
                    ? "text-primary-600 dark:text-primary-400 font-semibold translate-x-0.5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
