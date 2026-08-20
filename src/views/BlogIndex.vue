<template>
  <div class="blog-index">
    <VContainer>
      <div class="blog-header">
        <VTypography tag="h1" variant="h1" color="primary">
          ByteBuy Blog
        </VTypography>
        <VTypography tag="p" variant="body1" color="secondary">
          Reviews, comparisons, and guides to help you make the right choice
        </VTypography>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="loading" class="loading-state">
        <VTypography tag="p" variant="body1" color="secondary" align="center">
          Loading articles...
        </VTypography>
      </div>

      <!-- Список статей -->
      <div v-else-if="articles.length > 0" class="blog-grid">
        <router-link
          v-for="article in articles"
          :key="article.id"
          :to="`/blog/${article.slug}`"
          class="blog-card"
        >
          <div v-if="article.featuredImage" class="blog-card-image">
            <VImage :src="article.featuredImage" :alt="article.title" rounded contain />
          </div>
          <div class="blog-card-content">
            <div class="blog-card-meta">
              <span class="blog-card-date">{{ formatDate(article.date) }}</span>
              <span class="blog-card-reading">{{ article.readingTime }} min read</span>
            </div>
            <h2 class="blog-card-title">{{ article.title }}</h2>
            <p class="blog-card-excerpt">{{ article.metaDescription }}</p>
            <div class="blog-card-footer">
              <span v-for="cat in article.categories" :key="cat" class="blog-card-category">
                {{ cat }}
              </span>
              <span class="blog-card-read-more">Read more →</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="empty-state">
        <VTypography tag="p" variant="body1" color="secondary" align="center">
          No articles yet. Check back soon!
        </VTypography>
      </div>
    </VContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VTypography from '@/components/atoms/v-typography/VTypography.vue'
import VImage from '@/components/atoms/v-image/VImage.vue'

const articles = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    // Загружаем список статей из JSON-индекса
    const response = await fetch('/articles/index.json')
    if (!response.ok) throw new Error('Failed to load articles')
    articles.value = await response.json()
  } catch (error) {
    console.error('Error loading articles:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.blog-index {
  padding: 40px 0 60px;
}

.blog-header {
  margin-bottom: 40px;
  text-align: center;
}

.blog-header h1 {
  margin-bottom: 8px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.blog-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #eaeef2;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.blog-card-image {
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
  padding: 20px;
}

.blog-card-image .v-image {
  width: 100%;
  height: 100%;
}

.blog-card-image .v-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-card-content {
  padding: 20px 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #8a8aa0;
  margin-bottom: 8px;
}

.blog-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.blog-card-excerpt {
  font-size: 14px;
  color: #4a4a6a;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex: 1;
}

.blog-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.blog-card-category {
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 12px;
  border-radius: 20px;
}

.blog-card-read-more {
  font-size: 14px;
  font-weight: 500;
  color: #4CAF50;
}

.loading-state,
.empty-state {
  padding: 60px 0;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .blog-card-image {
    height: 160px;
  }
}
</style>
