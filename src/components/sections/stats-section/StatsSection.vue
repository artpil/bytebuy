<template>
  <section class="stats-section">
    <VContainer>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">18M+</span>
          <span class="stat-label">покупателей</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">2.4M</span>
          <span class="stat-label">товаров в каталоге</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">54K</span>
          <span class="stat-label">продавцов</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">320</span>
          <span class="stat-label">городов доставки</span>
        </div>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
</script>

<style scoped>
.stats-section {
  background: white;
  border-top: 1px solid #D8ECE5;
  border-bottom: 1px solid #D8ECE5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 40px 0;
}

.stat-item {
  text-align: center;
  border-right: 1px solid #D8ECE5;
}

.stat-item:last-child {
  border-right: none;
}

.stat-number {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 30px;
  font-weight: 700;
  color: #2C4A5E;
}

.stat-label {
  font-size: 12.5px;
  color: #7C9C93;
  font-weight: 600;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 24px 0;
    gap: 16px;
  }

  .stat-item {
    border-right: none;
    border-bottom: 1px solid #D8ECE5;
    padding-bottom: 12px;
  }

  .stat-item:nth-last-child(-n+2) {
    border-bottom: none;
    padding-bottom: 0;
  }

  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 11px;
  }
}
</style>
