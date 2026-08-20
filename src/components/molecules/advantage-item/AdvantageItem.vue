<template>
  <div class="advantage-item">
    <div class="advantage-icon">
      <SvgIcon :name="icon" :width="19" :height="19" />
    </div>
    <div class="advantage-text">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </div>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/atoms/svg-icon/SvgIcon.vue'

defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<style scoped>
.advantage-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.advantage-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #DCF2EA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #17A9B0;
}

.advantage-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #2C4A5E;
  line-height: 1.3;
}

.advantage-text strong {
  display: block;
}

.advantage-text span {
  font-weight: 400;
  opacity: 0.7;
}
</style>
