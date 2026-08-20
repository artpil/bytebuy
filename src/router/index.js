import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home-page/index.vue')
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('@/pages/catalog-page/index.vue'),
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import('@/pages/product-page/index.vue'),
  },
  // {
  //   path: '/catalog',
  //   name: 'Catalog',
  //   component: () => import('@/pages/catalog-page/index.vue')
  // },
  // {
  //   path: '/catalog/:slug',
  //   name: 'Category',
  //   component: () => import('@/pages/category-page/index.vue')
  // },
  // {
  //   path: '/product/:id',
  //   name: 'Product',
  //   component: () => import('@/pages/product-page/index.vue')
  // },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/BlogIndex.vue')
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('@/views/BlogPost.vue'),
    props: true,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/pages/about-page/index.vue')
  // },
  // {
  //   path: '/contacts',
  //   name: 'Contacts',
  //   component: () => import('@/pages/contacts-page/index.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
