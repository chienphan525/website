import 'css/prism.css'
import 'katex/dist/katex.css'

import { redirect, notFound } from 'next/navigation'
import { Metadata } from 'next'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'

import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'

import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'

import siteMetadata from '@/data/siteMetadata'
import { getAffiliateLink } from '@/lib/affiliate-links'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const defaultLayout = 'PostLayout'

const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const { slug } = await params
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  const authorList = post.authors || ['default']

  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const authors = authorDetails.map((author) => author.name)

  let imageList = [siteMetadata.socialBanner]

  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }

  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    slug: p.slug,
  }))
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  // 1. Affiliate link được ưu tiên trước
  const link = await getAffiliateLink(slug)

  if (link) {
    redirect(link.url)
  }

  // 2. Nếu không phải affiliate thì tìm bài viết
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

  const authorList = post.authors || ['default']

  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const mainContent = coreContent(post as Blog)

  const jsonLd = post.structuredData

  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
