<template>
  <div class="v-rating">
    <span class="v-rating-stars">
      <span v-for="i in 5" :key="i" class="star" :class="{ 'star--active': i <= roundedRating }">★</span>
    </span>
    <span v-if="showCount" class="v-rating-count">{{ rating }} · {{ count }} отзывов</span>
    <span v-else-if="showRating" class="v-rating-value">{{ rating }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  showCount: {
    type: Boolean,
    default: true
  },
  showRating: {
    type: Boolean,
    default: false
  }
})

const roundedRating = computed(() => Math.round(props.rating))
</script>

<style scoped>
.v-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.v-rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #D8ECE5;
  font-size: 14px;
}

.star--active {
  color: #FFB020;
}

.v-rating-count {
  font-size: 12px;
  color: #8CA3A9;
  font-weight: 600;
}

.v-rating-value {
  font-size: 13px;
  font-weight: 700;
  color: #2C4A5E;
}
</style>
