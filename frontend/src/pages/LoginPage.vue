<script setup lang="ts">
import { inject, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, User, Lock, ArrowRight, Sun, Moon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { api, handleApiError } from '@/services/api'

const isDarkMode = inject('isDarkMode', ref(false))
const router = useRouter()
const authStore = useAuthStore()

// Form state with login and password fields
const form = reactive({
  login: '',
  password: '',
})

// UI state
const isLoading = ref(false)
const showPassword = ref(false)
const errors = reactive({
  login: '',
  password: '',
  general: '',
})

// Theme toggle
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

// Login validation
const validateLogin = (login: string) => {
  return login.trim().length >= 3
}

// Handle form submission with POST request to /login
const handleSubmit = async () => {
  // Clear previous errors
  errors.login = ''
  errors.password = ''
  errors.general = ''

  // Client-side validation
  let hasErrors = false

  if (!form.login.trim()) {
    errors.login = 'Введите логин'
    hasErrors = true
  } else if (!validateLogin(form.login)) {
    errors.login = 'Логин должен содержать минимум 3 символа'
    hasErrors = true
  }

  if (!form.password) {
    errors.password = 'Введите пароль'
    hasErrors = true
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов'
    hasErrors = true
  }

  if (hasErrors) return

  isLoading.value = true

  try {
    // Send POST request to /login with JSON body { "login": "string", "password": "string" }
    const response = await api.login(form.login.trim(), form.password)

    // JWT token is automatically stored by the API service
    // Store user data in auth store
    authStore.login(response.user)

    // Redirect to main application
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)

    // Handle different types of API errors
    const errorMessage = handleApiError(error)

    if (errorMessage.includes('401') || errorMessage.includes('Authentication failed')) {
      errors.general = 'Неверный логин или пароль'
    } else if (errorMessage.includes('Network error')) {
      errors.general = 'Ошибка сети. Проверьте подключение к интернету'
    } else if (errorMessage.includes('400')) {
      errors.general = 'Некорректные данные для входа'
    } else if (errorMessage.includes('500')) {
      errors.general = 'Ошибка сервера. Попробуйте позже'
    } else {
      errors.general = errorMessage || 'Ошибка авторизации. Попробуйте еще раз'
    }
  } finally {
    isLoading.value = false
  }
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Clear specific error when user starts typing
const clearError = (field: keyof typeof errors) => {
  errors[field] = ''
}

// Clear general error when user modifies any field
const clearGeneralError = () => {
  if (errors.general) {
    errors.general = ''
  }
}

// Обработчик ввода для поля логина
const handleLoginInput = () => {
  clearError('login')
  clearGeneralError()
}

// Обработчик ввода для поля пароля
const handlePasswordInput = () => {
  clearError('password')
  clearGeneralError()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 relative">
    <!-- Theme toggle button -->
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
      <button
        @click="toggleTheme"
        :class="[
          'p-2 sm:p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border',
          'hover:scale-110 active:scale-95',
          isDarkMode
            ? 'bg-gray-800/80 border-gray-700 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700/80'
            : 'bg-white/80 border-gray-200 text-orange-500 hover:text-orange-600 hover:bg-gray-50/80',
        ]"
        title="Переключить тему"
      >
        <Sun v-if="isDarkMode" class="w-5 h-5 sm:w-6 sm:h-6" />
        <Moon v-else class="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>

    <!-- Background grid pattern -->
    <div
      :class="[
        'absolute inset-0 opacity-5 pointer-events-none',
        'bg-grid-pattern',
        isDarkMode ? 'text-blue-400' : 'text-blue-600',
      ]"
    ></div>

    <!-- Login form container -->
    <div class="w-full max-w-md relative z-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6 shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1
          :class="[
            'text-2xl sm:text-3xl font-bold mb-2',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          Добро пожаловать
        </h1>
        <p :class="['text-sm sm:text-base', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Войдите в систему технической проверки
        </p>
      </div>

      <!-- Login form -->
      <div
        :class="[
          'p-6 sm:p-8 rounded-2xl border backdrop-blur-sm',
          isDarkMode
            ? 'bg-gray-800/50 border-gray-700 shadow-2xl'
            : 'bg-white/50 border-gray-200 shadow-xl',
        ]"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- General error message -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 transform -translate-y-1"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-1"
          >
            <div
              v-if="errors.general"
              :class="[
                'p-3 rounded-lg border flex items-center space-x-2',
                'bg-red-50 border-red-200 text-red-700',
                isDarkMode && 'bg-red-900/20 border-red-800 text-red-400',
              ]"
            >
              <svg
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm">{{ errors.general }}</span>
            </div>
          </Transition>

          <!-- Login field -->
          <div class="space-y-2">
            <label
              for="login"
              :class="['block text-sm font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700']"
            >
              Логин
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User
                  :class="[
                    'w-5 h-5 transition-colors duration-200',
                    errors.login ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-400',
                  ]"
                />
              </div>
              <input
                id="login"
                v-model="form.login"
                @input="handleLoginInput"
                type="text"
                autocomplete="username"
                placeholder="Введите логин"
                :class="[
                  'block w-full pl-10 pr-3 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  errors.login
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-white',
                ]"
              />
            </div>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 transform -translate-y-1"
              enter-to-class="opacity-100 transform translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform -translate-y-1"
            >
              <p v-if="errors.login" class="text-sm text-red-500 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ errors.login }}</span>
              </p>
            </Transition>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label
              for="password"
              :class="['block text-sm font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700']"
            >
              Пароль
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock
                  :class="[
                    'w-5 h-5 transition-colors duration-200',
                    errors.password
                      ? 'text-red-500'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-400',
                  ]"
                />
              </div>
              <input
                id="password"
                v-model="form.password"
                @input="handlePasswordInput"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Введите пароль"
                :class="[
                  'block w-full pl-10 pr-12 py-3 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-white',
                ]"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabindex="-1"
              >
                <EyeOff
                  v-if="showPassword"
                  :class="[
                    'w-5 h-5 transition-colors duration-200 hover:scale-110',
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-600',
                  ]"
                />
                <Eye
                  v-else
                  :class="[
                    'w-5 h-5 transition-colors duration-200 hover:scale-110',
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-600',
                  ]"
                />
              </button>
            </div>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 transform -translate-y-1"
              enter-to-class="opacity-100 transform translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform -translate-y-1"
            >
              <p v-if="errors.password" class="text-sm text-red-500 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ errors.password }}</span>
              </p>
            </Transition>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-offset-gray-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-offset-white',
              isLoading ? 'transform scale-95' : 'hover:transform hover:scale-105 active:scale-95',
            ]"
          >
            <div v-if="isLoading" class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Вход в систему...</span>
            </div>
            <div v-else class="flex items-center space-x-2">
              <span>Войти</span>
              <ArrowRight
                class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
          </button>
        </form>
      </div>

      <!-- Technical footer -->
      <div class="mt-8 text-center">
        <div
          :class="[
            'inline-flex items-center space-x-2 text-xs font-mono',
            isDarkMode ? 'text-gray-500' : 'text-gray-400',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>
