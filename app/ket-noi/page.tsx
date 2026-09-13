import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Kết nối',
  description: 'Kết nối với Chiến Phan.',
})

export default function KetNoiPage() {
  return (
    <main className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl">
          <p className="cp-kicker text-[#ffd700]">KẾT NỐI</p>

          <h1 className="mt-3 font-serif text-5xl text-stone-900 sm:text-6xl">
            Gặp mình ở những nơi này
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Nếu những điều mình chia sẻ hữu ích với bạn, chúng ta có thể gặp nhau
            trên các kênh của mình.
          </p>

          <div className="mt-6 h-0.5 w-12 bg-[#ffd700]" />
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <a
            href="https://www.youtube.com/@chienphantv"
            target="_blank"
            rel="noreferrer"
            className="cp-card group p-6 transition hover:border-[#ffd700]"
          >
            <p className="cp-kicker text-[#ffd700]">YOUTUBE</p>
            <h2 className="mt-3 font-serif text-2xl text-stone-900">Chiến Phan TV</h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              Review, kỹ thuật, mẹo sử dụng và những chia sẻ từ trải nghiệm thực tế.
            </p>
            <span className="cp-link mt-6 inline-block">Xem kênh →</span>
          </a>

          <a
            href="https://www.tiktok.com/@chienphan.com"
            target="_blank"
            rel="noreferrer"
            className="cp-card group p-6 transition hover:border-[#ffd700]"
          >
            <p className="cp-kicker text-[#ffd700]">TIKTOK</p>
            <h2 className="mt-3 font-serif text-2xl text-stone-900">chienphan.com</h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              Những video ngắn, mẹo hay và trải nghiệm sản phẩm trong cuộc sống hằng ngày.
            </p>
            <span className="cp-link mt-6 inline-block">Xem TikTok →</span>
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="cp-card group p-6 transition hover:border-[#ffd700]"
          >
            <p className="cp-kicker text-[#ffd700]">FACEBOOK</p>
            <h2 className="mt-3 font-serif text-2xl text-stone-900">Chiến Phan</h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              Những câu chuyện, suy nghĩ và chia sẻ gần gũi hơn từ cuộc sống.
            </p>
            <span className="cp-link mt-6 inline-block">Kết nối →</span>
          </a>

          <a href="/" className="cp-card group p-6 transition hover:border-[#ffd700]">
            <p className="cp-kicker text-[#ffd700]">WEBSITE</p>
            <h2 className="mt-3 font-serif text-2xl text-stone-900">
              chienphan.com
            </h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              Đây là nơi mình tập hợp những điều muốn lưu lại, chia sẻ và xây dựng lâu dài.
            </p>
            <span className="cp-link mt-6 inline-block">Về trang chủ →</span>
          </a>
        </div>
      </div>
    </main>
  )
}
