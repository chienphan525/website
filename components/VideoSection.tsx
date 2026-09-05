import Link from './Link'

const channelId = 'UC3LudrYT-drTMkFe8mQx9VA'
const channelUrl = 'https://www.youtube.com/c/chienphantv'
const tag = (xml: string, name: string) =>
  xml
    .match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`))?.[1]
    ?.replace(/<!\\[CDATA\\[|\\]\\]>/g, '')
    .trim() || ''

const decodeXml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

type Video = { id: string; title: string; published: string }

async function videosFromApi(): Promise<Video[]> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return []
  const uploadsPlaylist = 'UU' + channelId.slice(2)
  const videos: Video[] = []
  let pageToken = ''
  do {
    const query = new URLSearchParams({
      part: 'snippet',
      playlistId: uploadsPlaylist,
      maxResults: '50',
      key,
      ...(pageToken ? { pageToken } : {}),
    })
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${query}`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) return []
    const data = await response.json()
    data.items.forEach((item) => {
      if (item.snippet?.resourceId?.videoId) {
        videos.push({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          published: item.snippet.publishedAt.slice(0, 10),
        })
      }
    })
    pageToken = data.nextPageToken || ''
  } while (pageToken)
  return videos
}

export default async function VideoSection() {
  let entries = await videosFromApi()
  if (!entries.length) {
    const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 },
    })
      .then((r) => r.text())
      .catch(() => '')
    entries = xml
      .split('<entry>')
      .slice(1)
      .map((entry) => ({
        id: tag(entry, 'yt:videoId'),
        title: decodeXml(tag(entry, 'title')),
        published: tag(entry, 'published').slice(0, 10),
      }))
      .filter((video) => video.id)
  }
  if (!entries.length) return null
  return (
    <section className="bg-stone-950 px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="cp-kicker text-primary-400">CHIẾN PHAN TV</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Video mới nhất</h2>
          </div>
          <Link href={channelUrl} className="cp-link text-primary-400">
            Xem kênh YouTube →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((video) => (
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
      </div>
    </section>
  )
}
