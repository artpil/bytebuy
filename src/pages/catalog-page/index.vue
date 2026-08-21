<!-- src/pages/catalog-page/index.vue -->
<template>
  <div class="catalog-page">
    <VContainer>
      <!-- Заголовок -->
      <div class="catalog-header">
        <VTypography tag="h1" variant="h1" color="primary" class="page-title">
          {{ pageTitle }}
        </VTypography>
        <VTypography v-if="searchQuery" tag="p" variant="body1" color="secondary">
          Результаты поиска по запросу: "{{ searchQuery }}"
        </VTypography>
      </div>

      <!-- Фильтры (скрываем при поиске) -->
      <div v-if="!searchQuery" class="filter-section">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === '' }"
          @click="selectedCategory = ''"
        >
          Все
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="store.loading" class="loading-state">
        <VTypography tag="p" variant="body1" color="secondary" align="center">
          Загрузка товаров...
        </VTypography>
      </div>

      <!-- Состояние ошибки -->
      <div v-else-if="store.error" class="error-state">
        <VTypography tag="p" variant="body1" color="danger" align="center">
          {{ store.error }}
        </VTypography>
      </div>

      <!-- Список товаров -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Пустое состояние -->
      <div v-else class="empty-state">
        <VTypography tag="p" variant="body1" color="secondary" align="center">
          {{ searchQuery ? '😕 По вашему запросу ничего не найдено' : 'Товаров не найдено' }}
        </VTypography>
        <VButton v-if="searchQuery" variant="primary" tag="router-link" to="/catalog">
          Сбросить поиск
        </VButton>
      </div>
    </VContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import ProductCard from '@/components/molecules/product-card/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

// ===== СОСТОЯНИЕ =====
const selectedCategory = ref('')

// ===== ПОЛУЧАЕМ ЗАПРОС ИЗ URL =====
const searchQuery = computed(() => {
  return route.query.q || ''
})

// ===== КАТЕГОРИИ =====
const categories = computed(() => store.categories || [])

// ===== ЗАГОЛОВОК СТРАНИЦЫ =====
const pageTitle = computed(() => {
  if (searchQuery.value) {
    return `Результаты поиска`
  }
  return 'Каталог товаров'
})

// ===== ФИЛЬТРАЦИЯ ТОВАРОВ =====
const filteredProducts = computed(() => {
  let products = store.products

  // 1. Фильтр по категории (только если нет поискового запроса)
  if (!searchQuery.value && selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  // 2. Поисковый запрос (по названию, категории, описанию, магазину)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    products = products.filter(product => {
      const title = (product.title || '').toLowerCase()
      const category = (product.category || '').toLowerCase()
      const description = (product.description || '').toLowerCase()
      const storeName = (product.storeName || '').toLowerCase()

      return title.includes(query) ||
        category.includes(query) ||
        description.includes(query) ||
        storeName.includes(query)
    })
  }

  return products
})

// ===== ЗАГРУЗКА ТОВАРОВ =====
onMounted(() => {
  if (!store.products.length) {
    store.fetchProducts()
  }
})

// ===== ОТСЛЕЖИВАЕМ ИЗМЕНЕНИЕ ЗАПРОСА =====
watch(() => route.query.q, (newQuery) => {
  // При поиске сбрасываем фильтр категории
  if (newQuery) {
    selectedCategory.value = ''
  }
})
</script>

<style scoped>
.catalog-page {
  padding: 40px 0;
}

.catalog-header {
  margin-bottom: 32px;
}

.page-title {
  margin-bottom: 4px;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.filter-btn {
  padding: 8px 20px;
  border: 2px solid #D8ECE5;
  border-radius: 20px;
  background: white;
  color: #2C4A5E;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #2ECC91;
  color: #2ECC91;
}

.filter-btn.active {
  background: #2ECC91;
  border-color: #2ECC91;
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.loading-state,
.error-state,
.empty-state {
  padding: 60px 0;
}

.empty-state .v-button {
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>
