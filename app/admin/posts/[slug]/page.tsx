import AdminEditor from '@/components/AdminEditor'
import { isAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'
export default async function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect('/admin/login')
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-serif text-4xl">Chỉnh sửa bài viết</h1>
      <div className="mt-8">
        <AdminEditor initialSlug={(await params).slug} />
      </div>
    </main>
  )
}
