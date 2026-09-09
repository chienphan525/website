import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const site = 'https://chienphan.com'
const root = process.cwd()
const blogDir = path.join(root, 'data/blog')
const imageDir = path.join(root, 'public/static/chienphan')
const cachedPostsPath = process.env.CHIENPHAN_SOURCE_CACHE || '/tmp/chienphan-posts.json'
const appStores = {
  mb: {
    android: 'https://play.google.com/store/apps/details?id=com.mbmobile',
    ios: 'https://apps.apple.com/vn/app/mb-bank/id1205807363',
    default: 'https://www.mbbank.com.vn/',
  },
  bidv: {
    android: 'https://play.google.com/store/apps/details?id=com.vnpay.bidv',
    ios: 'https://apps.apple.com/vn/app/bidv-smartbanking/id1061867449',
  },
  vnpay: {
    android: 'https://play.google.com/store/apps/details?id=vnpay.smartacccount',
    ios: 'https://apps.apple.com/vn/app/vnpay-app/id1470378562',
    default: 'https://vnpay.vn/',
  },
  techcombank: {
    android: 'https://play.google.com/store/apps/details?id=vn.com.techcombank.bb.app',
    ios: 'https://apps.apple.com/vn/app/techcombank-mobile/id1548623362',
  },
  vpbank: {
    android: 'https://play.google.com/store/apps/details?id=com.vnpay.vpbankonline',
    ios: 'https://apps.apple.com/vn/app/vpbank-neo/id1209349510',
  },
  viettelMoney: {
    android: 'https://play.google.com/store/apps/details?id=com.bplus.vtpay',
    ios: 'https://apps.apple.com/vn/app/viettel-money/id1344204781',
  },
  zalopay: {
    android: 'https://play.google.com/store/apps/details?id=vn.com.vng.zalopay',
    ios: 'https://apps.apple.com/vn/app/zalopay-thanh-to%C3%A1n-t%C3%A0i-ch%C3%ADnh/id1112407590',
  },
}

const appWithDefault = (app, platform) => ({ ...app, default: app[platform] })

const legacyDestinations = {
  'mb-android': appWithDefault(appStores.mb, 'android'),
  'mb-ios': appWithDefault(appStores.mb, 'ios'),
  'mb-gioi-thieu': appStores.mb.default,
  'mb-link-gioi-thieu': appStores.mb.default,
  'mo-tai-khoan-mb-online': '/blog/tao-tai-khoan-mb-bank-online',
  'bidv-android': appWithDefault(appStores.bidv, 'android'),
  'bidv-ios': appWithDefault(appStores.bidv, 'ios'),
  'vnpay': appStores.vnpay,
  'tcb-android': appWithDefault(appStores.techcombank, 'android'),
  'tck-ios': appWithDefault(appStores.techcombank, 'ios'),
  'vpbank-ios-psgd': appWithDefault(appStores.vpbank, 'ios'),
  'vtmoney-android': appWithDefault(appStores.viettelMoney, 'android'),
  'vtmoney-ios': appWithDefault(appStores.viettelMoney, 'ios'),
  'zalopay-android': appWithDefault(appStores.zalopay, 'android'),
  'zalopay-ios': appWithDefault(appStores.zalopay, 'ios'),
}

const shortenedDestinations = {
  'q4nFpvvr': appStores.vpbank.android,
  mU732xtU: appStores.mb.android,
  '8p5YW9gp': appStores.mb.android,
  YebFW1sp: appStores.mb.android,
  TfS4FdXr: appStores.mb.android,
  vkCeTtDU: appStores.mb.ios,
  gJcfRA4m: 'https://www.lazada.vn/',
  TYcXrrJ5: 'https://shopee.vn/',
  xhMkGsZY: 'https://tiki.vn/',
}

