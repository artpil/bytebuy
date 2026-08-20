<template>
  <div class="product-page">
    <VContainer>
      <div v-if="store.loading" class="loading-state">
        <VTypography tag="p" variant="body1" color="secondary" align="center">
          Загрузка...
        </VTypography>
      </div>

      <div v-else-if="product" class="product-content">
        <div class="product-image">
          <VImage
            :src="product.image"
            :alt="product.title"
            rounded
          />
        </div>

        <div class="product-info">
          <VTypography tag="h1" variant="h2" color="primary">
            {{ product.title }}
          </VTypography>

          <span class="product-store">{{ shopName }}</span>

          <VTypography tag="p" variant="h3" color="success" class="product-price">
            {{ formatPrice(product.price) }}
          </VTypography>

          <VTypography
            v-if="product.description"
            tag="p"
            variant="body1"
            color="secondary"
            class="product-description"
          >
            {{ product.description }}
          </VTypography>

          <!-- 👇 БЛОК С ПАРТНЕРСКОЙ ССЫЛКОЙ -->
          <div class="product-actions">
            <div class="partner-buttons">
              <VButton
                variant="primary"
                size="large"
                tag="a"
                :href="buyLink"
                target="_blank"
                rel="noopener noreferrer"
                class="partner-btn"
              >
                Купить в {{ shopName }} →
              </VButton>

              <button class="share-btn" @click="shareProduct">
                Поделиться товаром
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <VTypography tag="p" variant="body1" color="danger" align="center">
          Товар не найден
        </VTypography>
      </div>
    </VContainer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { getShopBySlug, buildAffiliateLink } from '@/config/shops'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import VImage from '@/components/atoms/v-image/VImage.vue'

const route = useRoute()
const store = useProductsStore()

// id товара — строка вида "alibaba-62261297161", НЕ число
const product = computed(() => {
  const id = String(route.params.id)
  return store.getProductById(id)
})

const shopName = computed(() => {
  if (!product.value) return 'Магазин'
  return getShopBySlug(product.value.source)?.name || 'Магазин'
})

// У части товаров (Google Merchant / Atom фиды, напр. Alibaba) уже есть
// готовая партнёрская ссылка в affiliateLink — используем её как есть.
// Для остальных (YML-фиды с productUrl) собираем ссылку сами.
const buyLink = computed(() => {
  if (!product.value) return '#'
  if (product.value.affiliateLink) return product.value.affiliateLink
  return buildAffiliateLink(product.value.source, product.value.productUrl)
})

const formatPrice = (price) => {
  if (!price) return '0 ₽'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price * 90)
}

const shareProduct = () => {
  if (!product.value) return
  const url = window.location.href
  const text = `🔥 ${product.value.title} — отличная цена на ByteBuy!`

  if (navigator.share) {
    navigator.share({ title: product.value.title, text, url }).catch((e) => {
      if (e.name !== 'AbortError') fallbackShare(url, text)
    })
  } else {
    fallbackShare(url, text)
  }
}

const fallbackShare = (url, text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n\n🔗 ${url}`)
      .then(() => alert('✅ Ссылка скопирована в буфер обмена!'))
      .catch(() => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank'))
  } else {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
  }
}

onMounted(() => {
  if (!store.products.length) {
    store.fetchProducts()
  }
})
</script>

<style scoped>
.product-page {
  padding: 40px 0;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image {
  background: #f8f9fc;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image .v-image {
  max-width: 400px;
  max-height: 400px;
}

.product-image .v-image img {
  object-fit: contain;
}

.product-store {
  display: inline-block;
  background: #EAF7F2;
  color: #17A9B0;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 16px;
  text-transform: capitalize;
}

.product-price {
  margin: 16px 0;
}

.product-description {
  line-height: 1.8;
  margin-bottom: 24px;
}

.product-actions {
  margin-top: 24px;
}

.partner-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.partner-btn {
  width: 100%;
  justify-content: center;
}

.share-btn {
  align-self: center;
  background: none;
  border: none;
  color: #4a4a6a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #f0f0f5;
  color: #1a1a2e;
}

.loading-state,
.error-state {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }

  .product-image {
    padding: 20px;
  }

  .product-image .v-image {
    max-width: 250px;
    max-height: 250px;
  }
}
</style>
