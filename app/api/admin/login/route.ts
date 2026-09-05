import { NextResponse } from 'next/server'
import { adminCookie, createSession, validCredentials } from '@/lib/admin'

export async function POST(request: Request) {
  const { username, password } = await request.json()
  if (!validCredentials(username, password))
    return NextResponse.json({ error: 'Sai tài khoản hoặc mật khẩu.' }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminCookie, createSession(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return response
}
