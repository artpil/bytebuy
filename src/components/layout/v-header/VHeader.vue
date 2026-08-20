<template>
  <header class="v-header" :class="{ 'v-header--scrolled': isScrolled }">
    <!-- TOP BAR -->
    <!--
     <TopBar />
     -->


    <!-- MAIN HEADER -->
    <div class="main-header">
      <VContainer>
        <div class="main-header-content">
          <!-- Logo -->
          <router-link to="/" class="logo">
            <SvgIcon name="logo-icon" :width="57" :height="47" class="logo__img"/>
            <SvgIcon name="logo-text" :width="138" :height="35" class="logo__text" />
          </router-link>

          <!-- Search -->
          <div class="search-wrapper">
            <div class="search" :class="{ 'search--focused': isSearchFocused }">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('search.placeholder')"
                class="search-input"
                @focus="isSearchFocused = true"
                @blur="isSearchFocused = false"
                @keyup.enter="handleSearch"
              />
              <button class="search-btn" @click="handleSearch">
                <span class="search-btn__text">{{ t('search.button') }}</span>
                <SvgIcon name="i-search" :width="138" :height="35" class="search-btn__icon" />
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="header-actions">
            <!--button class="action-btn action-btn--desktop" @click="toggleFavorites">
              <SvgIcon name="heart" :width="23" :height="23" />
              <span class="action-label">Favorites</span>
            </button-->

            <!--button class="action-btn" @click="toggleCart">
              <SvgIcon name="cart" :width="23" :height="23" />
              <span class="action-label">Cart</span>
              <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
            </button-->

            <!--VButton variant="primary" size="large" @click="toggleAuth">
              Sign in
            </VButton-->

            <!-- Language switcher -->
            <button class="lang-switch" @click="toggleLocale" :aria-label="t('nav.menu')">
              {{ currentLocale.toUpperCase() }}
            </button>

            <!-- Mobile menu -->
            <button class="mobile-menu-btn" @click="toggleMobileMenu" :aria-label="t('nav.menu')">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </VContainer>
    </div>

    <!-- CATEGORY STRIP -->
    <!--
    <div class="category-strip">
      <VContainer>
        <div class="category-strip-content">
          <div class="category-strip-scroll">
            <router-link
              v-for="shop in shopLinks"
              :key="shop.id"
              :to="shop.link"
              class="category-link"
              :class="{ 'category-link--active': shop.active }"
            >
              {{ shop.name }}
            </router-link>
          </div>
        </div>
      </VContainer>
    </div>
    -->
    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu" @click="closeMobileMenu">
      <div class="mobile-menu-content" @click.stop>
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">{{ t('nav.menu') }}</span>
          <button class="mobile-menu-close" @click="closeMobileMenu">✕</button>
        </div>
        <nav class="mobile-nav">
          <router-link to="/" @click="closeMobileMenu">{{ t('nav.home') }}</router-link>
          <router-link to="/catalog" @click="closeMobileMenu">{{ t('nav.catalog') }}</router-link>
          <router-link to="/blog" @click="closeMobileMenu">{{ t('nav.blog') }}</router-link>
          <router-link to="/about" @click="closeMobileMenu">{{ t('nav.about') }}</router-link>
          <router-link to="/contacts" @click="closeMobileMenu">{{ t('nav.contacts') }}</router-link>
        </nav>
        <div class="mobile-menu-footer">
          <a href="#" class="mobile-social-link">📱 Telegram</a>
          <a href="#" class="mobile-social-link">📸 Instagram</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import VContainer from '@/components/atoms/v-container/VContainer.vue'
import VButton from '@/components/atoms/v-button/VButton.vue'
import SvgIcon from '@/components/atoms/svg-icon/SvgIcon.vue'
import TopBar from '@/components/atoms/top-bar/TopBar.vue'
import { SHOPS } from '@/config/shops'
import { setLocale, SUPPORTED_LOCALES } from '@/i18n'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value)

// Простой переключатель по кругу: en → ru → en → ...
// Для 2 языков достаточно кнопки-тумблера, отдельный dropdown не нужен
const toggleLocale = () => {
  const currentIndex = SUPPORTED_LOCALES.indexOf(locale.value)
  const next = SUPPORTED_LOCALES[(currentIndex + 1) % SUPPORTED_LOCALES.length]
  setLocale(next)
}

// ===== STATE =====
const isScrolled = ref(false)
const isSearchFocused = ref(false)
const isMobileMenuOpen = ref(false)
const searchQuery = ref('')
const cartCount = ref(3)

// ===== CATEGORY STRIP — real shops, not fake generic categories =====
// Only shops with a working feed are shown, since shops with feed: null
// have no products to browse yet.
const shopLinks = computed(() => {
  const currentShop = route.params.shop

  return [
    { id: 'all', name: 'All Stores', link: '/catalog', active: !currentShop },
    ...SHOPS.filter((s) => s.feed).map((s) => ({
      id: s.slug,
      name: s.name,
      link: `/catalog/${s.slug}`,
      active: currentShop === s.slug,
    })),
  ]
})

// ===== HANDLERS =====
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/catalog', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

const toggleFavorites = () => {
  console.log('Favorites toggled')
}

const toggleCart = () => {
  console.log('Cart toggled')
}

const toggleAuth = () => {
  console.log('Auth toggled')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// ===== LIFECYCLE =====
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.v-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
}

