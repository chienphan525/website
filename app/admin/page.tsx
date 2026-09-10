import Link from '@/components/Link'
import { isAdmin } from '@/lib/admin'
import { allBlogs } from 'contentlayer/generated'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login')
  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="cp-kicker text-primary-500">QUẢN TRỊ</p>
          <h1 className="mt-2 font-serif text-4xl">Bài viết</h1>
        </div>
        <div className="flex gap-3">
        <Link
          href="/admin/posts/new"
          className="rounded bg-amber-500 px-4 py-2 font-bold text-stone-950"
        >
          + Thêm bài viết
        </Link>
        <Link
          href="/admin/links"
          className="rounded border border-amber-500 px-4 py-2 font-bold text-amber-700"
        >
          Link Affiliate
        </Link>
        </div>
      </div>
      <p className="mt-4 text-stone-600">
        Các thay đổi được đưa lên GitHub, sau đó Vercel sẽ tự động xuất bản.
      </p>
      <div className="mt-8 divide-y rounded border border-stone-200 bg-white">
        {allBlogs.map((post) => (
          <div key={post.slug} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="mt-1 text-sm text-stone-500">/{post.slug}</p>
            </div>
            <Link href={'/admin/posts/' + post.slug} className="cp-link">
              Chỉnh sửa →
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
