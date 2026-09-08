import Link from './Link'
import { channelUrl, getVideoPage } from '@/lib/youtube'

export default async function VideoSection() {
  const { videos } = await getVideoPage({ limit: 6 })
  if (!videos.length) return null

  return (
    <section className="bg-stone-950 px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="cp-kicker text-primary-400">CHIẾN PHAN TV</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Video mới nhất</h2>
          </div>
          <Link href="/videos" className="cp-link text-primary-400">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
