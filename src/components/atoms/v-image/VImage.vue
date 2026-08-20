<template>
  <div
    class="v-image"
    :class="{
      'v-image--circle': circle,
      'v-image--rounded': rounded,
      'v-image--cover': cover,
      'v-image--contain': contain,
      'v-image--loading': loading
    }"
    :style="containerStyle"
  >
    <img
      v-if="displaySrc"
      :src="displaySrc"
      :alt="alt"
      :width="numericWidth"
      :height="numericHeight"
      loading="lazy"
      @error="handleError"
      @load="handleLoad"
      class="v-image-img"
    />
    <div v-else-if="placeholder" class="v-image-placeholder">
      <span v-if="typeof placeholder === 'string'" class="placeholder-text">
        {{ placeholder }}
      </span>
      <slot v-else name="placeholder" />
    </div>
    <div v-else class="v-image-placeholder">
      <span class="placeholder-icon">🖼️</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ===== ПРОПСЫ =====
const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: '' },
  alt: { type: String, default: 'Image' },
  width: { type: [Number, String], default: null },
  height: { type: [Number, String], default: null },
  circle: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  cover: { type: Boolean, default: true },
  contain: { type: Boolean, default: false },
  placeholder: { type: [String, Boolean], default: true },
  fallbackSrc: { type: String, default: '' }
})

// ===== СОСТОЯНИЕ =====
const loading = ref(true)
const error = ref(false)

// ===== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА =====
const numericWidth = computed(() => normalizeSize(props.width))
const numericHeight = computed(() => normalizeSize(props.height))

function normalizeSize(v) {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number') return v
  const n = parseFloat(v)
  return Number.isNaN(n) ? null : n
}

const containerStyle = computed(() => {
  const style = {}
  if (numericWidth.value) {
    style.width = typeof numericWidth.value === 'number'
      ? `${numericWidth.value}px`
      : numericWidth.value
  }
  if (numericHeight.value) {
    style.height = typeof numericHeight.value === 'number'
      ? `${numericHeight.value}px`
      : numericHeight.value
  }
  return style
})

// ===== ОСНОВНОЙ ИСТОЧНИК ИЗОБРАЖЕНИЯ =====
const displaySrc = computed(() => {
  // 1. Если произошла ошибка загрузки и передан резервный путь
  if (error.value && props.fallbackSrc) {
    return props.fallbackSrc
  }

  // 2. Возвращаем переданный путь (из src или name). Вся магия путей теперь на стороне данных.
  return props.src || props.name || null
})

// ===== ОБРАБОТЧИКИ =====
const handleError = () => {
  error.value = true
  loading.value = false
}

const handleLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.v-image {
  position: relative;
  display: block;
}

.v-image--circle {
  border-radius: 50%;
}

.v-image--circle .v-image-img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.v-image--rounded {
  border-radius: 12px;
}

.v-image--cover .v-image-img {
  object-fit: cover;
}

.v-image--contain .v-image-img {
  object-fit: contain;
}

.v-image-img {
  display: block;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-image--loading .v-image-img {
  opacity: 0;
}

.v-image:hover .v-image-img {
  transform: scale(1.02);
}

.v-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100px;
  background: #f0f0f5;
  color: #8a8aa0;
  font-size: 14px;
  padding: 20px;
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.3;
}

.placeholder-text {
  color: #8a8aa0;
}

.v-image--loading::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #f0f0f5 0%,
    #e8e8f0 50%,
    #f0f0f5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .v-image-placeholder {
    min-height: 80px;
  }

  .placeholder-icon {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .v-image-placeholder {
    min-height: 60px;
    padding: 12px;
  }

  .placeholder-icon {
    font-size: 28px;
  }
}
</style>
