import Link from './Link'

export default function Footer() {
  return (
    <footer className="bg-stone-950 px-5 py-14 text-stone-300 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
        <div>
          <p className="font-serif text-3xl text-primary-400">Chạm là Tan</p>
          <p className="mt-2 text-sm">Chạm nhẹ từng khoảnh khắc, mọi áp lực sẽ Tan.</p>
        </div>
        <div className="flex gap-6 text-sm font-semibold">
          <Link href="https://www.youtube.com/c/chienphantv">YouTube</Link>
          <Link href="/about">Về Chiến</Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Chiến Phan · Nội dung được chuyển đổi từ chienphan.com
      </p>
    </footer>
  )
}
