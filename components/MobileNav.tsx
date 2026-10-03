'use client'

import { useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      document.body.style.overflow = status ? 'auto' : 'hidden'
      return !status
    })
  }

  return (
    <>
      {/* Nút menu */}
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="relative z-[60] sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-[#FFD700]"
          style={{ marginBottom: '-6px' }}
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Vùng menu */}
      <div
        className={`fixed inset-0 z-50 sm:hidden ${
          navShow ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Nền tối hình quạt */}
        <div
          className={`absolute right-0 top-0 h-[50vh] w-full origin-[calc(100%-36px)_24px] overflow-hidden transition-all duration-500 ${
            navShow ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundColor: '#00000088',
            clipPath: navShow
              ? 'polygon(100% 0, 100% 100%, 0 100%, 12% 70%, 28% 45%, 52% 25%, 76% 10%)'
              : 'polygon(100% 0, 100% 8%, 96% 6%, 98% 3%)',
            transition:
              'clip-path 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease-out',
          }}
        />

        {/* Nút X */}
        <button
          className={`absolute right-5 top-1 z-10 h-8 w-8 transition-opacity duration-300 ${
            navShow ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close Menu"
          onClick={onToggleNav}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-8 w-8 text-white"
            style={{ marginBottom: '-6px' }}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Các nan quạt */}
        <nav className="absolute right-6 top-12 h-[calc(50vh-48px)] w-[90%]">
          {headerNavLinks.map((link, index) => {
            const total = headerNavLinks.length
            const progress = total <= 1 ? 0 : index / (total - 1)

            // Góc xòe từ gần ngang sang gần dọc
            const angle = progress * 82

            // Bán kính mỗi nan
            const radius = 42 + progress * 8

            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius

            return (
              <div
                key={link.title}
                className="absolute right-0 top-0"
                style={{
                  transform: navShow
                    ? `translate(${-x}px, ${y}px)`
                    : 'translate(0, 0)',
                  transition:
                    'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${index * 20}ms`,
                }}
              >
                <Link
                  href={link.href}
                  onClick={onToggleNav}
                  className="block whitespace-nowrap py-2 text-right text-sm font-light uppercase tracking-[0.18em] text-white"
                >
                  {link.title}
                </Link>
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default MobileNav
