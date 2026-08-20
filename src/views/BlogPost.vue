<template>
  <div class="blog-post-page">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading-state">
      <p>Loading article...</p>
    </div>

    <!-- Статья не найдена -->
    <div v-else-if="!article" class="not-found-state">
      <h1>Article not found</h1>
      <p>This article may have been moved or removed.</p>
      <router-link to="/blog" class="back-link">← Back to Blog</router-link>
    </div>

    <!-- Статья -->
    <article v-else class="blog-post">
      <router-link to="/blog" class="back-link">← Back to Blog</router-link>

      <header class="post-header">
        <div v-if="article.categories?.length" class="post-categories">
          <span v-for="cat in article.categories" :key="cat" class="post-category">{{ cat }}</span>
        </div>

        <h1>{{ article.title }}</h1>

        <div class="post-meta">
          <span v-if="article.author">{{ article.author }}</span>
          <span v-if="article.date">{{ formatDate(article.date) }}</span>
          <span v-if="article.readingTime">{{ article.readingTime }} min read</span>
        </div>

        <VImage
          v-if="article.featuredImage"
          :src="article.featuredImage"
          :alt="article.title"
          rounded
          cover
          class="post-featured-image"
        />
      </header>

      <div class="post-content">
        <template v-for="(section, index) in article.sections" :key="index">
          <!-- Вступление -->
          <section v-if="section.type === 'intro'" class="section-intro">
            <p>{{ section.content }}</p>
            <VImage v-if="section.image" :src="section.image" :alt="article.title" rounded />
          </section>

          <!-- Спецификации -->
          <section v-else-if="section.type === 'specs'" class="section-specs">
            <h2>{{ section.title }}</h2>
            <div class="specs-grid">
              <div v-for="item in section.items" :key="item.label" class="spec-item">
                <span class="spec-label">{{ item.label }}</span>
                <span class="spec-value">{{ item.value }}</span>
              </div>
            </div>
          </section>

          <!-- Плюсы и минусы -->
          <section v-else-if="section.type === 'pros-cons'" class="section-pros-cons">
            <h2>Pros & Cons</h2>
            <div class="pros-cons-grid">
              <div class="pros">
                <h3>✅ Pros</h3>
                <ul>
                  <li v-for="pro in section.pros" :key="pro">{{ pro }}</li>
                </ul>
              </div>
              <div class="cons">
                <h3>❌ Cons</h3>
                <ul>
                  <li v-for="con in section.cons" :key="con">{{ con }}</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Сравнение -->
          <section v-else-if="section.type === 'comparison'" class="section-comparison">
            <h2>{{ section.title }}</h2>
            <div class="comparison-table">
              <div class="comparison-row comparison-header">
                <div class="comparison-cell">Feature</div>
                <div v-for="product in section.products" :key="product.name" class="comparison-cell">
                  {{ product.name }}
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">Price</div>
                <div v-for="product in section.products" :key="product.name" class="comparison-cell">
                  {{ product.price }}
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">Build Volume</div>
                <div v-for="product in section.products" :key="product.name" class="comparison-cell">
                  {{ product.buildVolume }}
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">Speed</div>
                <div v-for="product in section.products" :key="product.name" class="comparison-cell">
                  {{ product.speed }}
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-cell">Multi-Color</div>
                <div v-for="product in section.products" :key="product.name" class="comparison-cell">
                  {{ product.multiColor }}
                </div>
              </div>
            </div>
            <div class="comparison-buy">
              <a
                v-for="product in section.products"
                :key="product.name"
                :href="product.link"
                target="_blank"
                rel="noopener noreferrer sponsored"
                class="buy-link"
              >
                Buy {{ product.name }}
              </a>
            </div>
          </section>

          <!-- Кнопка "Купить" -->
          <section v-else-if="section.type === 'buy-section'" class="section-buy">
            <h2>{{ section.title }}</h2>
            <VButton
              variant="primary"
              size="large"
              tag="a"
              :href="section.buttonLink"
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              {{ section.buttonText }}
            </VButton>
          </section>

          <!-- FAQ -->
          <section v-else-if="section.type === 'faq'" class="section-faq">
            <h2>{{ section.title }}</h2>
            <div class="faq-list">
              <details v-for="(item, i) in section.items" :key="i" class="faq-item">
                <summary class="faq-question">{{ item.question }}</summary>
                <p class="faq-answer">{{ item.answer }}</p>
              </details>
            </div>
          </section>

          <!-- Заключение -->
          <section v-else-if="section.type === 'conclusion'" class="section-conclusion">
            <h2>Conclusion</h2>
            <p>{{ section.content }}</p>
          </section>
        </template>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import VImage from '@/components/atoms/v-image/VImage.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'

