<script setup lang="ts">
import { inject, ref } from 'vue'
import { History } from 'lucide-vue-next'
import { Check } from 'lucide-vue-next'

interface CheckResult {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  status: 'checking' | 'compliant' | 'non-compliant'
  violations: Array<{
    gostNumber: string
    section: string
    description: string
    severity: 'critical' | 'warning' | 'info'
  }>
  complianceScore: number
}

defineProps<{
  result: CheckResult
}>()

const isDarkMode = inject('isDarkMode', ref(false))

const getSeverityColor = (severity: string) => {
  if (isDarkMode.value) {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'info':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  } else {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'info':
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}
</script>

<template>
  <div
    :class="[
      'rounded-lg shadow-sm border backdrop-blur-sm',
      isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200',
    ]"
  >
    <!-- Заголовок -->
    <div :class="['p-6 border-b', isDarkMode ? 'border-gray-700' : 'border-gray-200']">
      <div class="flex items-center space-x-3">
        <div
          :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isDarkMode ? 'bg-green-600' : 'bg-green-600',
          ]"
        >
          <Check class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          </Check>
        </div>
        <h2 :class="['text-xl font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">
          Результаты анализа
        </h2>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Информация о файле -->
      <div
        :class="[
          'rounded-lg p-4 border',
          isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 :class="['font-medium', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
            {{ result.fileName }}
          </h3>
          <span
            :class="[
              'text-sm px-2 py-1 rounded font-mono',
              isDarkMode ? 'text-gray-300 bg-gray-600' : 'text-gray-600 bg-gray-200',
            ]"
          >
            {{ result.fileType }}
          </span>
        </div>
        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Проверено: {{ result.uploadDate }}
        </p>
      </div>

      <!-- Общий статус -->
      <div class="text-center">
        <div
          :class="[
            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4',
            result.status === 'compliant'
              ? isDarkMode
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-100 text-green-800'
              : result.status === 'non-compliant'
                ? isDarkMode
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-red-100 text-red-800'
                : isDarkMode
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-yellow-100 text-yellow-800',
          ]"
        >
          <svg
            v-if="result.status === 'compliant'"
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="result.status === 'non-compliant'"
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg v-else class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
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
          {{
            result.status === 'compliant'
              ? 'Соответствует ГОСТ'
              : result.status === 'non-compliant'
                ? 'Не соответствует ГОСТ'
                : 'Анализ...'
          }}
        </div>

        <!-- Оценка соответствия -->
        <div class="text-center">
          <div :class="['text-3xl font-bold mb-2', isDarkMode ? 'text-white' : 'text-gray-900']">
            {{ result.complianceScore }}%
          </div>
          <div
            :class="['w-full rounded-full h-3 mb-2', isDarkMode ? 'bg-gray-700' : 'bg-gray-200']"
          >
            <div
              :class="[
                'h-3 rounded-full transition-all duration-500',
                result.complianceScore >= 90
                  ? 'bg-green-500'
                  : result.complianceScore >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500',
              ]"
              :style="{ width: result.complianceScore + '%' }"
            ></div>
          </div>
          <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            Общая оценка соответствия
          </p>
        </div>
      </div>

      <!-- Нарушения -->
      <div v-if="result.violations.length > 0">
        <h3 :class="['text-lg font-medium mb-4', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
          Обнаруженные нарушения ({{ result.violations.length }})
        </h3>
        <div class="space-y-3">
          <div
            v-for="(violation, index) in result.violations"
            :key="index"
            :class="['border rounded-lg p-4', getSeverityColor(violation.severity)]"
          >
            <div class="flex items-start space-x-3">
              <svg
                class="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getSeverityIcon(violation.severity)"
                />
              </svg>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium">{{ violation.gostNumber }}</h4>
                  <span class="text-xs font-medium px-2 py-1 rounded-full bg-current bg-opacity-20">
                    {{ violation.section }}
                  </span>
                </div>
                <p class="text-sm">{{ violation.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div
        class="flex space-x-3 pt-4 border-t"
        :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'"
      >
        <button
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Скачать отчет
        </button>
        <button
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
            isDarkMode
              ? 'border border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          Поделиться
        </button>
      </div>
    </div>
  </div>
</template>
