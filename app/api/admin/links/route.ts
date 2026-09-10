import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import {
  getAffiliateLinks,
  saveAffiliateLinks,
  makeSlug,
  type AffiliateLink,
} from '@/lib/affiliate-links'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const links = await getAffiliateLinks()

  return NextResponse.json(links)
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const name = String(body.name || '').trim()
  const url = String(body.url || '').trim()
  const platform = String(body.platform || '').trim()

  if (!name || !url) {
    return NextResponse.json({ error: 'Tên sản phẩm và link là bắt buộc' }, { status: 400 })
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Link không hợp lệ' }, { status: 400 })
  }

  const links = await getAffiliateLinks()

  let slug = makeSlug(String(body.slug || name))

  if (!slug) {
    return NextResponse.json({ error: 'Không tạo được slug' }, { status: 400 })
  }

  if (links.some((link) => link.slug === slug)) {
    let number = 2
    const originalSlug = slug

    while (links.some((link) => link.slug === slug)) {
      slug = `${originalSlug}-${number}`
      number++
    }
  }

  const now = new Date().toISOString()

  const newLink: AffiliateLink = {
    name,
    slug,
    url,
    platform,
    createdAt: now,
    updatedAt: now,
  }

  links.unshift(newLink)

  await saveAffiliateLinks(links)

  return NextResponse.json(newLink, { status: 201 })
}
