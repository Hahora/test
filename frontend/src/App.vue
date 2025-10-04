<!-- В вашем App.vue добавьте логирование -->
<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navigation from './components/Navigation.vue'

const isDarkMode = ref(false)
const authStore = useAuthStore()

// Provide theme state to child components
provide('isDarkMode', isDarkMode)

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

onMounted(() => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  updateTheme()

  console.log('Before initAuth - isAuthenticated:', authStore.isAuthenticated)
  console.log('Before initAuth - user:', authStore.user)

  // Initialize auth state
  authStore.initAuth()

  console.log('After initAuth - isAuthenticated:', authStore.isAuthenticated)
  console.log('After initAuth - user:', authStore.user)
})
</script>
<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50',
    ]"
  >
    <!-- Navigation - показываем только для авторизованных пользователей -->
    <Navigation v-if="authStore.isAuthenticated" />

    <!-- Main Content -->
    <div :class="['container mx-auto px-4', authStore.isAuthenticated ? 'py-8' : '']">
      <!-- Technical Grid Background - только для авторизованных -->
      <div v-if="authStore.isAuthenticated" class="relative">
        <div
          :class="[
            'absolute inset-0 opacity-5 pointer-events-none',
            'bg-grid-pattern',
            isDarkMode ? 'text-blue-400' : 'text-blue-600',
          ]"
        ></div>

        <!-- Router View -->
        <div class="relative z-10">
          <RouterView />
        </div>
      </div>

      <!-- Router View для неавторизованных (страница логина) -->
      <div v-else>
        <RouterView />
      </div>

      <!-- Technical Footer Pattern - только для авторизованных -->
      <div v-if="authStore.isAuthenticated" class="mt-16 text-center">
        <div
          :class="[
            'inline-flex items-center space-x-2 text-xs font-mono',
            isDarkMode ? 'text-gray-500' : 'text-gray-400',
          ]"
        ></div>

        <div class="mt-2">
          <a
            href="/developers"
            :class="[
              'text-xs font-mono transition-opacity hover:opacity-75',
              isDarkMode
                ? 'text-gray-500 hover:text-gray-400'
                : 'text-gray-400 hover:text-gray-500',
            ]"
          >
            Developed by M2 Syndicate [HDD]
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.bg-grid-pattern {
  background-image:
    linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(90deg, currentColor 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
