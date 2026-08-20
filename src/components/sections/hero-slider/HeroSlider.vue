<template>
  <section class="hero-slider">
    <VContainer>
      <div class="slider-wrapper">
        <!-- Slides -->
        <div class="slides-container">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="slide"
            :class="{ 'slide--active': index === currentSlide }"
          >
            <div class="slide-content">
              <div class="slide-text">
                <div class="slide-badge">
                  <span class="badge-dot"></span>
                  {{ slide.badge }}
                </div>

                <h2 class="slide-title">
                  {{ slide.title }}
                </h2>

                <p class="slide-description">
                  {{ slide.description }}
                </p>

                <div class="slide-actions">
                  <VButton
                    variant="primary"
                    size="large"
                    tag="router-link"
                    :to="slide.buttonLink"
                  >
                    {{ slide.buttonText }}
                  </VButton>
                  <VButton
                    variant="link"
                    tag="a"
                    href="#"
                    class="slide-link"
                  >
                    {{ slide.linkText }} →
                  </VButton>
                </div>
              </div>

              <div class="slide-image">
                <div class="image-wrapper">
                  <VImage
                    :src="slide.image"
                    :alt="slide.title"
                    rounded
                    class="slide-img"
                  />
                  <div class="image-badge" v-if="slide.badgeText">
                    <span class="badge-discount">{{ slide.badgeText }}</span>
                    <span class="badge-label">Save</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicators -->
        <div class="slider-indicators">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            class="indicator"
            :class="{ 'indicator--active': index === currentSlide }"
            @click="goToSlide(index)"
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>

        <!-- Navigation buttons -->
        <button
          class="slider-nav slider-nav--prev"
          @click="prevSlide"
          aria-label="Previous slide"
        >
          <SvgIcon name="chevron-left" :width="20" :height="38" />
        </button>
        <button
          class="slider-nav slider-nav--next"
          @click="nextSlide"
          aria-label="Next slide"
        >
          <SvgIcon name="chevron-right" :width="20" :height="38" />
        </button>
      </div>
    </VContainer>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import VImage from '@/components/atoms/v-image/VImage.vue'
import SvgIcon from '@/components/atoms/svg-icon/SvgIcon.vue'

// ===== SLIDE DATA =====
const slides = ref([
  {
    id: 1,
    badge: '⚡ FAST DELIVERY — LIKE WIRED',
    title: 'Order now — get it fast. No wasted time.',
    description: 'Millions of products from verified sellers. ByteBuy finds the best prices and delivers to you — from 1 day.',
    buttonText: 'Browse catalog',
    buttonLink: '/catalog',
    linkText: 'Become a seller',
    image: new URL('@/assets/images/sld-1.png', import.meta.url).href,
    badgeText: '-50%'
  },
  {
    id: 2,
    badge: '🔥 HOT DEALS',
    title: 'Up to 70% off top products',
    description: 'Limited offer! Grab products with up to 70% discount. Only until the end of the week!',
    buttonText: 'View deals',
    buttonLink: '/catalog',
    linkText: 'All offers',
    image: new URL('@/assets/images/sld-2.png', import.meta.url).href,
    badgeText: '🔥 Hot'
  },
  {
    id: 3,
    badge: '📦 FREE DELIVERY',
    title: 'Free 1-day delivery from $12',
    description: 'Order products worth $12 or more and get free delivery anywhere in the world.',
    buttonText: 'Shop now',
    buttonLink: '/catalog',
    linkText: 'Learn more',
    image: new URL('@/assets/images/sld-3.png', import.meta.url).href,
    badgeText: '🚀'
  }
])

// ===== STATE =====
const currentSlide = ref(0)
let autoplayInterval = null

// ===== METHODS =====
const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

// ===== AUTOPLAY =====
const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* ===== MAIN STYLES ===== */
.hero-slider {
  position: relative;
  padding: 10px 0;
  background: #EAF7F2;
  overflow: hidden;
}

