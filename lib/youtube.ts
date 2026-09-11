export type YouTubeVideo = {
  id: string
  title: string
  published: string
}

export type VideoPage = {
  videos: YouTubeVideo[]
  nextPageToken?: string
  completeArchive: boolean
}

export const channelUrl = 'https://www.youtube.com/c/chienphantv'
const channelId = 'UC3LudrYT-drTMkFe8mQx9VA'
const uploadsPlaylist = 'UU' + channelId.slice(2)

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

export async function getVideoPage({
  pageToken,
  limit = 12,
}: {
  pageToken?: string
  limit?: number
} = {}): Promise<VideoPage> {
  const key = process.env.YOUTUBE_API_KEY
  const count = Math.min(Math.max(limit, 1), 50)

  if (key) {
    const query = new URLSearchParams({
      part: 'snippet',
      playlistId: uploadsPlaylist,
      maxResults: String(count),
      key,
      ...(pageToken ? { pageToken } : {}),
    })
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${query}`, {
      next: { revalidate: 3600 },
    })
    if (response.ok) {
      const data = await response.json()
      return {
        videos: data.items.flatMap((item) =>
          item.snippet?.resourceId?.videoId
            ? [
                {
                  id: item.snippet.resourceId.videoId,
                  title: item.snippet.title,
                  published: item.snippet.publishedAt.slice(0, 10),
                },
              ]
            : []
        ),
        nextPageToken: data.nextPageToken,
        completeArchive: true,
      }
    }
  }

  const xml = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    next: { revalidate: 3600 },
  })
    .then((response) => (response.ok ? response.text() : ''))
    .catch(() => '')
  const allVideos = xml
    .split('<entry>')
    .slice(1)
    .map((entry) => ({
      id: tag(entry, 'yt:videoId'),
      title: decodeXml(tag(entry, 'title')),
      published: tag(entry, 'published').slice(0, 10),
    }))
    .filter((video) => video.id)
  const offset = pageToken?.startsWith('rss-') ? Number(pageToken.slice(4)) || 0 : 0
  const nextOffset = offset + count
  return {
    videos: allVideos.slice(offset, nextOffset),
    nextPageToken: nextOffset < allVideos.length ? `rss-${nextOffset}` : undefined,
    completeArchive: false,
  }
}
