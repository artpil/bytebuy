<template>
  <footer class="v-footer">
    <VContainer>
      <div class="footer-grid">
        <div class="footer-section">
          <router-link to="/" class="footer-brand">
            <SvgIcon name="logo-icon" :width="57" :height="47" />
            <SvgIcon name="logo-text" :width="138" :height="35" />
          </router-link>
          <p class="footer-description">
            Ваш гид по выгодным покупкам. <br />
            Лучшие товары по лучшим ценам.
          </p>
        </div>

        <div class="footer-section">
          <h4>Разделы</h4>
          <router-link to="/">Главная</router-link>
          <router-link to="/catalog">Каталог</router-link>
          <router-link to="/blog">Блог</router-link>
          <!--router-link to="/about">О нас</router-link-->
        </div>

        <!--div class="footer-section">
          <h4>Полезное</h4>
          <a href="#" target="_blank">📱 Telegram-канал</a>
          <a href="#" target="_blank">📸 Instagram</a>
          <router-link to="/contacts">Контакты</router-link>
        </div-->

        <!--div class="footer-section">
          <h4>Партнёры</h4>
          <a href="#" target="_blank">Admitad</a>
          <a href="#" target="_blank">Ozon</a>
          <a href="#" target="_blank">Wildberries</a>
        </div-->
      </div>

      <div class="footer-bottom">
        <p>© 2026 ByteBuy. Все права защищены.</p>
        <!--div class="footer-links">
          <router-link to="/privacy">Политика конфиденциальности</router-link>
          <span>|</span>
          <router-link to="/terms">Условия использования</router-link>
        </div-->
      </div>
    </VContainer>
  </footer>
</template>

<script setup>
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import SvgIcon from "@/components/atoms/svg-icon/SvgIcon.vue";
</script>

<style scoped>
.v-footer {
  background: #1a1a2e;
  color: #e0e0e0;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.footer-brand, .footer-brand:hover {
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  background: none;

}

.brand-icon {
  margin-right: 8px;
}

.footer-description {
  color: #a0a0b0;
  font-size: 14px;
  line-height: 1.6;
  max-width: 250px;
}

.footer-section h4 {
  color: white;
  font-size: 15px;
  margin-bottom: 12px;
}

.footer-section a {
  display: block;
  color: #a0a0b0;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: #4CAF50;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.footer-links {
  display: flex;
  gap: 12px;
  align-items: center;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #4CAF50;
}

.footer-links span {
  color: #444;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .footer-section:first-child {
    grid-column: 1 / -1;
  }

  .footer-description {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 8px;
  }

  .footer-links span {
    display: none;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .footer-section:first-child {
    grid-column: 1;
  }
}
</style>
