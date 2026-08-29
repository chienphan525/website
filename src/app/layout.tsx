import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { getAllPosts } from "@/lib/posts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Personal Blog", "Next.js", "Markdown Blog", "Tailwind CSS", "Developer Portfolio", "Vercel"],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@" + siteConfig.name.replace(/\s+/g, ""),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allPosts = getAllPosts();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen selection:bg-primary-500/20 selection:text-primary-600 dark:selection:text-primary-400">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWrapper allPosts={allPosts}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
