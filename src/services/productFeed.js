// services/productFeed.js
// XML больше не парсится в браузере — это делает GitHub Actions
// (см. scripts/fetch-feeds.mjs), результат лежит в public/products.json.
// Здесь просто читаем готовый статический файл — быстро и без CORS.

export async function getProductsWithCache(forceRefresh = false) {
  const bust = forceRefresh ? `?t=${Date.now()}` : ''
  const url = `${import.meta.env.BASE_URL}products.json${bust}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Не удалось загрузить products.json: ${response.status}`)
  }

  const data = await response.json()
  return { products: data.products || [], errors: data.errors || {} }
}

export function clearCache() {
  // Кэш теперь на уровне статического файла (обновляется по расписанию
  // в GitHub Actions) и HTTP-кэша браузера — чистить на клиенте нечего.
}