/* ===== MAIN HEADER ===== */
.main-header {
  background: white;
  border-bottom: 1px solid #D8ECE5;
}

.main-header-content {
  display: flex;
  align-items: center;
  gap: 28px;
  height: 84px;
  justify-content: space-between;
}

/* ===== LOGO ===== */
.logo, .logo:hover {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  background: none;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: #1F2E38;
  letter-spacing: -0.5px;
}

.logo-text::after {
  content: '.';
  color: #2ECC91;
}

/* ===== SEARCH ===== */
.search-wrapper {
  flex: 1;
  max-width: 600px;
}

.search {
  display: flex;
  align-items: center;
  background: #EAF7F2;
  border: 2px solid transparent;
  border-radius: 14px;
  height: 52px;
  padding: 0 6px 0 18px;
  transition: border-color 0.15s ease;
}

.search--focused {
  border-color: #17A9B0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  font-family: inherit;
  color: #1F2E38;
}

.search-input::placeholder {
  color: #7C9C93;
}

.search-btn {
  height: 40px;
  padding: 0 22px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, #2ECC91, #17A9B0);
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 7px;
}

.search-btn:hover {
  opacity: 0.9;
}
.search-btn__icon{
  width: 20px;
  height: 20px;
}

/* ===== ACTIONS ===== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 600;
  color: #2C4A5E;
  position: relative;
  padding: 4px 0;
  transition: color 0.2s;
}
.action-btn img {
  transition: filter 0.2s;
  filter: invert(24%) sepia(6%) saturate(3709%) hue-rotate(161deg) brightness(95%) contrast(86%);
}

.action-btn:hover {
  color: #2ECC91;
}
.action-btn:hover img {
  filter: invert(74%) sepia(21%) saturate(1531%) hue-rotate(101deg) brightness(94%) contrast(74%);
}

.action-label {
  font-size: 11px;
}

.badge {
  position: absolute;
  top: -4px;
  right: -10px;
  background: #F2660D;
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  padding: 1px 6px;
}

/* ===== MOBILE MENU (button) ===== */
.lang-switch {
  background: #EAF7F2;
  border: none;
  border-radius: 10px;
  height: 36px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #2C4A5E;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.lang-switch:hover {
  background: #2ECC91;
  color: white;
}

.mobile-menu-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-menu-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: #1F2E38;
  transition: all 0.3s ease;
}

/* ===== CATEGORY STRIP ===== */
.category-strip {
  background: white;
  border-bottom: 1px solid #D8ECE5;
}

.category-strip-content {
  padding: 6px 0;
}

.category-strip-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
}

.category-strip-scroll::-webkit-scrollbar {
  height: 4px;
}

.category-strip-scroll::-webkit-scrollbar-thumb {
  background: #D8ECE5;
  border-radius: 4px;
}

.category-link {
  white-space: nowrap;
  font-size: 13.5px;
  font-weight: 600;
  color: #2C4A5E;
  padding: 8px 16px;
  border-radius: 24px;
  background: #EAF7F2;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.category-link:hover {
  background: #DCF2EA;
}

.category-link--active {
  background: #2C4A5E;
  color: white;
}

.category-link--active:hover {
  background: #1B3040;
}

/* ===== MOBILE MENU (dropdown) ===== */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-menu-content {
  background: white;
  width: 85%;
  max-width: 400px;
  height: 100%;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.mobile-menu-title {
  font-size: 20px;
  font-weight: 700;
  color: #1F2E38;
}

.mobile-menu-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4B6470;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.mobile-nav a {
  padding: 14px 0;
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  color: #1F2E38;
  border-bottom: 1px solid #f0f0f5;
  transition: color 0.2s;
}

.mobile-nav a:hover {
  color: #2ECC91;
}

.mobile-menu-footer {
  display: flex;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #eaeef2;
}

.mobile-social-link {
  text-decoration: none;
  color: #4a4a6a;
  font-size: 15px;
  transition: color 0.2s;
}

.mobile-social-link:hover {
  color: #2ECC91;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .main-header-content {
    gap: 16px;
  }

  .search-wrapper {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .main-header-content {
    height: 64px;
    gap: 12px;
  }
  .logo__text{
    display: none;
  }
  .logo__img{
    height: 36px;
    width: 44px;
  }

  .search-wrapper {
    flex: 1;
    max-width: 100%;
  }

  .search {
    height: 40px;
    border-radius: 10px;
    padding: 0 4px 0 14px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-btn {
    height: 32px;
    padding: 0 16px;
    font-size: 13px;
  }

  .search-btn__text{
    display: none;
  }


  .action-btn--desktop {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .category-link {
    font-size: 12px;
    padding: 6px 14px;
  }

  .logo-text {
    font-size: 18px;
  }

  .v-header {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .main-header {

  }

  .main-header-content {
    height: 56px;
    gap: 8px;
  }

  .search {
    height: 34px;
    border-radius: 8px;
    padding: 0 4px 0 10px;
  }

  .search-input {
    font-size: 13px;
  }

  .search-btn {
    height: 28px;
    padding: 0 12px;
    font-size: 12px;
  }

  .logo-text {
    font-size: 16px;
  }

  .action-btn {
    font-size: 10px;
  }

  .badge {
    font-size: 8px;
    padding: 0 4px;
    right: -6px;
    top: -2px;
  }

  .category-link {
    font-size: 11px;
    padding: 4px 12px;
  }
}
</style>
