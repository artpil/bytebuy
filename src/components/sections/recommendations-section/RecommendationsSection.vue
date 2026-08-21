<template>
  <section class="recommendations-block">
    <VContainer>
      <VTypography tag="h2" class="section-title">
        <slot name="title">Персональные предложения</slot>
      </VTypography>

      <div class="recommendations-block__grid">
        <ProductCard
          v-for="product in items"
          :key="product.id"
          :product="product"
          @add-to-cart="$emit('add-to-cart', product.id)"
        />
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue';
import VTypography from '@/components/atoms/v-typography/VTypography.vue';
import ProductCard from '@/components/molecules/product-card/ProductCard.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(['add-to-cart']);
</script>

<style scoped>
.recommendations-block {
  padding: 40px 0;
  background-color: #f9f9f9;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1c1c1e;
}
.recommendations-block__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

@media (max-width: 576px) {
  .recommendations-block__grid {
    grid-template-columns: repeat(2, 1fr); /* На мобильных по 2 карточки в ряд в стиле WB/Temu */
    gap: 10px;
  }
}
</style>
