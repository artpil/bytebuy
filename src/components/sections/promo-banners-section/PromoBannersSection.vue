<template>
  <section class="promo-banners-section">
    <VContainer>
      <div class="banners-grid">
        <div class="promo-banner promo-banner--dark">
          <h3>Продавайте на ByteBuy — миллионы покупателей рядом</h3>
          <p>Подключение за 1 день, бесплатное размещение первых 100 товаров.</p>
          <VButton variant="secondary" size="medium" tag="a" href="#">
            Начать продавать
          </VButton>
          <div class="pixel-deco">
            <span v-for="i in 8" :key="i"></span>
          </div>
        </div>

        <div class="promo-banner promo-banner--gradient">
          <h3>Приложение ByteBuy: скидка 10% на первый заказ</h3>
          <p>Отслеживайте доставку в реальном времени и получайте байт-купоны каждую неделю.</p>
          <div class="app-buttons">
            <span class="app-btn">App Store</span>
            <span class="app-btn">Google Play</span>
          </div>
          <div class="pixel-deco">
            <span v-for="i in 8" :key="i"></span>
          </div>
        </div>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
</script>

<style scoped>
.promo-banners-section {
  padding: 40px 0;
}

.banners-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.promo-banner {
  border-radius: 22px;
  padding: 34px;
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.promo-banner--dark {
  background: linear-gradient(120deg, #2C4A5E, #3E6C82);
  color: white;
}

.promo-banner--gradient {
  background: linear-gradient(120deg, #2ECC91, #17A9B0);
  color: white;
}

.promo-banner h3 {
  font-size: 22px;
  font-weight: 800;
  max-width: 280px;
  margin-bottom: 10px;
  font-family: 'Sora', sans-serif;
}

.promo-banner p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13.5px;
  max-width: 260px;
  margin-bottom: 18px;
  line-height: 1.5;
}

.promo-banner .v-button {
  align-self: flex-start;
}

.app-buttons {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.app-btn {
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.pixel-deco {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 12px);
  gap: 5px;
  opacity: 0.35;
}

.pixel-deco span {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: white;
}

@media (max-width: 768px) {
  .banners-grid {
    grid-template-columns: 1fr;
  }

  .promo-banner {
    padding: 24px 20px;
    min-height: 150px;
  }

  .promo-banner h3 {
    font-size: 18px;
    max-width: 100%;
  }

  .promo-banner p {
    max-width: 100%;
    font-size: 13px;
  }

  .pixel-deco {
    display: none;
  }
}
</style>
