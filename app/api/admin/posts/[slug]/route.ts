import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { getPostSource, removePost, savePost } from '@/lib/post-store'

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ content: await getPostSource((await params).slug) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load article.' },
      { status: 503 }
    )
  }
}
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { content, slug } = await request.json()
    await savePost(slug, content, (await params).slug)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save article.' },
      { status: 503 }
    )
  }
}
export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await removePost((await params).slug)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to remove article.' },
      { status: 503 }
    )
  }
}
