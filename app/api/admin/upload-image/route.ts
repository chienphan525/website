import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const maxBytes = 5 * 1024 * 1024

function safeFilename(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)

  const name = String(body?.name || '')
  const type = String(body?.type || '')
  const content = String(body?.content || '')

  if (!allowedTypes.has(type)) {
    return NextResponse.json(
      { error: 'Định dạng ảnh không được hỗ trợ' },
      { status: 400 }
    )
  }

  if (!name || !content) {
    return NextResponse.json(
      { error: 'Thiếu tên hoặc dữ liệu ảnh' },
      { status: 400 }
    )
  }

  const estimatedBytes = Math.ceil((content.length * 3) / 4)

  if (estimatedBytes > maxBytes) {
    return NextResponse.json(
      { error: 'Ảnh vượt quá 5 MB' },
      { status: 400 }
    )
  }

  const extension =
    type === 'image/jpeg'
      ? 'jpg'
      : type.split('/')[1]

  const baseName =
    safeFilename(name.replace(/\.[^.]+$/, '')) || 'image'

  const filename = `public/images/blog/${baseName}-${Date.now()}.${extension}`

  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO

  if (!token || !repo) {
    return NextResponse.json(
      { error: 'Thiếu cấu hình GitHub' },
      { status: 500 }
    )
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filename}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add blog image: ${baseName}`,
        content,
      }),
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: `GitHub upload failed: ${response.status}` },
      { status: 500 }
    )
  }

  const url = `/${filename.replace(/^public\//, '')}`

  return NextResponse.json({
    path: url,
    url,
  })
}
