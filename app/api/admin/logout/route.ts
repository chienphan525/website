import { NextResponse } from 'next/server'
import { adminCookie } from '@/lib/admin'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(adminCookie, '', { path: '/', maxAge: 0 })
  return response
}
