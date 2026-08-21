<template>
  <router-link :to="link" class="category-card">
    <div class="category-icon" :style="{ background: bgColor }">
      <SvgIcon :name="icon" :width="22" :height="22" />
    </div>
    <span class="category-name">{{ name }}</span>
  </router-link>
</template>

<script setup>
import SvgIcon from '@/components/atoms/svg-icon/SvgIcon.vue'

defineProps({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  link: { type: String, default: '/catalog' },
  bgColor: { type: String, default: '#E7F8F0' }
})
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #D8ECE5;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px -14px rgba(23, 80, 70, 0.25);
}

.category-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: #2C4A5E;
}

.category-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #2C4A5E;
  text-align: center;
}
</style>
