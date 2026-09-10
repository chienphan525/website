import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export type AffiliateLink = {
  name: string
  slug: string
  url: string
  platform: string
  createdAt: string
  updatedAt: string
}

const filePath = path.join(process.cwd(), 'data', 'affiliate-links.json')

function githubConfig() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO

  if (!token || !repo) return null

  return { token, repo }
}

async function githubRequest(
  pathname: string,
  options: RequestInit = {}
) {
  const config = githubConfig()

  if (!config) throw new Error('GitHub configuration is missing')

  return fetch(`https://api.github.com${pathname}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })
}

export async function getAffiliateLinks(): Promise<AffiliateLink[]> {
  const config = githubConfig()

  if (!config) {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw)
  }

  const response = await githubRequest(
    `/repos/${config.repo}/contents/data/affiliate-links.json`
  )

  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`)
  }

  const data = await response.json()

  const content = Buffer.from(data.content, 'base64').toString('utf8')

  return JSON.parse(content)
}

export async function saveAffiliateLinks(
  links: AffiliateLink[]
): Promise<void> {
  const config = githubConfig()

  const content = JSON.stringify(links, null, 2)

  if (!config) {
    await writeFile(filePath, content, 'utf8')
    return
  }

  const existing = await githubRequest(
    `/repos/${config.repo}/contents/data/affiliate-links.json`
  )

  if (!existing.ok) {
    throw new Error(`GitHub read failed: ${existing.status}`)
  }

  const existingData = await existing.json()

  const response = await githubRequest(
    `/repos/${config.repo}/contents/data/affiliate-links.json`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Update affiliate links',
        content: Buffer.from(content).toString('base64'),
        sha: existingData.sha,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${response.status}`)
  }
}

export async function getAffiliateLink(
  slug: string
): Promise<AffiliateLink | null> {
  const links = await getAffiliateLinks()

  return links.find((link) => link.slug === slug) || null
}

export function makeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
