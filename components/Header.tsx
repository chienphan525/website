import Link from './Link'
import MobileNav from './MobileNav'
import headerNavLinks from '@/data/headerNavLinks'

export default function Header() {
  return (
    <header className="cp-header fixed left-0 right-0 top-0 z-50 bg-black/40">
      <div className="flex items-center justify-between px-5 py-2 sm:px-3">
        <Link href="/" aria-label="Chiến Phan">
          <img src="/static/chienphan/logo.png" alt="Chiến Phan" className="h-8 w-auto sm:h-12" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-normal uppercase tracking-[0.08em] text-white md:flex">
          {headerNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary-300">
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
