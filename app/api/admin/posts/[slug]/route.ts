import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { getPostSource, removePost, savePost } from '@/lib/post-store'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ content: await getPostSource((await params).slug) })
}
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { content, slug } = await request.json()
  await savePost(slug, content, (await params).slug)
  return NextResponse.json({ ok: true })
}
export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await removePost((await params).slug)
  return NextResponse.json({ ok: true })
}
