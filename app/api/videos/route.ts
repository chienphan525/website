import { NextRequest, NextResponse } from 'next/server'
import { getVideoPage } from '@/lib/youtube'

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 12
  const pageToken = request.nextUrl.searchParams.get('pageToken') || undefined
  return NextResponse.json(await getVideoPage({ pageToken, limit }))
}
