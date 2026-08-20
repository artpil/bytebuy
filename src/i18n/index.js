// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

export const SUPPORTED_LOCALES = ['en', 'ru']
const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'bytebuy_locale'

function detectLocale() {
  // 1. Пользователь уже выбирал язык вручную раньше — это в приоритете
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved

  // 2. Язык браузера/ОС (не геолокация — это именно настройка языка,
  // а не физическое местоположение пользователя)
  const browserLangs = navigator.languages || [navigator.language]
  for (const lang of browserLangs) {
    const short = lang.slice(0, 2).toLowerCase()
    if (SUPPORTED_LOCALES.includes(short)) return short
  }

  // 3. Ничего не подошло — английский по умолчанию
  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false, // Composition API режим — useI18n() внутри <script setup>
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, ru },
})

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)
}

export function getCurrentLocale() {
  return i18n.global.locale.value
}
