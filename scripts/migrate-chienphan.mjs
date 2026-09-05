import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const site = 'https://chienphan.com'
const root = process.cwd()
const blogDir = path.join(root, 'data/blog')
const imageDir = path.join(root, 'public/static/chienphan')

const decode = (value = '') => value
  .replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#8220;/g, '“')
  .replace(/&#8221;/g, '”').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'")

function toText(html) {
  const withoutToc = html.replace(
    /<div id="ez-toc-container"[\s\S]*?<\/nav>\s*<\/div>/gi,
    ''
  )

  return decode(withoutToc)
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<h4[^>]*>/gi, '\n\n#### ')
    .replace(/<\/h[2-4]>/gi, '\n\n')
    .replace(/<figure[^>]*>/gi, '\n\n')
    .replace(/<\/figure>/gi, '\n\n')
    .replace(/<figcaption[^>]*>/gi, '\n_')
    .replace(/<\/figcaption>/gi, '_\n')
    .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
    .replace(/<\/(p|h[1-6]|blockquote|ul|ol|div)>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n- ').replace(/<\/li>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

async function download(url, file) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not download ${url}`)
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
}

await rm(blogDir, { recursive: true, force: true })
await mkdir(blogDir, { recursive: true })
await mkdir(imageDir, { recursive: true })

const postsResponse = await fetch(`${site}/wp-json/wp/v2/posts?per_page=100&_embed`)
const posts = await postsResponse.json()
const categories = await (await fetch(`${site}/wp-json/wp/v2/categories?per_page=100`)).json()
const categoryById = new Map(categories.map((category) => [category.id, category.name]))

await Promise.all([
  download(`${site}/wp-content/uploads/2021/11/chien-phan-blog.jpg`, path.join(imageDir, 'hero.jpg')),
  download(`${site}/wp-content/uploads/2026/07/Header_Logo_Chienphan-1.png`, path.join(imageDir, 'logo.png')),
])

for (const post of posts) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  let localImage
  if (image) {
    const ext = path.extname(new URL(image).pathname) || '.jpg'
    localImage = `/static/chienphan/${post.slug}${ext}`
    await download(image, path.join(root, 'public', localImage))
  }
  const title = decode(post.title.rendered)
  const summary = toText(post.excerpt.rendered).replace(/\\s*…$/, '')
  const tags = post.categories.map((id) => categoryById.get(id)).filter(Boolean)
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${post.date.slice(0, 10)}`,
    `lastmod: ${post.modified.slice(0, 10)}`,
    `tags: ${JSON.stringify(tags)}`,
    `summary: ${JSON.stringify(summary)}`,
    `images: ${JSON.stringify(localImage ? [localImage] : [])}`,
    'layout: PostSimple',
    '---',
  ].join('\n')
  const body = [
    localImage ? `![${title}](${localImage})` : '',
    toText(post.content.rendered),
    `\n\n_Nguồn bài viết gốc: [Chiến Phan](${post.link})_`,
  ].filter(Boolean).join('\n\n')
  await writeFile(path.join(blogDir, `${post.slug}.mdx`), `${frontmatter}\n\n${body}\n`)
}

console.log(`Migrated ${posts.length} Chiến Phan posts.`)
