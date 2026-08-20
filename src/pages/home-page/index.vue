<template>
  <div class="home-page">
    <!-- Загрузка -->
    <div v-if="store.loading" class="loading-state">
      <VTypography tag="p" variant="body1" color="secondary" align="center">
        Loading products from stores...
      </VTypography>
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p v-if="store.totalProducts > 0" class="loading-info">
        Loaded {{ store.totalProducts }} products
      </p>
    </div>

    <!-- Контент -->
    <div v-else>
      <HeroSlider />
      <!--
      <CategoriesSection />
      -->

      <FlashSaleSection />

      <!-- 👇 РАЗДЕЛЫ ДЛЯ КАЖДОГО МАГАЗИНА -->
      <ProductsSection
        v-for="shop in store.activeShops"
        :key="shop.slug"
        :title="shop.name"
        :shop-slug="shop.slug"
        :products="store.getProductsByShop(shop.slug)"
      />

      <!--
       <PromoBannersSection />
       -->

      <StatsSection />
      <BrandsSection />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import HeroSlider from '@/components/sections/hero-slider/HeroSlider.vue'
import CategoriesSection from '@/components/sections/categories-section/CategoriesSection.vue'
import FlashSaleSection from '@/components/sections/flash-sale-section/FlashSaleSection.vue'
import AdvantagesSection from '@/components/sections/advantages-section/AdvantagesSection.vue'
import ProductsSection from '@/components/sections/products-section/ProductsSection.vue'
import PromoBannersSection from '@/components/sections/promo-banners-section/PromoBannersSection.vue'
import StatsSection from '@/components/sections/stats-section/StatsSection.vue'
import BrandsSection from '@/components/sections/brands-section/BrandsSection.vue'

const store = useProductsStore()

onMounted(async () => {
  if (!store.products.length) {
    await store.fetchProducts()
  }
})

let refreshInterval = null
onMounted(() => {
  refreshInterval = setInterval(() => {
    if (!store.loading) store.fetchProducts(true)
  }, 1000 * 60 * 60) // 60 минут
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.loading-state {
  padding: 60px 0;
  text-align: center;
}

.loading-spinner {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e8e8ee;
  border-top-color: #17A9B0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-info {
  margin-top: 16px;
  color: #8a8aa0;
  font-size: 14px;
}
</style>
