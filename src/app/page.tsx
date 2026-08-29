import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getAllPosts, getFeaturedPosts, getAllProjects, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { TagBadge } from "@/components/TagBadge";
import { ArrowRight, BookOpen, Sparkles, Code2, ExternalLink, Github, Zap } from "lucide-react";

export default function HomePage() {
  const featuredPosts = getFeaturedPosts(3);
  const allPosts = getAllPosts();
  const projects = getAllProjects().slice(0, 3);
  const tags = getAllTags().slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-6 sm:pt-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vercel 1-Click Deploy Ready • Markdown Powered</span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-primary-600 to-emerald-400 bg-clip-text text-transparent">
              {siteConfig.author.name}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {siteConfig.author.role}. {siteConfig.author.bio}
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>View Projects</span>
          </Link>

          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchienphan525%2Fwebsite"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium text-sm transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Deploy to Vercel</span>
          </a>
        </div>
      </section>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <section className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Explore by Topic
            </h3>
            <Link href="/blog" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
              View all tags
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge key={tag.name} tag={tag.name} count={tag.count} size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Featured Posts */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Articles</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Hand-picked deep dives, tutorials, and engineering notes.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            All posts ({allPosts.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} featured={post.featured} />
          ))}
        </div>

        <div className="sm:hidden pt-2 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400"
          >
            View all posts ({allPosts.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Projects Showcase */}
      {projects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Projects</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Open source tools, templates, and platforms I&apos;ve built.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              All projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vercel 1-Click Banner */}
      <section className="p-8 sm:p-10 rounded-3xl border border-primary-500/30 bg-gradient-to-br from-primary-500/5 via-card to-card relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
            One-Click Setup
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Deploy your own blog in 60 seconds
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fork this repository, connect your GitHub account to Vercel, and publish new articles simply by committing <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.md</code> files. No database, zero maintenance.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchienphan525%2Fwebsite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm shadow hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 116 100">
                <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" />
              </svg>
              <span>Deploy with Vercel</span>
            </a>
            <a
              href="https://github.com/chienphan525/website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