const decode = (value = '') => value
  .replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#8220;/g, '“')
  .replace(/&#8221;/g, '”').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'")

function inlineText(html) {
  return decode(html)
    .replace(/<br\s*\/?>(\r?\n)?/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function appDestination(destination, label) {
  if (typeof destination === 'string') return destination
  const labelText = inlineText(label).toLowerCase()
  const mentionsApple = /(?:ios|iphone|ipad|app\s*store)/i.test(labelText)
  const mentionsAndroid = /(?:android|google\s*play|ch\s*play)/i.test(labelText)
  if (mentionsApple && !mentionsAndroid) return destination.ios || destination.default
  if (mentionsAndroid && !mentionsApple) return destination.android || destination.default
  return destination.default || destination.android || destination.ios
}

function normalizeHref(href, postSlugs, label = '') {
  const decodedHref = decode(href)
  try {
    const url = new URL(decodedHref)
    if (url.hostname === 'chienphan.com' || url.hostname === 'www.chienphan.com') {
      const slug = url.pathname.replace(/^\/+|\/+$/g, '')
      if (postSlugs.has(slug)) return `/blog/${slug}${url.hash}`
      if (legacyDestinations[slug]) return appDestination(legacyDestinations[slug], label) + url.hash
      if (!slug) return '/'
      return ''
    }
    if (url.hostname === 'shorten.asia' && shortenedDestinations[url.pathname.slice(1)])
      return shortenedDestinations[url.pathname.slice(1)] + url.hash
    return /^https?:$/.test(url.protocol) ? decodedHref : ''
  } catch {
    if (decodedHref.startsWith('/') || decodedHref.startsWith('#') || decodedHref.startsWith('mailto:'))
      return decodedHref
  }
  return ''
}

function imageFromHtml(html) {
  const source = html.match(/<img\b[^>]*?src=(["'])(.*?)\1[^>]*>/i)?.[2]
  const alt = html.match(/<img\b[^>]*?alt=(["'])(.*?)\1[^>]*>/i)?.[2] || 'Hình minh họa'
  const decodedSource = source ? decode(source) : ''
  if (!decodedSource || /\/(?:px|pixel)\.(?:gif|png)(?:\?|$)/i.test(decodedSource)) return undefined
  return { source: decodedSource, alt: inlineText(alt) }
}

function videoHref(source) {
  try {
    const url = new URL(source)
    const match = url.hostname.includes('youtube.com') && url.pathname.match(/^\/embed\/([^/?]+)/)
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : source
  } catch {
    return source
  }
}

function toText(html, postSlugs = new Set(), preserveLinks = true) {
  const withoutToc = html.replace(
    /<div id="ez-toc-container"[\s\S]*?<\/nav>\s*<\/div>/gi,
    ''
  )

  const withLinks = withoutToc
    .replace(/<iframe\b[^>]*?src=(["'])(.*?)\1[^>]*>[\s\S]*?<\/iframe>/gi, (_, __, source) => {
      const href = normalizeHref(videoHref(source), postSlugs)
      return href ? `\n\n[Xem video hướng dẫn](${href})\n\n` : ''
    })
    .replace(
      /<a\b[^>]*?href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
      (_, __, href, label) => {
        const destination = normalizeHref(href, postSlugs, label)
        if (!destination) return inlineText(label)
        const text = inlineText(label)
        if (text) return `[${text}](${destination})`
        const image = imageFromHtml(label)
        if (!image) return ''
        return image.source.includes('chienphan.com/')
          ? `[${image.alt}](${destination})`
          : `[![${image.alt}](${image.source})](${destination})`
      }
    )

  const converted = decode(withLinks)
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

  return preserveLinks
    ? converted
    : converted.replace(/\[([^\]]+)]\([^\s)]+\)/g, '$1')
}

async function download(url, file) {
  const response = await fetch(url)
  if (!response.ok) {
    try {
      await access(file)
      console.warn(`Keeping existing asset after download failed: ${url}`)
      return
    } catch {
      throw new Error(`Could not download ${url}`)
    }
  }
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
}

await rm(blogDir, { recursive: true, force: true })
await mkdir(blogDir, { recursive: true })
await mkdir(imageDir, { recursive: true })

let posts
try {
  const postsResponse = await fetch(`${site}/wp-json/wp/v2/posts?per_page=100&_embed`)
  if (!postsResponse.ok) throw new Error(`WordPress API returned ${postsResponse.status}`)
  posts = await postsResponse.json()
} catch (error) {
  posts = JSON.parse(await readFile(cachedPostsPath, 'utf8'))
  console.warn(`Using saved WordPress export at ${cachedPostsPath}: ${error.message}`)
}
let categories
try {
  const categoriesResponse = await fetch(`${site}/wp-json/wp/v2/categories?per_page=100`)
  if (!categoriesResponse.ok) throw new Error(`WordPress API returned ${categoriesResponse.status}`)
  categories = await categoriesResponse.json()
} catch (error) {
  categories = [
    { id: 1, name: 'Blog' },
    { id: 32, name: 'Ngẫm' },
    { id: 40, name: 'Nhật ký' },
  ]
  console.warn(`Using saved category names: ${error.message}`)
}
const categoryById = new Map(categories.map((category) => [category.id, category.name]))
const postSlugs = new Set(posts.map((post) => post.slug))

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
  const summary = toText(post.excerpt.rendered, postSlugs, false).replace(/\\s*…$/, '')
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
    toText(post.content.rendered, postSlugs),
    '_Nội dung được chuyển đổi từ website Chiến Phan cũ._',
  ].filter(Boolean).join('\n\n')
  await writeFile(path.join(blogDir, `${post.slug}.mdx`), `${frontmatter}\n\n${body}\n`)
}

console.log(`Migrated ${posts.length} Chiến Phan posts.`)
