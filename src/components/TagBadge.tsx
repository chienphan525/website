import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  count?: number;
  isActive?: boolean;
  clickable?: boolean;
  size?: "sm" | "md";
}

export function TagBadge({
  tag,
  count,
  isActive = false,
  clickable = true,
  size = "sm",
}: TagBadgeProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full transition-all border",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        isActive
          ? "bg-primary-600 text-white border-primary-600 shadow-sm"
          : "bg-muted/80 text-muted-foreground border-border hover:text-foreground hover:bg-muted hover:border-primary-500/40"
      )}
    >
      <span>#{tag}</span>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
            isActive ? "bg-white/20 text-white" : "bg-card text-muted-foreground border border-border"
          )}
        >
          {count}
        </span>
      )}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/blog?tag=${encodeURIComponent(tag)}`} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
