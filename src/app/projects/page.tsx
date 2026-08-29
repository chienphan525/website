import { Metadata } from "next";
import { getAllProjects } from "@/lib/posts";
import { ExternalLink, Github, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects & Work",
  description: "A showcase of open source projects, web applications, and developer tools.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Projects & Creations
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          A collection of open-source tools, developer templates, and web applications I&apos;ve engineered.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {project.content && (
                <p className="text-xs text-muted-foreground/80 leading-normal pt-1">
                  {project.content}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-border/60">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
