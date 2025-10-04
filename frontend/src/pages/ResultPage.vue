<script setup lang="ts">
import { inject, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, handleApiError, type DetailedResult } from '@/services/api'
import {
  History,
  Download,
  FileDown,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-vue-next'

const props = defineProps<{
  id: string
}>()

const isDarkMode = inject('isDarkMode', ref(false))
const route = useRoute()
const router = useRouter()

const result = ref<DetailedResult | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isProcessing = ref(false) // Добавляем состояние обработки

const resultId = computed(() => props.id || (route.params.id as string))

const loadResult = async () => {
  try {
    console.log('Loading result with ID:', resultId.value)
    const detailedResult = await api.getResult(resultId.value)

    // Проверяем статус
    if (detailedResult && (detailedResult as any).status === 'processing') {
      isProcessing.value = true
      // Автоматическое обновление через интервал
      const pollForResult = async () => {
        try {
          const updatedResult = await api.getResult(resultId.value)
          if (updatedResult && (updatedResult as any).status !== 'processing') {
            result.value = updatedResult
            isProcessing.value = false
          } else {
            setTimeout(pollForResult, 3000) // Проверяем каждые 3 секунды
          }
        } catch (err) {
          console.error('Polling error:', err)
          const errorMessage = handleApiError(err)
          error.value = `Ошибка при проверке статуса: ${errorMessage}`
          isProcessing.value = false
        }
      }
      setTimeout(pollForResult, 3000)
    } else {
      result.value = detailedResult
    }
  } catch (err) {
    console.error('Error loading result:', err)
    const errorMessage = handleApiError(err)
    error.value = `Ошибка при загрузке результата: ${errorMessage}`
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadResult()
})

const goBack = () => {
  router.back()
}

const goToHistory = () => {
  router.push('/history')
}

const goToHome = () => {
  router.push('/')
}

// Функция для получения цвета иконки нарушения
const getSeverityColor = (count: number) => {
  if (isDarkMode.value) {
    if (count <= 3) return 'text-yellow-400'
    if (count <= 10) return 'text-orange-400'
    return 'text-red-400'
  } else {
    if (count <= 3) return 'text-yellow-600'
    if (count <= 10) return 'text-orange-600'
    return 'text-red-600'
  }
}

// Функция для скачивания файла с аннотациями
const downloadAnnotatedFile = async () => {
  try {
    const blob = await api.downloadAnnotatedFile(resultId.value)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `annotated_${result.value?.filename || `document_${resultId.value}`}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading annotated file:', error)
    const errorMessage = handleApiError(error)
    alert(`Ошибка скачивания аннотированного файла: ${errorMessage}`)
  }
}

// Функция для скачивания исходного файла
const downloadOriginalFile = async () => {
  try {
    const blob = await api.downloadFile(resultId.value)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = result.value?.filename || `document_${resultId.value}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading original file:', error)
    const errorMessage = handleApiError(error)
    alert(`Ошибка скачивания файла: ${errorMessage}`)
  }
}

// Функция для форматирования даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Функция для получения описания ошибки из отчета
const getErrorDescription = (errorPoint: string) => {
  if (!result.value?.full_report) return ''

  const lines = result.value.full_report.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line && line.includes(errorPoint)) {
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const currentLine = lines[j]
        if (currentLine?.trim().startsWith('-')) {
          return currentLine.trim().substring(2)
        }
      }
    }
  }
  return `Нарушение в пункте ${errorPoint}`
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Navigation -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <button
          @click="goBack"
          :class="[
            'inline-flex items-center text-sm font-medium transition-colors',
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700',
          ]"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад
        </button>

        <button
          @click="goToHistory"
          :class="[
            'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          <History class="w-4 h-4 mr-2" />
          Все проверки
        </button>
      </div>
    </div>

    <!-- Title -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center space-x-3 mb-4">
        <div>
          <h1 :class="['text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">
            Результат Анализа
          </h1>
          <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            Детальный отчет о проверке документации
          </p>
        </div>
      </div>
    </div>

    <!-- Processing State -->
    <div v-if="isProcessing" class="max-w-2xl mx-auto">
      <div
        :class="[
          'rounded-lg border p-8 text-center',
          isDarkMode
            ? 'bg-blue-900/20 border-blue-800 text-blue-400'
            : 'bg-blue-50 border-blue-200 text-blue-600',
        ]"
      >
        <Clock class="w-12 h-12 mx-auto mb-4" />
        <h3 :class="['text-lg font-medium mb-2', isDarkMode ? 'text-blue-300' : 'text-blue-800']">
          В обработке
        </h3>
        <p class="mb-6">Ваш документ находится в процессе анализа. Пожалуйста, подождите.</p>
        <div class="space-x-4">
          <button
            @click="goToHistory"
            :class="[
              'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            <History class="w-4 h-4 mr-2" />
            Все проверки
          </button>
          <button
            @click="goToHome"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Новая проверка
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="result && !isLoading && !error" class="space-y-8">
      <!-- Document Info -->
      <div
        :class="[
          'p-6 rounded-lg border',
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        ]"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 :class="['font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700']">Файл</h3>
            <p :class="['mt-1', isDarkMode ? 'text-white' : 'text-gray-900']">
              {{ result.filename }}
            </p>
          </div>
          <div>
            <h3 :class="['font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700']">
              Дата загрузки
            </h3>
            <p :class="['mt-1', isDarkMode ? 'text-white' : 'text-gray-900']">
              {{ formatDate(result.upload_date) }}
            </p>
          </div>
          <div>
            <h3 :class="['font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-700']">
              Нарушений
            </h3>
            <p
              :class="[
                'mt-1 text-lg font-bold',
                result.total_violations > 0
                  ? isDarkMode
                    ? 'text-red-400'
                    : 'text-red-600'
                  : isDarkMode
                    ? 'text-green-400'
                    : 'text-green-600',
              ]"
            >
              {{ result.total_violations }}
            </p>
          </div>
        </div>
      </div>

      <!-- Download Buttons -->
      <div class="flex flex-wrap gap-4">
        <button
          @click="downloadAnnotatedFile"
          :class="[
            'inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px]',
            isDarkMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-green-600 text-white hover:bg-green-700',
          ]"
        >
          <FileDown class="w-4 h-4 mr-2" />
          Скачать файл с ошибками
        </button>
        <button
          @click="downloadOriginalFile"
          :class="[
            'inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px]',
            isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          ]"
        >
          <Download class="w-4 h-4 mr-2" />
          Скачать исходный файл
        </button>
      </div>

      <!-- Error Points -->
      <div
        :class="[
          'p-6 rounded-lg border',
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        ]"
      >
        <h2 :class="['text-xl font-bold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">
          Детали анализа
        </h2>
        <div v-if="result.error_points.length === 0" class="text-center py-8">
          <CheckCircle
            :class="['w-12 h-12 mx-auto mb-4', isDarkMode ? 'text-green-400' : 'text-green-600']"
          />
          <p :class="['text-lg', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
            Нарушений не обнаружено
          </p>
          <p :class="['text-sm mt-2', isDarkMode ? 'text-gray-500' : 'text-gray-500']">
            Документ соответствует всем требованиям
          </p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(errorPoint, index) in result.error_points"
            :key="index"
            :class="['p-4 rounded-lg border', isDarkMode ? 'border-gray-700' : 'border-gray-200']"
          >
            <div class="flex items-start">
              <AlertTriangle
                :class="[
                  'w-5 h-5 mr-3 mt-0.5 flex-shrink-0',
                  getSeverityColor(result.error_counts[errorPoint] || 0),
                ]"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">
                    Пункт {{ errorPoint }}
                  </h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getSeverityColor(result.error_counts[errorPoint] || 0),
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
                    ]"
                  >
                    {{ result.error_counts[errorPoint] || 0 }} шт.
                  </span>
                </div>
                <p :class="['mt-2', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                  {{ getErrorDescription(errorPoint) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Report -->
      <div
        v-if="result.full_report"
        :class="[
          'p-6 rounded-lg border',
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        ]"
      >
        <h2 :class="['text-xl font-bold mb-4', isDarkMode ? 'text-white' : 'text-gray-900']">
          Полный отчет
        </h2>
        <pre
          :class="[
            'whitespace-pre-wrap break-words p-4 rounded-lg font-mono text-sm',
            isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700',
          ]"
          >{{ result.full_report }}</pre
        >
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !isLoading" class="max-w-2xl mx-auto">
      <div
        :class="[
          'rounded-lg border p-8 text-center',
          isDarkMode
            ? 'bg-red-900/20 border-red-800 text-red-400'
            : 'bg-red-50 border-red-200 text-red-600',
        ]"
      >
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 :class="['text-lg font-medium mb-2', isDarkMode ? 'text-red-300' : 'text-red-800']">
          Ошибка загрузки
        </h3>
        <p class="mb-6">{{ error }}</p>
        <div class="space-x-4">
          <button
            @click="goToHistory"
            :class="[
              'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            <History class="w-4 h-4 mr-2" />
            Все проверки
          </button>
          <button
            @click="goToHome"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Новая проверка
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="flex justify-center items-center py-12">
      <div class="flex items-center space-x-3">
        <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Загрузка результата...
        </span>
      </div>
    </div>
  </div>
</template>
