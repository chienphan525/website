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
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="relative z-[60] sm:hidden"
      >
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

      {/* =========================
          CÁNH QUẠT MENU
          ========================= */}
      <div
        className={`fixed left-0 top-0 z-50 w-full ${
          navShow
            ? 'opacity-100 rotate-0'
            : 'pointer-events-none opacity-0 -rotate-90'
        }`}
        style={{
          height: '50vh',
          backgroundColor: '#00000088',
          borderBottomLeftRadius: '100% 75%',

          // Tâm quay chính là vị trí nút menu
          transformOrigin: 'calc(100% - 36px) 24px',

          // Nhanh lúc đầu → chậm dần → dừng
          transition:
            'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease-out',
        }}
      >
        {/* =========================
            NỘI DUNG MENU
            Không quay theo cánh quạt
            ========================= */}
        <div
          className={`absolute inset-0 ${
            navShow
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{
            transition: 'opacity 250ms ease-out',
          }}
        >
          {/* Nút X */}
          <button
            className="absolute right-5 h-8 w-8"
            style={{ top: '4px' }}
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

          {/* Các mục menu */}
          <nav className="mt-16 w-full pr-6">
            {headerNavLinks.map((link) => (
              <div
                key={link.title}
                className="py-2 text-right"
              >
                <Link
                  href={link.href}
                  className="text-sm font-light uppercase tracking-[0.18em] text-white"
                  onClick={onToggleNav}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default MobileNav
