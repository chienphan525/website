'use client'

import { useMemo, useState } from 'react'
import Link from './Link'
import type { YouTubeVideo } from '@/lib/youtube'

type Props = {
  initialVideos: YouTubeVideo[]
  initialNextPageToken?: string
  completeArchive: boolean
}

export default function VideoGallery({
  initialVideos,
  initialNextPageToken,
  completeArchive,
}: Props) {
  const [videos, setVideos] = useState(initialVideos)
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const visibleVideos = useMemo(() => {
    const now = new Date()
    const days = period === 'month' ? 31 : period === 'year' ? 366 : Infinity
    return videos
      .filter((video) =>
        video.title.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi'))
      )
      .filter(
        (video) =>
          days === Infinity ||
          now.getTime() - new Date(video.published).getTime() <= days * 86400000
      )
      .sort((a, b) =>
        sort === 'newest'
          ? b.published.localeCompare(a.published)
          : a.published.localeCompare(b.published)
      )
  }, [videos, query, period, sort])

  async function loadMore() {
    if (!nextPageToken || loading) return
    setLoading(true)
    try {
      const response = await fetch(
        '/api/videos?limit=12&pageToken=' + encodeURIComponent(nextPageToken)
      )
      const page = await response.json()
      setVideos((current) => [
        ...current,
        ...page.videos.filter(
          (video: YouTubeVideo) => !current.some((item) => item.id === video.id)
        ),
      ])
      setNextPageToken(page.nextPageToken)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-9 grid gap-4 rounded border border-stone-200 bg-white p-4 sm:grid-cols-3">
        <label className="video-filter">
          Tìm video
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập tiêu đề…"
          />
        </label>
        <label className="video-filter">
          Thời gian
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="all">Tất cả</option>
            <option value="month">30 ngày gần đây</option>
            <option value="year">12 tháng gần đây</option>
          </select>
        </label>
        <label className="video-filter">
          Sắp xếp
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </label>
      </div>
      {visibleVideos.length ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVideos.map((video) => (
            <Link
              href={`https://www.youtube.com/watch?v=${video.id}`}
              key={video.id}
              className="cp-card group"
            >
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <h2 className="font-serif text-xl leading-snug text-stone-900">{video.title}</h2>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {video.published}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-stone-600">Không tìm thấy video phù hợp.</p>
      )}
      {nextPageToken && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="admin-button disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Đang tải…' : 'Tải thêm video'}
          </button>
        </div>
      )}
      {!completeArchive && (
        <p className="mt-8 text-center text-sm text-stone-500">
          Thêm YouTube API key để duyệt toàn bộ kho video của kênh.
        </p>
      )}
    </section>
  )
}
