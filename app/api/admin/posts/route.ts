import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { savePost } from '@/lib/post-store'

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug, content } = await request.json()
  await savePost(slug, content)
  return NextResponse.json({ ok: true })
}
