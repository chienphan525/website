import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import VideoSection from '@/components/VideoSection'

export default function Home({ posts }) {
  return (
    <>
      <section className="cp-hero">
        <div className="cp-hero-overlay" />
        <div className="cp-hero-copy">
          <p className="cp-kicker">CHIẾN PHAN</p>
          <h1>
            <span className="block lg:inline">Chạm nhẹ từng</span>
            <span className="ml-2 block lg:inline">khoảnh khắc,</span>
            <br className="hidden lg:block" />
            <span className="block">mọi áp lực sẽ Tan</span>
          </h1>
          <p>
            <span>Những câu chuyện nhỏ về tài chính, cảm xúc</span>
            <br className="hidden lg:block" />
            <span>Và một cuộc sống an yên hơn.</span>
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="cp-kicker text-primary-500">GÓC CHIA SẺ</p>
            <h2 className="mt-2 font-sans text-4xl font-semibold text-stone-900 sm:text-5xl">
              Bài viết mới nhất
            </h2>
          </div>
          <Link href="/blog" className="cp-link hidden sm:block">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-7 md:grid-cols-2">
          {posts.map((post) => {
            const image = post.images?.[0]
            return (
              <article key={post.slug} className="cp-card group">
                <Link
                  href={'/blog/' + post.slug}
                  aria-label={post.title}
                  className="block overflow-hidden"
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="h-60 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-72"
                    />
                  ) : (
                    <div className="cp-card-placeholder h-60 sm:h-72" />
                  )}
                </Link>
                <div className="p-6 sm:p-7">
                  <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    <span>{post.tags?.[0] || 'Chia sẻ'}</span>
                    <span className="h-px w-6 bg-primary-400" />
                    <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
                  </div>
                  <h3 className="font-sans text-2xl font-semibold leading-tight text-stone-900 sm:text-3xl">
                    <Link href={'/blog/' + post.slug} className="transition hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 line-clamp-3 leading-7 text-stone-600">{post.summary}</p>
                  <Link href={'/blog/' + post.slug} className="cp-link mt-6 inline-block">
                    Đọc bài viết →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <VideoSection />
    </>
  )
}
