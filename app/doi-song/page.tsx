import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { formatDate } from 'pliny/utils/formatDate'

export const metadata = genPageMetadata({
  title: 'Đời sống',
  description: 'Những câu chuyện về đời sống, gia đình, công việc và những trải nghiệm thật.',
})

export default function DoiSongPage() {
  const posts = allCoreContent(sortPosts(allBlogs)).filter((post) =>
    post.tags?.includes('Đời sống')
  )

  return (
    <main className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl">
          <p className="cp-kicker text-[#ffd700]">ĐỜI SỐNG</p>

          <h1 className="mt-3 font-serif text-5xl text-stone-900 sm:text-6xl">
            Những câu chuyện từ cuộc sống
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            Những câu chuyện về gia đình, công việc, những trải nghiệm thật.
          </p>

          <div className="mt-6 h-0.5 w-12 bg-[#ffd700]" />
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="cp-card overflow-hidden">
              {post.images?.[0] && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              )}

              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  {formatDate(post.date, 'vi-VN')}
                </p>

                <h2 className="mt-3 font-serif text-2xl leading-snug text-stone-900">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                {post.summary && <p className="mt-4 leading-relaxed text-stone-600">{post.summary}</p>}

                <Link
                  href={`/blog/${post.slug}`} className="cp-link mt-6 inline-block">
                  Đọc bài viết →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
