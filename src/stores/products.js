// stores/products.js
import { defineStore } from 'pinia'
import { getProductsWithCache, clearCache } from '@/services/productFeed.js'
import { SHOPS } from '@/config/shops'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    errors: {}, // { shopSlug: 'текст ошибки' }
    lastUpdated: null,
  }),

  actions: {
    async fetchProducts(forceRefresh = false) {
      this.loading = true
      const { products, errors } = await getProductsWithCache(forceRefresh)

      if (products.length > 0) {
        this.products = products
        this.errors = errors
        this.lastUpdated = new Date().toISOString()
      } else {
        // фид пуст/упал — пробуем откатиться на localStorage
        const saved = localStorage.getItem('cached_products')
        if (saved) {
          try {
            this.products = JSON.parse(saved)
          } catch (e) {}
        }
        this.errors = errors
      }

      this.loading = false
    },

    async refreshProducts() {
      clearCache()
      await this.fetchProducts(true)
    },
  },

  getters: {
    getProductById: (state) => (id) =>
      state.products.find((p) => String(p.id) === String(id)) || null,

    getProductsByShop: (state) => (slug) =>
      state.products.filter((p) => p.source === slug),

    productsByShop: (state) => {
      const grouped = {}
      state.products.forEach((p) => {
        if (!grouped[p.source]) grouped[p.source] = []
        grouped[p.source].push(p)
      })
      return grouped
    },

    // Магазины, у которых реально есть товары сейчас
    activeShops: (state) => {
      const slugsWithProducts = new Set(state.products.map((p) => p.source))
      return SHOPS.filter((s) => slugsWithProducts.has(s.slug))
    },

    totalProducts: (state) => state.products.length,
  },
})
