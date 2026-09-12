import Link from './Link'
import { channelUrl, getVideoPage } from '@/lib/youtube'

export default async function VideoSection() {
  const { videos } = await getVideoPage({ limit: 6 })
  if (!videos.length) return null

  return (
    <section className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="cp-kicker text-primary-600">CHIẾN PHAN TV</p>
            <h2 className="mt-2 font-serif text-4xl text-stone-900 sm:text-5xl">Video mới nhất</h2>
          </div>
          <Link href="/videos" className="cp-link text-primary-400">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {videos.map((video) => (
            <Link
              href={`https://www.youtube.com/watch?v=${video.id}`}
              key={video.id}
              className="group"
            >
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                className="aspect-video w-full object-cover transition duration-500 group-hover:opacity-80"
              />
              <h3 className="mt-4 font-serif text-xl leading-snug">{video.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-stone-400">
                {video.published}
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-stone-400">
          <Link href={channelUrl} className="underline underline-offset-4">
            Xem kênh Chiến Phan TV trên YouTube
          </Link>
        </p>
      </div>
    </section>
  )
}
