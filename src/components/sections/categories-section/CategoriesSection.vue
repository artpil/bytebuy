<template>
  <section class="categories-section">
    <VContainer>
      <div class="section-header">
        <VTypography tag="h2" variant="h2" color="primary">Categories</VTypography>
        <VButton variant="link" tag="router-link" to="/catalog">All Categories →</VButton>
      </div>
      <div class="categories-grid">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :name="category.name"
          :icon="category.icon"
          :link="category.link"
          :bg-color="category.bgColor"
        />
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import CategoryCard from '@/components/molecules/category-card/CategoryCard.vue'
import { SHOPS } from '@/config/shops'

// Best-fit icon per shop from the existing generic category icon set.
// No dedicated per-marketplace icons exist yet, so this is an approximation
// based on what each shop mostly sells — update as real icons are added.
const ICON_MAP = {
  geekbuying: 'i-electronics',
  'alibaba-beauty': 'i-beauty',
  'alibaba-jewelry': 'i-fashion',
  'alibaba-electronics': 'i-electronics',
  'alibaba-apparel': 'i-fashion',
  'alibaba-home-garden': 'i-home',
  'alibaba-sports': 'i-sports',
  aliexpress: 'i-electronics',
  'aliexpress-under10': 'i-electronics',
  'aliexpress-10-25': 'i-electronics',
  joom: 'i-electronics',
  sunsky: 'i-electronics',
  noracora: 'i-fashion',
}
const DEFAULT_ICON = 'i-electronics'

const BG_COLORS = ['#E7F8F0', '#FDECE1', '#E9F3F8', '#F6EBFA', '#EAF3E3', '#FDE9E9', '#E7EEF8', '#FDF3DE']

// Only shops with a working feed — shop.feed === null means no products yet
const categories = SHOPS.filter((s) => s.feed).map((s, i) => ({
  id: s.slug,
  name: s.name,
  icon: ICON_MAP[s.slug] || DEFAULT_ICON,
  link: `/catalog/${s.slug}`,
  bgColor: BG_COLORS[i % BG_COLORS.length],
}))
</script>

<style scoped>
.categories-section {
  padding: 40px 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 26px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 14px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
