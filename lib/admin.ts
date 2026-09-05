import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const cookieName = 'chienphan_admin'
const username = () => process.env.ADMIN_USERNAME || 'admin'
const password = () => process.env.ADMIN_PASSWORD || 'admin'
const secret = () => process.env.ADMIN_SESSION_SECRET || 'change-this-before-production'

export function validCredentials(user: string, pass: string) {
  return user === username() && pass === password()
}

function signature(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

export function createSession() {
  const value = `${username()}:${Date.now()}`
  return `${value}.${signature(value)}`
}

export async function isAdmin() {
  const session = (await cookies()).get(cookieName)?.value
  if (!session) return false
  const index = session.lastIndexOf('.')
  if (index < 1) return false
  const value = session.slice(0, index)
  const expected = signature(value)
  const provided = session.slice(index + 1)
  return (
    provided.length === expected.length &&
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  )
}

export const adminCookie = cookieName
