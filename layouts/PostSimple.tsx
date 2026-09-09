import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostSimple({ content, next, prev, children }: LayoutProps) {
  const { slug, date, title, tags, readingTime } = content

  return (
    <article className="cp-post">
      <ScrollTopAndComment />
      <div className="relative h-[50vh] w-full overflow-hidden">
        {content.images && content.images.length > 0 && (
          <img src={content.images[0]} alt={title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <header className="border-b border-stone-200 bg-[#f1ece2]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
          <Link href="/blog" className="cp-link">
            ← Tất cả bài viết
          </Link>
          <div className="mt-7 flex justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
            <span>{tags?.[0] || 'Chia sẻ'}</span>
            <span>•</span>
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </div>
          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-sm text-stone-500">{readingTime?.text}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="cp-prose prose max-w-none">{children}</div>

        <div className="mt-14 border-y border-stone-200 py-7">
          <p className="font-serif text-2xl text-stone-900">Chạm là Tan</p>
          <p className="mt-2 leading-7 text-stone-600">
            Chạm nhẹ từng khoảnh khắc, mọi áp lực sẽ Tan.
          </p>
        </div>

        {(prev || next) && (
          <nav className="mt-10 grid gap-5 sm:grid-cols-2" aria-label="Điều hướng bài viết">
            {prev ? (
              <Link href={'/' + prev.path} className="cp-post-nav">
                <span>Bài trước</span>
                {prev.title}
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link href={'/' + next.path} className="cp-post-nav text-right">
                <span>Bài tiếp theo</span>
                {next.title}
              </Link>
            )}
          </nav>
        )}

        {siteMetadata.comments?.provider && (
          <div className="mt-12" id="comment">
            <Comments slug={slug} />
          </div>
        )}
      </div>
    </article>
  )
}
