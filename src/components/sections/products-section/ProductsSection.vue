<template>
  <section class="products-section">
    <VContainer>
      <div class="section-header">
        <div class="section-title-wrapper">
          <VTypography tag="h2" variant="h2" color="primary">{{ title }}</VTypography>
          <span v-if="storeLabel" class="store-badge">{{ storeLabel }}</span>
        </div>
        <VButton
          variant="link"
          tag="router-link"
          :to="`/catalog?store=${storeId}`"
          class="show-all-btn"
        >
          Показать всё →
        </VButton>
      </div>

      <div class="products-grid">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- 👇 КНОПКА "ПОДЕЛИТЬСЯ" ДЛЯ РАЗДЕЛА -->
      <div v-if="storeId" class="section-share">
        <button class="share-section-btn" @click="shareSection">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Поделиться разделом</span>
        </button>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import ProductCard from '@/components/molecules/product-card/ProductCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  storeId: {
    type: String,
    default: null
  },
  storeLabel: {
    type: String,
    default: null
  },
  maxProducts: {
    type: Number,
    default: 6
  }
})

const displayedProducts = computed(() => {
  return props.products.slice(0, props.maxProducts)
})

// ===== ФУНКЦИЯ "ПОДЕЛИТЬСЯ РАЗДЕЛОМ" =====
const shareSection = () => {
  const url = window.location.origin + `/catalog?store=${props.storeId}`
  const text = `🛍️ ${props.title} на ByteBuy! Лучшие товары из ${props.storeLabel || 'магазина'}.`

  if (navigator.share) {
    navigator.share({
      title: props.title,
      text: text,
      url: url,
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Ошибка при попытке поделиться:', error)
        fallbackShare(url, text)
      }
    })
  } else {
    fallbackShare(url, text)
  }
}

const fallbackShare = (url, text) => {
  const shareData = `${text}\n\n🔗 ${url}`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData)
      .then(() => {
        alert('✅ Ссылка на раздел скопирована в буфер обмена! Поделитесь ей с друзьями.')
      })
      .catch(() => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          '_blank'
        )
      })
  } else {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }
}
</script>

<style scoped>
.products-section {
  padding: 40px 0;
  background: #f8f9fc;
}

.products-section:nth-child(even) {
  background: #ffffff;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 26px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.store-badge {
  display: inline-block;
  background: #EAF7F2;
  color: #17A9B0;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.show-all-btn {
  white-space: nowrap;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
}

.section-share {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8ee;
  display: flex;
  justify-content: center;
}

.share-section-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #d0d0d8;
  color: #4a4a6a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.share-section-btn:hover {
  background: #f0f0f5;
  border-color: #17A9B0;
  color: #17A9B0;
}

.share-section-btn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>
