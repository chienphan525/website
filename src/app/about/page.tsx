import { Metadata } from "next";
import { getAboutContent } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { Github, Twitter, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about Chien Phan, background, technology stack, and engineering philosophy.",
};

export default async function AboutPage() {
  const { htmlContent } = await getAboutContent();

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Profile Card Header */}
      <div className="p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-emerald-400 text-white flex items-center justify-center font-extrabold text-3xl shadow-md">
            {siteConfig.author.name.charAt(0)}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {siteConfig.author.name}
            </h1>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {siteConfig.author.role}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{siteConfig.author.location}</span>
            </div>
          </div>
        </div>

        {/* Social Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
          {siteConfig.author.github && (
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {siteConfig.author.twitter && (
            <a
              href={siteConfig.author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" /> Twitter / X
            </a>
          )}
          {siteConfig.author.linkedin && (
            <a
              href={siteConfig.author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {siteConfig.author.email && (
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          )}
        </div>
      </div>

      {/* Rendered About Markdown */}
      <article className="prose dark:prose-invert prose-emerald max-w-none">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
}
