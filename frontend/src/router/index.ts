import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/pages/HistoryPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/result/:id',
      name: 'result',
      component: () => import('@/pages/ResultPage.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/developers',
      name: 'devepopers',
      component: () => import('@/pages/DevelopersPage.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Проверяем требует ли маршрут авторизации
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Если пользователь авторизован и пытается попасть на страницу логина
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
