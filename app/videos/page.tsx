import VideoGallery from '@/components/VideoGallery'
import { getVideoPage } from '@/lib/youtube'

export const revalidate = 3600
export const metadata = { title: 'Video | Chiến Phan' }

export default async function VideosPage() {
  const page = await getVideoPage({ limit: 12 })
  return (
    <>
      <header className="border-b border-stone-200 bg-[#f1ece2]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
          <p className="cp-kicker text-primary-500">CHIẾN PHAN TV</p>
          <h1 className="mt-3 font-serif text-5xl text-stone-900 sm:text-6xl">Video</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-stone-600">
            Khám phá các video mới nhất từ kênh Chiến Phan TV.
          </p>
        </div>
      </header>
      <VideoGallery
        initialVideos={page.videos}
        initialNextPageToken={page.nextPageToken}
        completeArchive={page.completeArchive}
      />
    </>
  )
}
