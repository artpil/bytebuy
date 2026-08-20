<!-- src/components/sections/flash-sale-section/FlashSaleSection.vue -->
<template>
  <section class="flash-sale-section">
    <VContainer>
      <div class="flash-sale-wrapper">
        <div class="flash-header">
          <div class="flash-title">
            <span class="flash-icon">⚡</span>
            <VTypography tag="h2" variant="h2" color="white">Flash Sale of the Day</VTypography>
          </div>
          <VTimer :end-time="endTime" label="Hurry up!" />
        </div>
        <div class="flash-scroll">
          <a href="https://www.fl.ru/projects/?ref=71487" target="_blank"><img src="https://st.fl.ru/images/banners/240x400_1.gif" width="240" height="400" alt="FL.ru – фриланс сайт удаленной работы. Поиск удаленной работы, фрилансеры."></a>
          <ProductCard
            v-for="product in randomProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VTimer from '@/components/atoms/v-timer/VTimer.vue'
import ProductCard from '@/components/molecules/product-card/ProductCard.vue'
import { useProductsStore } from '@/stores/products'

// ===== ХРАНИЛИЩЕ =====
const store = useProductsStore()

// ===== ТАЙМЕР =====
const endTime = new Date(Date.now() + 3600000 * 4).toISOString()

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
// Перемешивание массива (алгоритм Фишера-Йетса)
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Получение случайного элемента из массива
const getRandomItem = (array) => {
  if (!array || array.length === 0) return null
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

// ===== ВЫБОРКА ТОВАРОВ =====
const randomProducts = computed(() => {
  // 1. Получаем список активных магазинов
  const activeShops = store.activeShops

  if (activeShops.length === 0) return []

  // 2. Для каждого магазина берём один случайный товар
  const selectedProducts = []

  for (const shop of activeShops) {
    const shopProducts = store.getProductsByShop(shop.slug)
    if (shopProducts.length > 0) {
      const randomProduct = getRandomItem(shopProducts)
      if (randomProduct) {
        selectedProducts.push(randomProduct)
      }
    }
  }

  // 3. Перемешиваем полученные товары в случайном порядке
  return shuffleArray(selectedProducts)
})
</script>

<style scoped>
.flash-sale-section {
  position: relative;
  margin: 0 0 40px;
  background: linear-gradient(115deg, #F2660D 0%, #FF8A3D 55%, #D9540A 100%);
}

.flash-sale-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.25), transparent 45%);
  pointer-events: none;
}

.flash-sale-wrapper {
  border-radius: 20px;
  padding: 28px 0px 36px;
  position: relative;
  overflow: hidden;
}

.flash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.flash-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.flash-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.flash-title h2 {
  color: white;
}

.flash-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 6px;
  position: relative;
  z-index: 1;
}

.flash-scroll::-webkit-scrollbar {
  height: 4px;
}

.flash-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.flash-scroll .product-card {
  flex: 0 0 220px;
  min-width: 170px;
}

@media (max-width: 768px) {
  .flash-sale-wrapper {
    padding: 20px 16px 24px;
    border-radius: 16px;
  }

  .flash-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .flash-scroll .product-card {
    flex: 0 0 160px;
    min-width: 150px;
  }
}
</style>
