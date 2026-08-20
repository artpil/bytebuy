<template>
  <div class="v-price">
    <span class="v-price-current">{{ current }}</span>
    <span v-if="old" class="v-price-old">{{ old }}</span>
    <span v-if="discount" class="v-price-discount">−{{ discount }}%</span>
  </div>
</template>

<script setup>
defineProps({
  current: {
    type: String,
    required: true
  },
  old: {
    type: String,
    default: null
  },
  discount: {
    type: [String, Number],
    default: null
  }
})
</script>

<style scoped>
.v-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.v-price-current {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #F2660D;
  font-size: 17px;
}

.v-price-old {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #9AAAB1;
  text-decoration: line-through;
}

.v-price-discount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #F2660D;
  background: rgba(242, 102, 13, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}
</style>
