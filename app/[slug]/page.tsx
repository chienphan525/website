import { redirect, notFound } from 'next/navigation'
import { getAffiliateLink } from '@/lib/affiliate-links'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function AffiliateRedirectPage({ params }: Props) {
  const { slug } = await params

  const link = await getAffiliateLink(slug)

  if (!link) notFound()

  redirect(link.url)
}
