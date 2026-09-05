import VideoSection from '@/components/VideoSection'

export const revalidate = 3600
export const metadata = { title: 'Video | Chiến Phan' }

export default function VideosPage() {
  return <VideoSection />
}
