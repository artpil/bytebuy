<template>
  <div class="top-bar">
    <VContainer>
      <div class="top-bar-content">
        <div class="top-bar-left">
          <span class="top-bar-item">
            <span class="dot"></span>
            Бесплатная доставка от 999 ₽
          </span>
          <span class="top-bar-item top-bar-item--desktop">
            🛡️ Возврат в течение 30 дней
          </span>
          <span class="top-bar-item top-bar-item--desktop">
            ⭐ 4.9 · 128K отзывов
          </span>
        </div>

        <div class="top-bar-right">
          <a href="#" class="top-bar-link top-bar-item--desktop">Продавать на ByteBuy</a>
          <a href="#" class="top-bar-link top-bar-item--desktop">Помощь</a>
          <span class="top-bar-item">RUB · Ереван</span>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
</script>

<style scoped>
.top-bar {
  background: #1B3040;
  color: #CFEFE6;
  font-size: 13px;
  padding: 0 16px;
  user-select: none;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 38px;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.top-bar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
}

.top-bar-item--desktop {
  display: flex;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2ECC91;
  display: inline-block;
  flex-shrink: 0;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 22px;
}

.top-bar-link {
  color: #CFEFE6;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s, color 0.2s;
  cursor: pointer;
}

.top-bar-link:hover {
  opacity: 1;
  color: #2ECC91;
}

@media (max-width: 768px) {
  .top-bar {
    font-size: 11px;
    padding: 0 12px;
  }

  .top-bar-content {
    height: 32px;
  }

  .top-bar-left {
    gap: 12px;
  }

  .top-bar-item--desktop {
    display: none !important;
  }

  .top-bar-right {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    font-size: 10px;
    padding: 0 8px;
  }

  .top-bar-content {
    height: 28px;
  }

  .top-bar-left {
    gap: 8px;
  }

  .top-bar-right {
    gap: 8px;
  }

  .dot {
    width: 4px;
    height: 4px;
  }
}
</style>
