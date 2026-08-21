<template>
  <!-- eslint-disable vue/no-v-html -->
  <span
    v-if="inlineSvg"
    class="svg-icon"
    :class="rootClass"
    :role="computedRole"
    :aria-label="ariaLabel || title || null"
    :aria-hidden="decorative ? 'true' : null"
    v-html="processedSvg"
  />
  <!-- eslint-enable vue/no-v-html -->
  <img
    v-else-if="imgSrc"
    class="svg-icon"
    :class="rootClass"
    :src="imgSrc"
    :alt="ariaLabel || title || ''"
    :width="numericWidth || null"
    :height="numericHeight || null"
  />
  <span v-else class="svg-icon svg-icon--missing" :class="rootClass" aria-hidden="true" />
</template>

<script setup>
import { computed } from 'vue'

// Простой импорт SVG через new URL (более надёжный способ)
const getSvgUrl = (name) => {
  try {
    return new URL(`/src/assets/svg/${name}.svg`, import.meta.url).href
  } catch {
    return null
  }
}

const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: '' },
  size: { type: [Number, String], default: null },
  width: { type: [Number, String], default: null },
  height: { type: [Number, String], default: null },
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  decorative: { type: Boolean, default: false },
  color: { type: String, default: '' },
  class: { type: [String, Array, Object], default: '' },
})

const numericWidth = computed(() => normalizeSize(props.width || props.size))
const numericHeight = computed(() => normalizeSize(props.height || props.size))

function normalizeSize(v) {
  if (v === null || v === undefined || v === '') return null
  if (typeof v === 'number') return v
  const n = parseFloat(v)
  return Number.isNaN(n) ? null : n
}

const isSvgMarkup = computed(() => {
  if (!props.src) return false
  const trimmed = props.src.trim()
  return trimmed.startsWith('<svg') || trimmed.startsWith('<?xml')
})

const imgSrc = computed(() => {
  if (isSvgMarkup.value) return ''
  if (props.src) return props.src
  if (props.name) return getSvgUrl(props.name)
  return ''
})

// Для простоты всегда используем img тег, не инлайним SVG
const inlineSvg = computed(() => false)

const processedSvg = computed(() => '')
const computedRole = computed(() => (props.decorative ? 'presentation' : 'img'))
const rootClass = computed(() => props.class)
</script>

<style scoped>
.svg-icon {
  display: inline-flex;
  line-height: 1;
  vertical-align: middle;
}

.svg-icon {
  color: v-bind(color);
}

.svg-icon :deep(svg) {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.svg-icon--missing {
  width: 1em;
  height: 1em;
  background: repeating-linear-gradient(45deg, #ccc, #ccc 2px, #eee 2px, #eee 4px);
  border-radius: 2px;
}
</style>