const route = useRoute()
const article = ref(null)
const loading = ref(true)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const loadArticle = async (slug) => {
  loading.value = true
  article.value = null
  try {
    const response = await fetch(`/articles/${slug}.json`)
    if (!response.ok) throw new Error(`Article not found: ${slug}`)
    article.value = await response.json()
  } catch (error) {
    console.error('Article not found:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => loadArticle(route.params.slug))

// Переход между статьями (/blog/a → /blog/b) не пересоздаёт компонент —
// без watch старый контент просто останется висеть на экране
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) loadArticle(newSlug)
})
</script>

<style scoped>
.blog-post-page {
  min-height: 60vh;
}

.loading-state,
.not-found-state {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

.not-found-state h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.not-found-state p {
  color: #8a8aa0;
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 24px;
}

.back-link:hover {
  text-decoration: underline;
}

.blog-post {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.post-header {
  margin-bottom: 40px;
}

.post-header h1 {
  font-size: 38px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin: 8px 0 16px;
}

.post-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #8a8aa0;
  margin-bottom: 20px;
}

.post-featured-image {
  border-radius: 16px;
  overflow: hidden;
  max-height: 420px;
}

.post-categories {
  display: flex;
  gap: 8px;
}

.post-category {
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 12px;
  border-radius: 20px;
}

.section-faq {
  margin: 32px 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid #eaeef2;
  border-radius: 10px;
  padding: 14px 18px;
}

.faq-question {
  cursor: pointer;
  font-weight: 600;
  color: #1a1a2e;
}

.faq-answer {
  margin-top: 10px;
  color: #4a4a6a;
  line-height: 1.6;
}

/* Секции */
.section-intro p {
  font-size: 18px;
  line-height: 1.8;
  color: #4a4a6a;
}

.section-intro .v-image {
  margin-top: 20px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.spec-item {
  background: #f8f9fc;
  padding: 16px;
  border-radius: 12px;
}

.spec-label {
  display: block;
  font-size: 13px;
  color: #8a8aa0;
  font-weight: 600;
}

.spec-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-top: 4px;
}

.pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}

.pros h3 { color: #2e7d32; }
.cons h3 { color: #c62828; }

.pros ul, .cons ul {
  list-style: none;
  padding: 0;
}

.pros li, .cons li {
  padding: 4px 0;
  position: relative;
  padding-left: 20px;
}

.pros li::before {
  content: '✅';
  position: absolute;
  left: 0;
}

.cons li::before {
  content: '❌';
  position: absolute;
  left: 0;
}

.comparison-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.comparison-row {
  display: table-row;
}

.comparison-cell {
  display: table-cell;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeef2;
  font-size: 14px;
}

.comparison-header .comparison-cell {
  font-weight: 700;
  background: #f8f9fc;
}

.comparison-buy {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.buy-link {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.buy-link:hover {
  background: #45a049;
}

.section-buy {
  text-align: center;
  padding: 40px 0;
  background: #f8f9fc;
  border-radius: 16px;
  margin: 40px 0;
}

@media (max-width: 768px) {
  .post-header h1 {
    font-size: 28px;
  }

  .pros-cons-grid {
    grid-template-columns: 1fr;
  }

  .comparison-cell {
    font-size: 12px;
    padding: 8px 10px;
  }

  .comparison-buy {
    flex-direction: column;
  }
}
</style>
