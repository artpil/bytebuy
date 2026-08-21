<template>
  <div class="v-timer">
    <span class="v-timer-label">{{ label }}</span>
    <div class="v-timer-boxes">
      <span class="v-timer-box">{{ hours }}</span>
      <span class="v-timer-box">{{ minutes }}</span>
      <span class="v-timer-box">{{ seconds }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  endTime: {
    type: String,
    default: () => new Date(Date.now() + 3600000 * 2).toISOString()
  },
  label: {
    type: String,
    default: 'Успейте до конца:'
  }
})

const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')
let timerInterval = null

const updateTimer = () => {
  const now = new Date().getTime()
  const end = new Date(props.endTime).getTime()
  const diff = Math.max(0, end - now)

  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  hours.value = String(h).padStart(2, '0')
  minutes.value = String(m).padStart(2, '0')
  seconds.value = String(s).padStart(2, '0')
}

onMounted(() => {
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.v-timer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.v-timer-label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
}

.v-timer-boxes {
  display: flex;
  gap: 6px;
}

.v-timer-box {
  background: rgba(0, 0, 0, 0.22);
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 18px;
  padding: 6px 10px;
  border-radius: 8px;
  min-width: 34px;
  text-align: center;
}
</style>
