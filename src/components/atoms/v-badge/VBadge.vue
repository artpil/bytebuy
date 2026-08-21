<template>
  <span class="v-badge" :class="[`v-badge--${variant}`, `v-badge--${size}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'danger', 'warning', 'dark'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium'].includes(value)
  }
})
</script>

<style scoped>
.v-badge {
  display: inline-block;
  font-weight: 700;
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
}

.v-badge--small {
  font-size: 10px;
  padding: 2px 8px;
}

.v-badge--medium {
  font-size: 11px;
  padding: 4px 10px;
}

.v-badge--primary {
  background: #2ECC91;
  color: white;
}

.v-badge--success {
  background: #17A9B0;
  color: white;
}

.v-badge--danger {
  background: #F2660D;
  color: white;
}

.v-badge--warning {
  background: #FFB020;
  color: #1F2E38;
}

.v-badge--dark {
  background: #2C4A5E;
  color: white;
}
</style>
