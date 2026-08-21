<!-- components/FeedStatus.vue -->
<template>
  <div class="feed-status" v-if="productsStore.products.length > 0">
    <div class="status-content">
      <span class="status-dot" :class="{ active: !productsStore.loading }"></span>
      <span class="status-text">
        {{ productsStore.products.length }} товаров
        <span v-if="lastUpdate" class="update-time">
          (обновлено: {{ formatTime(lastUpdate) }})
        </span>
      </span>
      <button class="refresh-btn" @click="handleRefresh" :disabled="productsStore.loading">
        ⟳
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const lastUpdate = computed(() => productsStore.lastUpdated)

const formatTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const handleRefresh = () => {
  productsStore.refreshProducts()
}
</script>

<style scoped>
.feed-status {
  padding: 8px 16px;
  background: #f8f9fc;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #4a4a6a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffc107;
  display: inline-block;
}

.status-dot.active {
  background: #4CAF50;
}

.update-time {
  color: #8a8aa0;
  font-size: 12px;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #4a4a6a;
  padding: 0 4px;
  transition: transform 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  transform: rotate(180deg);
  color: #17A9B0;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
