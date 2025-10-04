<script setup lang="ts">
import { inject, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FileUpload from '../components/FileUpload.vue'
import { Check } from 'lucide-vue-next'
import { File } from 'lucide-vue-next'
import { ChartColumnIncreasing } from 'lucide-vue-next'
import { Clock } from 'lucide-vue-next'

const isDarkMode = inject('isDarkMode', ref(false))
const router = useRouter()

// Тип для результатов проверки - должен совпадать с типом в FileUpload
interface CheckResult {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  status: 'checking' | 'compliant' | 'non-compliant' | 'processing'
  violations: Array<{
    gostNumber: string
    section: string
    description: string
    severity: 'critical' | 'warning' | 'info'
  }>
  complianceScore: number
}

// Состояния для отображения процесса анализа
const isAnalyzing = ref(false)
const analyzingFiles = ref<CheckResult[]>([])
const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

const handleFilesChecked = (results: CheckResult[]) => {
  console.log('HomePage: Received results:', results) // Отладка

  // Проверяем, есть ли файлы в состоянии processing
  const processingFiles = results.filter((result) => result.status === 'processing')

  if (processingFiles.length > 0) {
    isAnalyzing.value = true
    analyzingFiles.value = processingFiles

    // Начинаем автоматическое обновление каждые 10 секунд
    startPolling()
  } else {
    // Если нет файлов в обработке, переходим на страницу истории
    router.push('/history')
  }
}

const startPolling = () => {
  // Очищаем предыдущий интервал, если он был
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }

  // Запускаем интервал для обновления статусов
  intervalId.value = setInterval(async () => {
    try {
      // Обновляем статусы всех файлов в обработке
      const updatedFiles = await Promise.all(
        analyzingFiles.value.map(async (file) => {
          try {
            return file
          } catch (error) {
            console.error('Error updating file status:', error)
            return file
          }
        }),
      )

      // Обновляем список файлов
      analyzingFiles.value = updatedFiles.filter((file) => file.status === 'processing')

      // Если нет файлов в обработке, останавливаем опрос и переходим на страницу истории
      if (analyzingFiles.value.length === 0) {
        stopPolling()
        router.push('/history')
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 10000) // 10 секунд
}

const stopPolling = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

// Очищаем интервал при размонтировании компонента
onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <!-- Title Section -->
    <div class="text-center mb-6 sm:mb-8 lg:mb-12">
      <div class="mb-4 sm:mb-6">
        <h1
          :class="[
            'text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          Анализ Технической Документации
        </h1>
        <p
          :class="[
            'text-sm sm:text-base lg:text-lg px-2 sm:px-0',
            isDarkMode ? 'text-gray-400' : 'text-gray-600',
          ]"
        >
          Загрузите документы для проверки соответствия ГОСТ стандартам
        </p>
      </div>

      <!-- Technical Features -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
        <div
          :class="[
            'p-3 sm:p-4 lg:p-6 rounded-lg border',
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4',
              isDarkMode ? 'bg-green-600' : 'bg-green-100',
            ]"
          >
            <Check
              :class="[
                'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6',
                isDarkMode ? 'text-white' : 'text-green-600',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            />
          </div>
          <h3
            :class="[
              'font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base',
              isDarkMode ? 'text-gray-200' : 'text-gray-900',
            ]"
          >
            Автоматическая проверка
          </h3>
          <p
            :class="[
              'text-xs sm:text-xs lg:text-sm leading-relaxed',
              isDarkMode ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            Быстрый анализ соответствия ГОСТ стандартам
          </p>
        </div>

        <div
          :class="[
            'p-3 sm:p-4 lg:p-6 rounded-lg border',
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4',
              isDarkMode ? 'bg-blue-600' : 'bg-blue-100',
            ]"
          >
            <File
              :class="[
                'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6',
                isDarkMode ? 'text-white' : 'text-blue-600',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            />
          </div>
          <h3
            :class="[
              'font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base',
              isDarkMode ? 'text-gray-200' : 'text-gray-900',
            ]"
          >
            Множественная загрузка
          </h3>
          <p
            :class="[
              'text-xs sm:text-xs lg:text-sm leading-relaxed',
              isDarkMode ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            PDF файлов
          </p>
        </div>

        <div
          :class="[
            'p-3 sm:p-4 lg:p-6 rounded-lg border',
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200',
          ]"
        >
          <div
            :class="[
              'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4',
              isDarkMode ? 'bg-purple-600' : 'bg-purple-100',
            ]"
          >
            <ChartColumnIncreasing
              :class="[
                'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6',
                isDarkMode ? 'text-white' : 'text-purple-600',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            />
          </div>
          <h3
            :class="[
              'font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base',
              isDarkMode ? 'text-gray-200' : 'text-gray-900',
            ]"
          >
            Детальные отчеты
          </h3>
          <p
            :class="[
              'text-xs sm:text-xs lg:text-sm leading-relaxed',
              isDarkMode ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            Подробный анализ нарушений
          </p>
        </div>
      </div>
    </div>

    <!-- File Upload Section -->
    <div class="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto">
      <FileUpload @files-checked="handleFilesChecked" />
    </div>

    <!-- Analysis Status Section -->
    <div v-if="isAnalyzing" class="max-w-2xl mx-auto mt-8">
      <div
        :class="[
          'rounded-lg border p-6 text-center',
          isDarkMode
            ? 'bg-blue-900/20 border-blue-800 text-blue-400'
            : 'bg-blue-50 border-blue-200 text-blue-600',
        ]"
      >
        <Clock class="w-12 h-12 mx-auto mb-4" />
        <h3 :class="['text-lg font-medium mb-2', isDarkMode ? 'text-blue-300' : 'text-blue-800']">
          Идет анализ документов
        </h3>
        <p class="mb-4">Ваши документы находятся в процессе анализа. Пожалуйста, подождите.</p>

        <!-- Список файлов в обработке -->
        <div class="text-left mb-4">
          <h4 :class="['font-medium mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
            Файлы в обработке:
          </h4>
          <ul class="space-y-2">
            <li
              v-for="file in analyzingFiles"
              :key="file.id"
              :class="[
                'flex items-center p-2 rounded',
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100',
              ]"
            >
              <div class="flex items-center justify-center w-6 h-6 mr-2">
                <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
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
              </div>
              <span :class="['truncate', isDarkMode ? 'text-gray-200' : 'text-gray-800']">
                {{ file.fileName }}
              </span>
            </li>
          </ul>
        </div>

        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Обновление статуса каждые 10 секунд...
        </p>
      </div>
    </div>
  </div>
</template>
