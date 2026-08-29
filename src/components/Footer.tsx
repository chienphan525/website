"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { Github, Twitter, Linkedin, Mail, Rss, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card/40 mt-20 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Bio */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-base tracking-tight">{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.author.bio}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/rss.xml" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 transition-colors">
                  <Rss className="w-3.5 h-3.5" /> RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Connect</h4>
            <div className="flex flex-wrap gap-2">
              {siteConfig.author.github && (
                <a
                  href={siteConfig.author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {siteConfig.author.twitter && (
                <a
                  href={siteConfig.author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {siteConfig.author.linkedin && (
                <a
                  href={siteConfig.author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteConfig.author.email && (
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by Next.js & Markdown • Ready for Vercel One-Click Deploy.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Back to top"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
