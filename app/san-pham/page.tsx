import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Sản phẩm',
  description: 'Những sản phẩm mình được sử dụng, trải nghiệm và hiểu',
})

export default function SanPhamPage() {
  return (
    <main className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1088px]">
        <header className="mb-14 max-w-2xl">
          <p className="cp-kicker text-[#ffd700]">SẢN PHẨM</p>

          <h1 className="mt-3 font-serif text-5xl text-stone-900 sm:text-6xl">
            Những thứ mình dùng
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Những sản phẩm mình đã sử dụng, thấy hữu ích và muốn chia sẻ lại từ trải nghiệm thực tế.
          </p>

          <div className="mt-6 h-0.5 w-12 bg-[#ffd700]" />
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <article className="cp-card p-6">
            <h2 className="font-serif text-2xl text-stone-900">Sản phẩm mình đang dùng</h2>

            <p className="mt-4 leading-relaxed text-stone-600">
              Những món đồ mình đang sử dụng trong cuộc sống và công việc hằng ngày.
            </p>
          </article>

          <article className="cp-card p-6">
            <h2 className="font-serif text-2xl text-stone-900">Sản phẩm mình đề xuất</h2>

            <p className="mt-4 leading-relaxed text-stone-600">
              Những sản phẩm mình thấy thực sự hữu ích và có thể phù hợp với bạn.
            </p>
          </article>
        </div>
      </div>
    </main>
  )
}
