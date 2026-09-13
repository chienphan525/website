import { permanentRedirect, redirect, notFound } from 'next/navigation'
import { allBlogs } from 'contentlayer/generated'
import { getAffiliateLink } from '@/lib/affiliate-links'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function AffiliateRedirectPage({ params }: Props) {
  const { slug } = await params
  const link = await getAffiliateLink(slug)

  if (link) {
    redirect(link.url)
  }

  const post = allBlogs.find((p) => p.slug === slug)

  if (post) {
    permanentRedirect(`/blog/${post.slug}`)
  }

  notFound()
}
