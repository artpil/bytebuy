// scripts/fetch-feeds.mjs
// Atom-фиды (небольшие, Alibaba) парсим через fast-xml-parser (в память целиком).
// YML-фиды (могут быть очень большими, AliExpress — сотни тысяч offer) парсим
// потоково через sax, чтобы не держать весь XML-дерево в памяти одновременно.

import { XMLParser } from 'fast-xml-parser'
import sax from 'sax'
import { Readable } from 'node:stream'
import fs from 'node:fs'
import path from 'node:path'
import { SHOPS, buildAffiliateLink } from '../src/config/shops.js'

const atomParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

const FETCH_TIMEOUT_MS = 15 * 60 * 1000 // 15 минут — фид AliExpress может быть 300+ МБ на скорости ~1 МБ/с

function buildFeedUrl({ user, code, feedId }) {
  const params = new URLSearchParams({
    user, code, format: 'xml', currency: '', only_sale: 'true', feed_id: feedId,
  })
  return `https://export.admitad.com/en/webmaster/websites/2965579/products/export_adv_products/?${params}`
}

function toArray(x) {
  return Array.isArray(x) ? x : x != null ? [x] : []
}

// ===== Atom / Google Merchant формат (небольшие фиды, строим дерево целиком) =====
function parseAtomFeed(xmlText, slug) {
  const data = atomParser.parse(xmlText)
  const entries = toArray(data.feed?.entry)
  const products = []

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]
    const id = e['g:id'] ?? `${slug}-${i}`
    const title = e['g:title'] ?? `Товар ${i + 1}`
    const description = e['g:description'] ?? ''
    const affiliateLink = e['g:link']
    const image = e['g:image_link'] ?? null
    const availability = e['g:availability']
    const priceRaw = String(e['g:price'] ?? '')
    const [priceStr, currency] = priceRaw.split(' ')
    const category = e['g:product_type'] ?? ''

    if (!affiliateLink || availability !== 'in stock') continue

    products.push({
      id: `${slug}-${id}`, title, description,
      price: parseFloat(priceStr) || 0, currency: currency || 'USD',
      image, category, affiliateLink, source: slug,
    })
  }

  return products
}

// ===== YML-формат — ПОТОКОВЫЙ парсер (для больших каталогов) =====
// limit — сколько товаров максимум оставляем в итоге. Вместо "первых
// встреченных" используем reservoir sampling (алгоритм R): каждый оффер
// имеет равный шанс попасть в выборку независимо от позиции в фиде,
// а память при этом не растёт — держим не больше limit элементов разом.
function parseYmlStream(readableStream, slug, limit = 5000) {
  return new Promise((resolve, reject) => {
    const parser = sax.createStream(true, { trim: true })

    const reservoir = []
    let seenCount = 0 // счётчик ТОЛЬКО среди офферов, прошедших фильтр (есть affiliateLink)

    const categories = {}

    let currentTag = null
    let inCategories = false
    let currentCategoryId = null
    let currentOffer = null
    let offerCount = 0
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      readableStream.destroy()
      resolve(reservoir)
    }

    parser.on('opentag', (node) => {
      currentTag = node.name

      if (node.name === 'categories') inCategories = true
      if (inCategories && node.name === 'category') {
        currentCategoryId = node.attributes.id
        categories[currentCategoryId] = ''
      }

      if (node.name === 'offer') {
        currentOffer = {
          id: node.attributes.id,
          picture: null,
        }
      }
    })

    parser.on('text', (text) => {
      if (inCategories && currentTag === 'category' && currentCategoryId) {
        categories[currentCategoryId] += text
        return
      }
      if (!currentOffer || !currentTag) return

      switch (currentTag) {
        case 'name': currentOffer.title = (currentOffer.title || '') + text; break
        case 'price': currentOffer.price = text; break
        case 'oldprice': currentOffer.oldPrice = text; break
        case 'currencyId': currentOffer.currency = text; break
        case 'picture': if (!currentOffer.picture) currentOffer.picture = text; break
        case 'url': currentOffer.affiliateLink = text; break
        case 'categoryId': currentOffer.categoryId = text; break
        case 'vendor': currentOffer.vendor = text; break
        case 'description':
          if ((currentOffer.description || '').length < 300) {
            currentOffer.description = (currentOffer.description || '') + text
          }
          break
      }
    })

    parser.on('closetag', (name) => {
      if (settled) return

      if (name === 'categories') inCategories = false

      if (name === 'offer' && currentOffer) {
        offerCount++

        // Единственный надёжный признак настоящего товара — партнёрская
        // ссылка. available у некоторых магазинов (GeekBuying) оказался
        // бесполезным полем, поэтому по нему больше не фильтруем.
        if (currentOffer.affiliateLink) {
          // Сначала решаем, попадёт ли оффер в выборку — и ТОЛЬКО если
          // попадёт, строим полный объект товара. При лимите 100 из 1.4 млн
          // офферов это экономит построение объекта в ~99.99% случаев,
          // когда результат всё равно был бы тут же отброшен.
          let targetIndex = -1
          if (seenCount < limit) {
            targetIndex = seenCount
          } else {
            const j = Math.floor(Math.random() * (seenCount + 1))
            if (j < limit) targetIndex = j
          }

          if (targetIndex !== -1) {
            // AliExpress отдаёт в <url> ссылку, обёрнутую ЕЩЁ и через
            // собственный шортлинк AliExpress (s.click.aliexpress.com/
            // deep_link.htm?aff_short_key=...&dl_target_url=...). На практике
            // этот aff_short_key оказался одинаковым для всех товаров и,
            // похоже, ведёт на главную вместо конкретного товара — сам
            // AliExpress игнорирует dl_target_url при переходе. Поэтому для
            // AliExpress строим ссылку сами: обёртка Admitad (rzekl.com) +
            // прямая ссылка на товар, без вложенного шортлинка AliExpress.
            const affiliateLink =
              slug.startsWith('aliexpress')
                ? buildAffiliateLink(slug, `https://aliexpress.com/item/${currentOffer.id}.html`)
                : currentOffer.affiliateLink

            reservoir[targetIndex] = {
              id: `${slug}-${currentOffer.id}`,
              title: currentOffer.title || `Товар ${offerCount}`,
              price: parseFloat(currentOffer.price) || 0,
              oldPrice: currentOffer.oldPrice ? parseFloat(currentOffer.oldPrice) : null,
              image: currentOffer.picture || null,
              description: (currentOffer.description || '').slice(0, 300),
              category: categories[currentOffer.categoryId] || currentOffer.categoryId || '',
              vendor: currentOffer.vendor || '',
              currency: currentOffer.currency || 'USD',
              affiliateLink,
              source: slug,
            }
          }

          seenCount++
        }

        currentOffer = null

        if (offerCount % 50000 === 0) {
          console.log(`   ...${slug}: просмотрено ${offerCount} офферов, в выборке ${reservoir.length}/${limit}`)
        }
      }

      currentTag = null
    })

    // Если поток оборвался (например, Admitad не докрыл XML на таком
    // объёме — "Unclosed root tag") — не выбрасываем всё насобранное.
    // Если в reservoir уже есть хоть что-то, используем это как частичный,
    // но валидный результат. Полной ошибкой считаем только случай, когда
    // вообще ничего не успели набрать.
    const handleStreamError = (err) => {
      if (settled) return
      if (reservoir.length > 0) {
        console.warn(`   ⚠️  ${slug}: поток оборвался (${err.message}), но в выборке уже есть ${reservoir.length}/${limit} — использую как есть`)
        finish()
      } else {
        settled = true
        readableStream.destroy()
        reject(err)
      }
    }

    parser.on('error', handleStreamError)
    parser.on('end', () => finish())

    readableStream.on('error', handleStreamError)

    readableStream.pipe(parser)
  })
}

