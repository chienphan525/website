'use client'

import { useEffect, useState } from 'react'

type AffiliateLink = {
  name: string
  slug: string
  url: string
  platform: string
  createdAt: string
  updatedAt: string
}

export default function AffiliateLinkManager() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('Shopee')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function loadLinks() {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/links')

      if (!response.ok) {
        throw new Error('Không thể tải danh sách link')
      }

      const data = await response.json()
      setLinks(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLinks()
  }, [])

  async function createLink(event: React.FormEvent) {
    event.preventDefault()

    if (!name.trim() || !url.trim()) {
      setMessage('Vui lòng nhập tên sản phẩm và link')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          url,
          platform,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Không thể tạo link')
      }

      setLinks((current) => [data, ...current])
      setName('')
      setUrl('')
      setMessage('Đã tạo link affiliate')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  async function copyLink(slug: string) {
    const shortUrl = `https://chienphan.com/${slug}`

    await navigator.clipboard.writeText(shortUrl)

    setMessage(`Đã sao chép: ${shortUrl}`)
  }

  const filteredLinks = links.filter((link) => {
    const keyword = search.toLowerCase().trim()

    if (!keyword) return true

    return (
      link.name.toLowerCase().includes(keyword) ||
      link.slug.toLowerCase().includes(keyword) ||
      link.platform.toLowerCase().includes(keyword)
    )
  })

  return (
    <div className="mt-8 space-y-8">
      <form
        onSubmit={createLink}
        className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-stone-900">Tạo link affiliate</h2>

        <div className="mt-5 grid gap-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tên sản phẩm"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
          />

          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Link affiliate gốc"
            type="url"
            className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
          />

          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-500"
          >
            <option>Shopee</option>
            <option>TikTok Shop</option>
            <option>Lazada</option>
            <option>Tiki</option>
            <option>Khác</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-amber-500 px-5 py-3 font-bold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            {saving ? 'Đang tạo...' : '+ Tạo link'}
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-stone-600">{message}</p>}
      </form>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-stone-900">Danh sách link</h2>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 outline-none focus:border-amber-500 sm:w-72"
          />
        </div>

        {loading ? (
          <p className="mt-5 text-stone-500">Đang tải...</p>
        ) : filteredLinks.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-stone-300 p-8 text-center text-stone-500">
            Chưa có link affiliate.
          </div>
        ) : (
          <div className="mt-5 divide-y overflow-hidden rounded-xl border border-stone-200 bg-white">
            {filteredLinks.map((link) => (
              <div key={link.slug} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900">{link.name}</p>

                    <p className="mt-1 text-sm text-stone-500">
                      {link.platform} · /{link.slug}
                    </p>

                    <p className="mt-1 truncate text-xs text-stone-400">{link.url}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyLink(link.slug)}
                    className="shrink-0 rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
                  >
                    Sao chép link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
