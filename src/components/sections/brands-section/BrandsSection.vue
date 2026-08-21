<template>
  <section class="brands-section">
    <VContainer>
      <div class="section-header">
        <VTypography tag="h2" variant="h2" color="primary">Популярные бренды</VTypography>
      </div>
      <div class="brands-grid">
        <div
          v-for="brand in brands"
          :key="brand.id"
          class="brand-item"
          :style="{ background: brand.bg }"
        >
          <span class="brand-name">{{ brand.name }}</span>
        </div>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'

const brands = [
  { id: 1, name: 'Apple', bg: '#f5f5f5' },
  { id: 2, name: 'Samsung', bg: '#e3f2fd' },
  { id: 3, name: 'Xiaomi', bg: '#fff3e0' },
  { id: 4, name: 'Sony', bg: '#e8f5e9' },
  { id: 5, name: 'Lenovo', bg: '#fce4ec' },
  { id: 6, name: 'Huawei', bg: '#f3e5f5' },
  { id: 7, name: 'Asus', bg: '#e0f7fa' },
  { id: 8, name: 'Dell', bg: '#fff8e1' },
  { id: 9, name: 'HP', bg: '#efebe9' },
  { id: 10, name: 'Acer', bg: '#e8eaf6' }
]
</script>

<style scoped>
.brands-section {
  padding: 40px 0;
}

.section-header {
  margin-bottom: 26px;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.brand-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-radius: 16px;
  border: 1px solid #D8ECE5;
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
  min-height: 70px;
}

.brand-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.brand-name {
  font-weight: 700;
  font-size: 16px;
  color: #2C4A5E;
}

@media (max-width: 768px) {
  .brands-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .brand-item {
    padding: 14px 12px;
    min-height: 56px;
  }

  .brand-name {
    font-size: 13px;
  }
}
</style>
