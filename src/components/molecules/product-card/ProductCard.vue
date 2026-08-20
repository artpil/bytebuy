<template>
  <div v-if="product" class="product-card">
    <router-link :to="`/product/${product.id}`" class="product-link">
      <div class="product-image">
        <VImage
          :src="product.image || product.product_main_image_url"
          :alt="product.title || product.product_title"
          rounded
          cover
        />
      </div>

      <div class="product-info">
        <VTypography
          tag="h3"
          variant="h6"
          color="primary"
          class="product-title"
          ellipsis
        >
          {{ product.title || product.product_title }}
        </VTypography>

        <span class="product-store">{{ product.source || 'Shop' }}</span>

        <div class="product-footer">
          <VTypography
            tag="span"
            variant="h5"
            color="success"
            class="product-price"
          >
            {{ formatPrice(product.price) }}
          </VTypography>

          <a
            :href="buyLink"
            target="_blank"
            rel="noopener noreferrer"
            class="product-buy"
          >
            Купить
          </a>
        </div>

        <!-- 👇 КНОПКА "ПОДЕЛИТЬСЯ" -->
        <div class="product-share">
          <button
            class="share-btn"
            @click.prevent="shareProduct"
            aria-label="Поделиться товаром"
          >
            <svg
              width="16"
              height="16"
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
            <span>Share</span>
          </button>
        </div>
      </div>
    </router-link>
  </div>

  <div v-else class="product-card-placeholder">
    <p>Товар не найден</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VImage from '@/components/atoms/v-image/VImage.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// ===== ФОРМАТИРОВАНИЕ ЦЕНЫ =====
const formatPrice = (price) => {
  if (!price) return '0 ₽'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price * 90)
}

// ===== ССЫЛКА ДЛЯ ПОКУПКИ =====
const buyLink = computed(() => {
  if (!props.product) return '#'
  return props.product.affiliateLink || '#'
})

// ===== ФУНКЦИЯ "ПОДЕЛИТЬСЯ" =====
const shareProduct = () => {
  if (!props.product) return

  const title = props.product.title || 'Товар на ByteBuy'
  const url = window.location.origin + `/product/${props.product.id}`
  const text = `🔥 ${title} — отличная цена на ByteBuy!`

  if (navigator.share) {
    navigator.share({
      title: title,
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
        alert('✅ Ссылка скопирована в буфер обмена! Поделитесь ей с друзьями.')
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
.product-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #D8ECE5;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.product-link {
  text-decoration: none;
  display: block;
}

.product-image {
  background: #f8f9fc;
  padding: 20px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image .v-image {
  max-width: 180px;
  max-height: 180px;
}

.product-info {
  padding: 16px 18px 20px;
}

.product-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.3;
  height: 38px;
  overflow: hidden;
}

.product-store {
  font-size: 13px;
  color: #8a8aa0;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.product-price {
  font-weight: 700;
  color: #F2660D;
}

.product-buy {
  background: #4CAF50;
  color: white;
  padding: 6px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.product-buy:hover {
  background: #45a049;
}

.product-share {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f5;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #4a4a6a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #f0f0f5;
  color: #1a1a2e;
}

.share-btn svg {
  width: 16px;
  height: 16px;
}

.product-card-placeholder {
  padding: 20px;
  text-align: center;
  color: #8a8aa0;
}
</style>
