'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState('')
  async function login(formData: FormData) {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    if (!response.ok) return setError((await response.json()).error)
    window.location.href = '/admin'
  }
  return (
    <main className="mx-auto max-w-md px-5 py-24">
      <h1 className="font-serif text-4xl">Quản trị Chiến Phan</h1>
      <p className="mt-3 text-stone-600">Đăng nhập để quản lý bài viết.</p>
      <form action={login} className="mt-8 space-y-4 rounded border border-stone-200 bg-white p-6">
        <input
          name="username"
          required
          placeholder="Tài khoản"
          className="w-full rounded border-stone-300"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Mật khẩu"
          className="w-full rounded border-stone-300"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="rounded bg-amber-500 px-5 py-2 font-bold text-stone-950">
          Đăng nhập
        </button>
      </form>
    </main>
  )
}
