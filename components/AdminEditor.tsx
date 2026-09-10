'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

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
  const lastEditorHtml = useRef('')
  const onChangeRef = useRef(onChange)
  const fileInputRef = useRef<HTMLInputElement>(null)
  onChangeRef.current = onChange
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Image.configure({ allowBase64: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Viết nội dung bài viết ở đây…' }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: markdownToEditorHtml(content),
    editorProps: {
      attributes: { class: 'admin-rich-editor min-h-[28rem] p-4 outline-none' },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      lastEditorHtml.current = html
      onChangeRef.current(html)
    },
  })

  useEffect(() => {
    if (editor && content !== lastEditorHtml.current) {
      editor.commands.setContent(markdownToEditorHtml(content), { emitUpdate: false })
      lastEditorHtml.current = editor.getHTML()
    }
  }, [content, editor])

  if (!editor)
    return <div className="admin-rich-editor min-h-[28rem] p-4">Đang tải trình soạn thảo…</div>

  const toolClass = (active = false) =>
    `admin-editor-button ${active ? 'border-stone-900 bg-stone-900 text-white hover:bg-stone-800' : ''}`

  const addLink = () => {
    const url = window.prompt('Dán đường dẫn đầy đủ (https://…)')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('Dán đường dẫn ảnh đầy đủ (https://…)')
    if (url) editor.chain().focus().setImage({ src: url, alt: 'Hình minh họa' }).run()
  }

  const uploadImage = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

    if (!allowedTypes.includes(file.type)) {
      window.alert('Chỉ hỗ trợ JPG, PNG, WebP hoặc GIF.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert('Ảnh không được vượt quá 5 MB.')
      return
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = String(reader.result || '')
        resolve(result.split(',')[1] || '')
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: file.name,
        type: file.type,
        content: base64,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Không thể tải ảnh lên GitHub')
    }

    editor.chain().focus().setImage({ src: data.url, alt: 'Hình minh họa' }).run()
  }

  const setTextColor = () => {
    const color = window.prompt('Nhập mã màu, ví dụ: #b45309')
    if (color) editor.chain().focus().setColor(color).run()
  }

  const setHighlight = () => {
    const color = window.prompt('Nhập màu tô nền, ví dụ: #fef08a', '#fef08a')
    if (color) editor.chain().focus().toggleHighlight({ color }).run()
  }

  return (
    <div className="overflow-hidden rounded border border-stone-300 bg-white">
      {/* The container only prevents toolbar buttons from collapsing the editor selection. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="admin-editor-toolbar"
        aria-label="Công cụ soạn thảo"
        onMouseDown={(event) => {
          // Toolbar clicks must not steal the text selection before the command runs.
          if (event.target instanceof HTMLButtonElement) event.preventDefault()
        }}
      >
        <select
          aria-label="Kiểu đoạn văn"
          className="admin-editor-button"
          value={
            editor.isActive('heading', { level: 2 })
              ? 'h2'
              : editor.isActive('heading', { level: 3 })
                ? 'h3'
                : editor.isActive('heading', { level: 4 })
                  ? 'h4'
                  : 'p'
          }
          onChange={(event) => {
            const chain = editor.chain().focus()
            if (event.target.value === 'h2') chain.toggleHeading({ level: 2 }).run()
            else if (event.target.value === 'h3') chain.toggleHeading({ level: 3 }).run()
            else if (event.target.value === 'h4') chain.toggleHeading({ level: 4 }).run()
            else chain.setParagraph().run()
          }}
        >
          <option value="p">Đoạn văn</option>
          <option value="h2">Tiêu đề lớn</option>
          <option value="h3">Tiêu đề nhỏ</option>
          <option value="h4">Tiêu đề phụ</option>
        </select>
        <button
          type="button"
          className={toolClass(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Đậm
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('underline'))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Gạch chân
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Nghiêng
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('strike'))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Gạch chữ
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('highlight'))}
          onClick={setHighlight}
        >
          Tô màu
        </button>
        <button type="button" className={toolClass()} onClick={setTextColor}>
          Màu chữ
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Danh sách
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('orderedList'))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Đánh số
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('taskList'))}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          Checklist
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('blockquote'))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Trích dẫn
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('codeBlock'))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Mã
        </button>
        <button type="button" className={toolClass(editor.isActive('link'))} onClick={addLink}>
          Liên kết
        </button>
        <button
          type="button"
          className={toolClass()}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Bỏ link
        </button>
        <button type="button" className={toolClass()} onClick={addImage}>
          Ảnh URL
        </button>
        <button type="button" className={toolClass()} onClick={() => fileInputRef.current?.click()}>
          Chọn ảnh từ máy
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive('table'))}
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          Bảng
        </button>
        {editor.isActive('table') && (
          <>
            <button
              type="button"
              className={toolClass()}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              + Cột
            </button>
            <button
              type="button"
              className={toolClass()}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              + Hàng
            </button>
            <button
              type="button"
              className={toolClass()}
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Xóa bảng
            </button>
          </>
        )}
        <button
          type="button"
          className={toolClass(editor.isActive({ textAlign: 'left' }))}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          Trái
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive({ textAlign: 'center' }))}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          Giữa
        </button>
        <button
          type="button"
          className={toolClass(editor.isActive({ textAlign: 'right' }))}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          Phải
        </button>
        <button
          type="button"
          className={toolClass()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Đường kẻ
        </button>
        <button
          type="button"
          className={toolClass()}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Xóa định dạng
        </button>
        <button
          type="button"
          className={toolClass()}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Hoàn tác
        </button>
        <button
          type="button"
          className={toolClass()}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Làm lại
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            uploadImage(file).catch((error) => {
              window.alert(error instanceof Error ? error.message : 'Không thể tải ảnh lên')
            })
          }
          event.target.value = ''
        }}
      />
      <EditorContent editor={editor} />
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

  const body = post.body
    .replace(
      /<p>\s*<img\s+src=["']([^"']+)["']\s+alt=["']([^"']*)["']\s*\/?>\s*<\/p>/gi,
      (_, src, alt) => `![${alt || 'Hình minh họa'}](${src})`
    )
    .replace(
      /<img\s+src=["']([^"']+)["']\s+alt=["']([^"']*)["']\s*\/?>/gi,
      (_, src, alt) => `![${alt || 'Hình minh họa'}](${src})`
    )
    .replace(/<br\s*\/?>/gi, '<br />')

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
    body.trim(),
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
  const richBody = useRef('')

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
      body: JSON.stringify({
        slug: post.slug,
        content: toMdx({ ...post, body: editorMode === 'rich' ? richBody.current : post.body }),
      }),
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
      <div className="admin-label">
        Nội dung bài viết
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              update('body', richBody.current || post.body)
              setEditorMode('rich')
            }}
            className={`admin-editor-button ${editorMode === 'rich' ? 'bg-stone-900 text-white' : ''}`}
          >
            Trình soạn thảo
          </button>
          <button
            type="button"
            onClick={() => {
              update('body', richBody.current || post.body)
              setEditorMode('markdown')
            }}
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
          <RichTextEditor
            content={post.body}
            onChange={(content) => {
              richBody.current = content
            }}
          />
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
      </div>
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
