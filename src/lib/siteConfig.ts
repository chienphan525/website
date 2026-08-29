export interface SiteConfig {
  title: string;
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    location: string;
    email: string;
    github: string;
    twitter: string;
    linkedin: string;
  };
  navLinks: Array<{
    title: string;
    href: string;
  }>;
}

export const siteConfig: SiteConfig = {
  title: "Chien Phan | Personal Blog & Portfolio",
  name: "Chien Phan",
  description: "A fast, modern personal blog engineered for seamless Markdown content management and one-click Vercel deployment.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://my-markdown-blog.vercel.app",
  ogImage: "/og-default.png",
  author: {
    name: "Chien Phan",
    role: "Full-Stack Engineer & Builder",
    bio: "Passionate about web performance, clean architecture, AI engineering, and minimalist design. Writing about web development, engineering practices, and lessons learned.",
    avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
    location: "Vietnam / Remote",
    email: "contact@chienphan.dev",
    github: "https://github.com/chienphan525",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  navLinks: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
  ],
};
