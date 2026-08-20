// scripts/prerender.mjs
// Запускается ПОСЛЕ `vite build` (dist/ уже собран) и ПОСЛЕ fetch-feeds.mjs
// (public/products.json уже свежий). Берёт готовый dist/index.html как
// шаблон и штампует по копии на каждый товар — /product/{id}/index.html —
// с подменёнными title/description/og:*/canonical под конкретный товар.
//
// Зачем так, а не через SSR-фреймворк: боты соцсетей (Telegram, VK, WhatsApp)
// и большинство поисковых ботов читают <head> статического HTML без
// выполнения JS. Раз у нас один index.html на все роуты, любая ссылка на
// товар в шаринге показывала бы общий заголовок ByteBuy вместо конкретного
// товара. Этот скрипт решает именно это — дёшево, без переписывания
// компонентов под серверный рендеринг.

import fs from 'node:fs'
import path from 'node:path'
import { SHOPS, getShopBySlug } from '../src/config/shops.js'

const SITE_URL = 'https://bytebuy.store'
const DIST_DIR = path.resolve('dist')
const PRODUCTS_JSON = path.resolve('public/products.json')

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function truncate(str, maxLen) {
  const s = String(str || '').trim()
  if (s.length <= maxLen) return s
  return s.slice(0, maxLen - 1).trimEnd() + '…'
}

function buildProductHtml(template, product, shopName) {
  const title = truncate(product.title, 60)
  const fullTitle = `${title} — купить в ${shopName} | ByteBuy`
  const rawDescription = product.description || `${product.title} — сравнивайте цены и находите лучшие предложения на ByteBuy.`
  const description = truncate(rawDescription, 155)
  const image = product.image || `${SITE_URL}/og-image.png`
  const url = `${SITE_URL}/product/${product.id}/`

  let html = template

  // <title>
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(fullTitle)}</title>`
  )

  // meta description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  )

  // canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  )

  // og:title / og:description / og:image / og:url
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  )
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/>/,
    `<meta property="og:image" content="${escapeHtml(image)}" />`
  )
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/>/,
    `<meta property="og:url" content="${url}" />`
  )

  // twitter:title / twitter:description / twitter:image
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`
  )

  return html
}

function buildSitemap(products) {
  const staticUrls = ['', 'catalog']
  const urls = [
    ...staticUrls.map((p) => `${SITE_URL}/${p}`),
    ...products.map((p) => `${SITE_URL}/product/${p.id}/`),
  ]

  const body = urls
    .map((u) => `  <url><loc>${escapeHtml(u)}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ не найден — сначала запустите `npm run build`')
    process.exit(1)
  }
  if (!fs.existsSync(PRODUCTS_JSON)) {
    console.error('❌ public/products.json не найден — сначала запустите fetch-feeds.mjs')
    process.exit(1)
  }

  const template = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8')
  const { products } = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'))

  console.log(`📄 Пререндер: ${products.length} товаров...`)

  let count = 0
  for (const product of products) {
    const shopName = getShopBySlug(product.source)?.name || 'ByteBuy'
    const html = buildProductHtml(template, product, shopName)

    const productDir = path.join(DIST_DIR, 'product', String(product.id))
    fs.mkdirSync(productDir, { recursive: true })
    fs.writeFileSync(path.join(productDir, 'index.html'), html)
    count++
  }

  console.log(`✅ Сгенерировано ${count} страниц товаров`)

  // Бонусом — sitemap.xml, раз уже прошлись по всем товарам
  const sitemap = buildSitemap(products)
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap)
  console.log(`✅ sitemap.xml сгенерирован (${products.length + 2} URL)`)
}

main()
