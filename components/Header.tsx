import Link from './Link'
import MobileNav from './MobileNav'

export default function Header() {
  return (
    <header className="relative z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Chiến Phan">
          <img src="/static/chienphan/logo.png" alt="Chiến Phan" className="h-10 w-auto sm:h-12" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.12em] text-stone-700 md:flex">
          <Link href="/" className="transition hover:text-primary-500">
            Trang chủ
          </Link>
          <Link href="/blog" className="transition hover:text-primary-500">
            Bài viết
          </Link>
          <Link href="/videos" className="transition hover:text-primary-500">
            Video
          </Link>
          <Link href="/about" className="transition hover:text-primary-500">
            Về Chiến
          </Link>
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
