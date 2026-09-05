import { readFile, rm, writeFile } from 'fs/promises'
import path from 'path'

const root = process.cwd()
const fileFor = (slug: string) => path.join(root, 'data', 'blog', `${slug}.mdx`)
const github = () => Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)
const safeSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
const needsGithub = () => process.env.VERCEL && !github()

function assertPublisherConfigured() {
  if (needsGithub()) {
    throw new Error(
      'Admin publishing is not configured. Add GITHUB_TOKEN and GITHUB_REPO to Vercel environment variables, then redeploy.'
    )
  }
}

function encode(content: string) {
  return Buffer.from(content).toString('base64')
}
function decode(content: string) {
  return Buffer.from(content, 'base64').toString('utf8')
}

async function githubRequest(pathname: string, options: RequestInit = {}) {
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${pathname}`,
    {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.headers || {}),
      },
    }
  )
  if (!response.ok) throw new Error(`GitHub content update failed: ${response.status}`)
  return response.json()
}

export async function getPostSource(slug: string) {
  if (!safeSlug(slug)) throw new Error('Invalid article slug')
  assertPublisherConfigured()
  const filename = `data/blog/${slug}.mdx`
  if (github()) return decode((await githubRequest(filename)).content)
  return readFile(fileFor(slug), 'utf8')
}

export async function savePost(slug: string, content: string, previousSlug?: string) {
  if (!safeSlug(slug) || (previousSlug && !safeSlug(previousSlug)))
    throw new Error('Invalid article slug')
  assertPublisherConfigured()
  const filename = `data/blog/${slug}.mdx`
  if (github()) {
    let sha: string | undefined
    try {
      sha = (await githubRequest(filename)).sha
    } catch {}
    await githubRequest(filename, {
      method: 'PUT',
      body: JSON.stringify({
        message: `${sha ? 'Update' : 'Add'} article: ${slug}`,
        content: encode(content),
        sha,
      }),
    })
    if (previousSlug && previousSlug !== slug) await removePost(previousSlug)
    return
  }
  await writeFile(fileFor(slug), content)
  if (previousSlug && previousSlug !== slug) await rm(fileFor(previousSlug))
}

export async function removePost(slug: string) {
  if (!safeSlug(slug)) throw new Error('Invalid article slug')
  assertPublisherConfigured()
  const filename = `data/blog/${slug}.mdx`
  if (github()) {
    const existing = await githubRequest(filename)
    await githubRequest(filename, {
      method: 'DELETE',
      body: JSON.stringify({ message: `Remove article: ${slug}`, sha: existing.sha }),
    })
    return
  }
  await rm(fileFor(slug))
}