// Та же идея (равный шанс попасть в выборку) для уже полностью
// построенного массива — используем для Atom-фидов, где дерево и так
// целиком в памяти (fast-xml-parser не потоковый).
function randomSample(array, limit) {
  if (array.length <= limit) return array

  const result = array.slice(0, limit)
  for (let i = limit; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    if (j < limit) result[j] = array[i]
  }
  return result
}

async function fetchShopFeed(shop) {
  const url = buildFeedUrl(shop.feed)
  console.log(`📥 ${shop.slug} (${shop.feed.format}): начинаю загрузку...`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentLength = res.headers.get('content-length')
    console.log(`   ${shop.slug}: ответ получен, размер: ${contentLength ? `${(contentLength / 1024 / 1024).toFixed(1)} МБ` : 'неизвестен'}`)

    if (shop.feed.format === 'atom') {
      const xmlText = await res.text()
      const parsed = parseAtomFeed(xmlText, shop.slug)
      const limit = shop.feed.limit || 5000
      return randomSample(parsed, limit)
    }

    if (shop.feed.format === 'yml') {
      const nodeStream = Readable.fromWeb(res.body)
      const limit = shop.feed.limit || 5000
      return await parseYmlStream(nodeStream, shop.slug, limit)
    }

    throw new Error(`Не указан shop.feed.format ('yml' или 'atom') для ${shop.slug}`)
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(`Таймаут ${FETCH_TIMEOUT_MS / 1000}с при загрузке фида ${shop.slug}`)
    }
    throw error
  }
}

async function main() {
  const shopsWithFeed = SHOPS.filter((s) => s.feed)

  if (shopsWithFeed.length === 0) {
    console.warn('⚠️ Ни у одного магазина не заполнен shop.feed — нечего качать')
    return
  }

  // Качаем последовательно, а не Promise.allSettled параллельно —
  // так проще видеть прогресс и не грузить сеть/CPU несколькими гигантскими фидами разом
  const products = []
  const errors = {}

  for (const shop of shopsWithFeed) {
    const startedAt = Date.now()
    try {
      let shopProducts
      try {
        shopProducts = await fetchShopFeed(shop)
      } catch (firstError) {
        // Сетевая ошибка (fetch failed, оборвавшееся соединение и т.п.) —
        // не таймаут по смыслу, а именно разрыв. Даём одну повторную попытку,
        // прежде чем сдаться — часто такие сбои разовые/временные.
        console.warn(`   ⚠️  ${shop.slug}: первая попытка не удалась (${firstError.message}), пробую ещё раз...`)
        shopProducts = await fetchShopFeed(shop)
      }

      products.push(...shopProducts)
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
      console.log(`✅ ${shop.slug}: ${shopProducts.length} товаров за ${seconds}с\n`)
    } catch (error) {
      errors[shop.slug] = error.message
      console.error(`❌ ${shop.slug}:`, error.message, '\n')
    }
  }

  const outDir = path.resolve('public')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, 'products.json'),
    JSON.stringify({ products, errors, updatedAt: new Date().toISOString() })
  )

  console.log(`📦 Итого сохранено ${products.length} товаров, ошибок: ${Object.keys(errors).length}`)

  if (products.length === 0) {
    console.error('❌ Все фиды упали, products.json не обновлён')
    process.exit(1)
  }
}

main()