.hero-slider::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 78% 20%, rgba(46, 204, 145, 0.18), transparent 55%),
  radial-gradient(circle at 95% 70%, rgba(23, 169, 176, 0.16), transparent 50%);
  pointer-events: none;
}

.slider-wrapper {
  position: relative;
  overflow: hidden;
}

/* ===== SLIDES ===== */
.slides-container {
  position: relative;
  min-height: 330px;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.6s ease;
  visibility: hidden;
  padding: 0 30px;
}

.slide--active {
  opacity: 1;
  transform: translateX(0);
  visibility: visible;
  position: relative;
}

.slide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

/* ===== TEXT PART ===== */
.slide-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slide-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #D8ECE5;
  padding: 7px 14px 7px 10px;
  border-radius: 24px;
  font-size: 12.5px;
  font-weight: 700;
  color: #17A9B0;
  letter-spacing: .02em;
  margin-bottom: 22px;
  width: fit-content;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2ECC91;
  display: inline-block;
}

.slide-title {
  font-size: 38px;
  font-weight: 800;
  color: #2C4A5E;
  line-height: 1.2;
  margin: 0;
}

.slide-description {
  font-size: 16px;
  line-height: 1.6;
  color: #4B6470;
  margin: 0;
  max-width: 480px;
}

.slide-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.slide-link {
  font-weight: 700;
  font-size: 14px;
  color: #2C4A5E;
}

/* ===== IMAGE ===== */
.slide-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 680px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.slide-img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 2;
  object-fit: cover;
  display: block;
}

.image-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #F2660D;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(242, 102, 13, 0.3);
}

.badge-discount {
  display: block;
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
}

.badge-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  opacity: 0.9;
}

/* ===== INDICATORS ===== */
.slider-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 15px 0 0;
}

.indicator {
  width: 40px;
  height: 4px;
  border: none;
  border-radius: 4px;
  background: #D8ECE5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator--active {
  background: #2ECC91;
  width: 56px;
}

.indicator:hover {
  background: #17A9B0;
}

/* ===== NAVIGATION BUTTONS ===== */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  color: #2C4A5E;
  opacity: 0;
  background: none;
}

.slider-nav:hover {
  opacity: 0.8;
}

.hero-slider:hover .slider-nav {
  opacity: 1;
}

.slider-nav--prev {
  left: 8px;
}

.slider-nav--next {
  right: 8px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .slide-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .slide-image {
    order: -1;
  }

  .image-wrapper {
    max-width: 100%;
  }

  .slide-title {
    font-size: 32px;
  }

  .slide-description {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    padding: 24px 0;
  }

  .slide {
    padding: 24px 20px;
  }

  .slide-title {
    font-size: 26px;
  }

  .slide-description {
    font-size: 15px;
  }

  .slide-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .slide-actions .v-button {
    justify-content: center;
  }

  .slider-nav {
    width: 36px;
    height: 36px;
  }

  .slider-nav--prev {
    left: 4px;
  }

  .slider-nav--next {
    right: 4px;
  }

  .image-badge {
    padding: 8px 12px;
  }

  .badge-discount {
    font-size: 18px;
  }

  .badge-label {
    font-size: 10px;
  }

  .indicator {
    width: 32px;
  }

  .indicator--active {
    width: 44px;
  }
}

@media (max-width: 480px) {
  .slide {
    padding: 16px 12px;
  }

  .slide-title {
    font-size: 22px;
  }

  .slide-badge {
    font-size: 10px;
    padding: 4px 10px 4px 8px;
  }

  .slider-nav {
    width: 30px;
    height: 30px;
  }

  .slider-nav svg {
    width: 16px;
    height: 16px;
  }

  .image-badge {
    top: 10px;
    right: 10px;
    padding: 6px 10px;
  }

  .badge-discount {
    font-size: 16px;
  }

  .indicator {
    width: 24px;
    height: 3px;
  }

  .indicator--active {
    width: 36px;
  }

  .slides-container {
    min-height: 360px;
  }
}
</style>
