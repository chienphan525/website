'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
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

const exampleArticle = `## Tiêu đề phần đầu

Viết đoạn mở đầu của bài viết ở đây. Hãy giải thích ngắn gọn điều người đọc sẽ nhận được.

## Nội dung chính

Bạn có thể dùng **chữ đậm**, *chữ nghiêng* và [một liên kết](https://example.com).

- Ý quan trọng thứ nhất
- Ý quan trọng thứ hai

## Kết luận

Tóm tắt ý chính và đưa ra lời khuyên cuối bài.`

function markdownToEditorHtml(markdown: string) {
  if (/<\/?[a-z][\s\S]*>/i.test(markdown)) return markdown

  const inline = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const heading = block.match(/^(#{2,4})\s+(.+)$/)
      if (heading) return `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`
      if (/^(?:- |\* )/m.test(block)) {
        return `<ul>${block
          .split('\n')
          .filter((line) => /^(?:- |\* )/.test(line))
          .map((line) => `<li>${inline(line.replace(/^(?:- |\* )/, ''))}</li>`)
          .join('')}</ul>`
      }
      return `<p>${inline(block).replace(/\n/g, '<br>')}</p>`
    })
    .join('')
}

function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (value: string) => void
}) {
  const editor = useRef<HTMLDivElement>(null)
  const lastEmitted = useRef('')

  useEffect(() => {
    if (editor.current && content !== lastEmitted.current) {
      editor.current.innerHTML = markdownToEditorHtml(content)
      lastEmitted.current = content
    }
  }, [content])

  const command = (name: string, commandValue?: string) => {
    editor.current?.focus()
    document.execCommand(name, false, commandValue)
    if (editor.current) {
      lastEmitted.current = editor.current.innerHTML
      onChange(editor.current.innerHTML)
    }
  }

  const addLink = () => {
    const url = window.prompt('Dán đường dẫn đầy đủ (https://…)')
    if (url) command('createLink', url)
  }

  return (
    <div className="overflow-hidden rounded border border-stone-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-stone-200 bg-stone-50 p-2">
        <button type="button" className="admin-editor-button" onClick={() => command('bold')}>
          Đậm
        </button>
        <button
          type="button"
          className="admin-editor-button italic"
          onClick={() => command('italic')}
        >
          Nghiêng
        </button>
        <button
          type="button"
          className="admin-editor-button"
          onClick={() => command('formatBlock', 'h2')}
        >
          Tiêu đề
        </button>
        <button
          type="button"
          className="admin-editor-button"
          onClick={() => command('insertUnorderedList')}
        >
          Danh sách
        </button>
        <button type="button" className="admin-editor-button" onClick={addLink}>
          Thêm liên kết
        </button>
      </div>
      <div
        ref={editor}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder="Viết nội dung bài viết ở đây…"
        className="admin-rich-editor min-h-[28rem] p-4 outline-none"
        onInput={() => {
          if (!editor.current) return
          lastEmitted.current = editor.current.innerHTML
          onChange(editor.current.innerHTML)
        }}
      />
    </div>
  )
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
  const [editorMode, setEditorMode] = useState<'rich' | 'markdown'>('rich')

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
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEditorMode('rich')}
            className={`admin-editor-button ${editorMode === 'rich' ? 'bg-stone-900 text-white' : ''}`}
          >
            Trình soạn thảo
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('markdown')}
            className={`admin-editor-button ${editorMode === 'markdown' ? 'bg-stone-900 text-white' : ''}`}
          >
            Markdown
          </button>
          {editorMode === 'markdown' && (
            <button
              type="button"
              className="admin-editor-button"
              onClick={() => update('body', exampleArticle)}
            >
              Nhập ví dụ
            </button>
          )}
        </div>
        <p className="mt-2 text-sm font-normal normal-case tracking-normal text-stone-500">
          {editorMode === 'rich'
            ? 'Dùng các nút định dạng để viết bài mà không cần biết Markdown.'
            : 'Dành cho người quen Markdown. “Nhập ví dụ” sẽ thay nội dung hiện tại bằng một mẫu.'}
        </p>
        {editorMode === 'rich' ? (
          <RichTextEditor content={post.body} onChange={(content) => update('body', content)} />
        ) : (
          <textarea
            required
            className="admin-input mt-2 min-h-[28rem] font-mono text-sm"
            value={post.body}
            onChange={(e) => update('body', e.target.value)}
            placeholder={
              'Viết nội dung tại đây.\n\nDùng một dòng trống để tách đoạn.\n## Tiêu đề lớn'
            }
          />
        )}
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
