<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, X, Home, Upload, History, Sun, Moon, LogOut, FileText, User } from 'lucide-vue-next'

const isDarkMode = inject('isDarkMode', ref(false))
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

// Навигационные элементы
const navigationItems = [
  {
    name: 'Главная',
    path: '/',
    icon: Home,
  },
  {
    name: 'История',
    path: '/history',
    icon: History,
  },
]

// Переключение темы
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  updateTheme()
}

const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Переключение мобильного меню
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Закрытие мобильного меню при навигации
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Выход из системы
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  closeMobileMenu()
}

// Проверка активного маршрута
const isActiveRoute = (path: string) => {
  return route.path === path
}
</script>

<template>
  <nav
    :class="[
      'sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300',
      isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Логотип -->
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg',
            ]"
          >
            <FileText class="w-6 h-6 text-white" />
          </div>
          <div class="hidden sm:block">
            <h1 :class="['text-xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">
              TechCheck
            </h1>
            <p :class="['text-xs font-mono', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
              v1.0
            </p>
          </div>
        </div>

        <!-- Десктопная навигация -->
        <div class="hidden md:flex items-center space-x-1">
          <div v-for="item in navigationItems" :key="item.path" class="relative">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActiveRoute(item.path)
                  ? isDarkMode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-600 text-white shadow-lg'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ]"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.name }}</span>
            </router-link>
          </div>
        </div>

        <!-- Правая часть навигации -->
        <div class="flex items-center space-x-3">
          <!-- Переключатель темы -->
          <button
            @click="toggleTheme"
            :class="[
              'p-2 rounded-lg transition-colors duration-200',
              isDarkMode
                ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800'
                : 'text-gray-500 hover:text-orange-500 hover:bg-gray-100',
            ]"
            title="Переключить тему"
          >
            <Sun v-if="isDarkMode" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <!-- Информация о пользователе (десктоп) -->
          <div class="hidden md:flex items-center space-x-3">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700',
              ]"
            >
              <User class="w-4 h-4" />
            </div>
            <div class="flex flex-col">
              <span :class="['text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">
                {{ authStore.user?.name || 'Пользователь' }}
              </span>
              <button
                @click="handleLogout"
                :class="[
                  'text-xs text-left hover:underline transition-colors duration-200',
                  isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700',
                ]"
              >
                Выйти
              </button>
            </div>
          </div>

          <!-- Кнопка мобильного меню -->
          <button
            @click="toggleMobileMenu"
            :class="[
              'md:hidden p-2 rounded-lg transition-colors duration-200',
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        :class="[
          'md:hidden border-t backdrop-blur-sm',
          isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200',
        ]"
      >
        <div class="px-4 py-4 space-y-2">
          <!-- Мобильная навигация -->
          <div v-for="item in navigationItems" :key="item.path" class="block">
            <router-link
              :to="item.path"
              @click="closeMobileMenu"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                isActiveRoute(item.path)
                  ? isDarkMode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-600 text-white shadow-lg'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </router-link>
          </div>

          <!-- Разделитель -->
          <div :class="['my-4 border-t', isDarkMode ? 'border-gray-700' : 'border-gray-200']"></div>

          <!-- Информация о пользователе (мобильная) -->
          <div class="px-4 py-3">
            <div class="flex items-center space-x-3 mb-3">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-base font-medium',
                  isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700',
                ]"
              >
                <User class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <p :class="['text-base font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">
                  {{ authStore.user?.name || 'Пользователь' }}
                </p>
                <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ authStore.user?.email }}
                </p>
              </div>
            </div>
            <button
              @click="handleLogout"
              :class="[
                'w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                isDarkMode
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700',
              ]"
            >
              <LogOut class="w-4 h-4" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>
