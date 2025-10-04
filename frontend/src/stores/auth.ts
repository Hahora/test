import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, checkAuthStatus } from '@/services/api'

export interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Initialize auth state from stored token
  const initAuth = () => {
    if (checkAuthStatus()) {
      isAuthenticated.value = true

      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          logout()
        }
      }
    } else {
      logout()
    }
  }

  // Login user
  const login = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    // Store user data for persistence
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Logout user
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    // Clear stored user data
    localStorage.removeItem('user')
    // Clear JWT token via API
    api.logout()
  }

  // Check if user is authenticated
  const checkAuth = () => {
    return api.isAuthenticated()
  }

  // Автоматически инициализировать аутентификацию при создании store
  initAuth()

  return {
    user,
    isAuthenticated,
    initAuth,
    login,
    logout,
    checkAuth,
  }
})
