'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type PostForm = {
  title: string
  slug: string
  date: string
  tags: string
  summary: string
  image: string
  body: string
}

const blank: PostForm = {
  title: '',
  slug: '',
  date: new Date().toISOString().slice(0, 10),
  tags: 'Blog',
  summary: '',
  image: '',
  body: '',
}

function value(source: string, field: string) {
  return (
    source.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') || ''
  )
}

function readPost(source: string): PostForm {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)?.[1] || ''
  const image = frontmatter.match(/images:\s*\[["']?([^"']+)/)?.[1] || ''
  return {
    title: value(frontmatter, 'title'),
    slug: '',
    date: value(frontmatter, 'date'),
    tags: (frontmatter.match(/tags:\s*\[([^\]]*)\]/)?.[1] || '').replace(/["']/g, ''),
    summary: value(frontmatter, 'summary'),
    image,
    body: source.replace(/^---\n[\s\S]*?\n---\n?/, '').trim(),
  }
}

function quote(text: string) {
  return JSON.stringify(text)
}

function toMdx(post: PostForm) {
  const tags = post.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  return [
    '---',
    `title: ${quote(post.title)}`,
    `date: ${post.date}`,
    `tags: ${JSON.stringify(tags)}`,
    `summary: ${quote(post.summary)}`,
    post.image ? `images: ${JSON.stringify([post.image])}` : '',
    'layout: PostSimple',
    '---',
    '',
    post.body.trim(),
    '',
  ]
    .filter(Boolean)
    .join('\n')
}

export default function AdminEditor({ initialSlug }: { initialSlug?: string }) {
  const router = useRouter()
  const [post, setPost] = useState<PostForm>(blank)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!initialSlug) return
    fetch('/api/admin/posts/' + initialSlug)
      .then(async (response) => {
        if (!response.ok) throw new Error('Không thể tải bài viết.')
        const data = await response.json()
        setPost({ ...readPost(data.content), slug: initialSlug })
      })
      .catch((error) => setStatus(error.message))
  }, [initialSlug])

  const update = (field: keyof PostForm, content: string) =>
    setPost((current) => ({ ...current, [field]: content }))

  async function save(event: FormEvent) {
    event.preventDefault()
    setStatus('Đang lưu…')
    const endpoint = initialSlug ? '/api/admin/posts/' + initialSlug : '/api/admin/posts'
    const response = await fetch(endpoint, {
      method: initialSlug ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: post.slug, content: toMdx(post) }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return setStatus(error.error || 'Không thể lưu bài viết.')
    }
    setStatus('Đã lưu. Vercel sẽ tự xuất bản thay đổi trong ít phút.')
    if (!initialSlug) router.replace('/admin/posts/' + post.slug)
  }

  async function remove() {
    if (!initialSlug || !confirm('Bạn có chắc muốn xóa bài viết này?')) return
    const response = await fetch('/api/admin/posts/' + initialSlug, { method: 'DELETE' })
    if (!response.ok) return setStatus('Không thể xóa bài viết.')
    router.replace('/admin')
  }

  return (
    <form
      onSubmit={save}
      className="space-y-6 rounded border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
    >
      {status && <p className="rounded bg-amber-50 px-4 py-3 text-sm text-amber-900">{status}</p>}
      <label className="admin-label">
        Tiêu đề
        <input
          required
          className="admin-input"
          value={post.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="admin-label">
          Đường dẫn bài viết
          <input
            required
            className="admin-input"
            value={post.slug}
            disabled={Boolean(initialSlug)}
            onChange={(e) =>
              update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
            }
            placeholder="bai-viet-moi"
          />
        </label>
        <label className="admin-label">
          Ngày đăng
          <input
            required
            type="date"
            className="admin-input"
            value={post.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </label>
      </div>
      <label className="admin-label">
        Chủ đề (ngăn cách bằng dấu phẩy)
        <input
          className="admin-input"
          value={post.tags}
          onChange={(e) => update('tags', e.target.value)}
          placeholder="Blog, Ngẫm"
        />
      </label>
      <label className="admin-label">
        Ảnh đại diện (đường dẫn ảnh)
        <input
          className="admin-input"
          value={post.image}
          onChange={(e) => update('image', e.target.value)}
          placeholder="/static/chienphan/ten-anh.webp"
        />
      </label>
      <label className="admin-label">
        Mô tả ngắn
        <input
          className="admin-input"
          value={post.summary}
          onChange={(e) => update('summary', e.target.value)}
        />
      </label>
      <label className="admin-label">
        Nội dung bài viết
        <textarea
          required
          className="admin-input min-h-[28rem]"
          value={post.body}
          onChange={(e) => update('body', e.target.value)}
          placeholder={
            'Viết nội dung tại đây.\n\nDùng một dòng trống để tách đoạn.\n## Tiêu đề lớn\n### Tiêu đề nhỏ'
          }
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button className="admin-button">Lưu bài viết</button>
        {initialSlug && (
          <button
            type="button"
            onClick={remove}
            className="border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
          >
            Xóa bài viết
          </button>
        )}
      </div>
    </form>
  )
}
