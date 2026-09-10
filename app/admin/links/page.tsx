import AffiliateLinkManager from '@/components/AffiliateLinkManager'
import { isAdmin } from '@/lib/admin'
import { redirect } from 'next/navigation'

export default async function AffiliateLinksPage() {
  if (!(await isAdmin())) redirect('/admin/login')

  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <div>
        <p className="cp-kicker text-primary-500">QUẢN TRỊ</p>
        <h1 className="mt-2 font-serif text-4xl">Link Affiliate</h1>
        <p className="mt-4 text-stone-600">
          Tạo, tìm kiếm và sao chép link affiliate nhanh chóng.
        </p>
      </div>

      <AffiliateLinkManager />
    </main>
  )
}
