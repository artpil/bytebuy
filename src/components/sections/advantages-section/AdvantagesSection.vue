<template>
  <section class="advantages-section">
    <VContainer>
      <div class="advantages-grid">
        <AdvantageItem
          v-for="advantage in advantages"
          :key="advantage.id"
          :icon="advantage.icon"
          :title="advantage.title"
          :description="advantage.description"
        />
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import AdvantageItem from '@/components/molecules/advantage-item/AdvantageItem.vue'

const advantages = [
  { id: 1, icon: 'delivery', title: 'Доставка', description: 'от 1 дня' },
  { id: 2, icon: 'shield', title: 'Безопасная', description: 'оплата' },
  { id: 3, icon: 'return', title: 'Возврат', description: '30 дней' },
  { id: 4, icon: 'support', title: 'Поддержка', description: '24/7' }
]
</script>

<style scoped>
.advantages-section {
  padding: 30px 0;
  background: white;
  border-top: 1px solid #D8ECE5;
  border-bottom: 1px solid #D8ECE5;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
}

@media (max-width: 768px) {
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .advantages-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}
</style>
