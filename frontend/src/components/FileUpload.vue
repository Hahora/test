<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { CloudUpload, FileText, X, CheckCircle, Clock, AlertCircle } from 'lucide-vue-next'
import { api, handleApiError } from '@/services/api'

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

interface FileItem {
  file: File
  id: string
  status: 'pending' | 'checking' | 'completed' | 'error' | 'processing'
  result?: CheckResult
  error?: string
}

const emit = defineEmits<{
  filesChecked: [results: CheckResult[]]
}>()

const isDarkMode = inject('isDarkMode', ref(false))
const isDragOver = ref(false)
const isChecking = ref(false)
const uploadedFiles = ref<FileItem[]>([])

const acceptedFormats = ['.pdf', '.dwg', '.dxf', '.step', '.stp']

// Вычисляемые свойства для прогресса
const totalFiles = computed(() => uploadedFiles.value.length)
const completedFiles = computed(
  () => uploadedFiles.value.filter((f) => f.status === 'completed' || f.status === 'error').length,
)
const checkingFiles = computed(
  () =>
    uploadedFiles.value.filter((f) => f.status === 'checking' || f.status === 'processing').length,
)
const progressPercentage = computed(() => {
  if (totalFiles.value === 0) return 0
  return Math.round((completedFiles.value / totalFiles.value) * 100)
})

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(Array.from(files))
  }
}

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFileSelect(Array.from(target.files))
  }
}

const handleFileSelect = (files: File[]) => {
  const validFiles = files.filter((file) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    return acceptedFormats.includes(fileExtension)
  })

  if (validFiles.length !== files.length) {
    const invalidCount = files.length - validFiles.length
    alert(`${invalidCount} файлов пропущено. Поддерживаемые форматы: ${acceptedFormats.join(', ')}`)
  }

  const newFiles: FileItem[] = validFiles.map((file) => ({
    file,
    id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
  }))

  uploadedFiles.value = [...uploadedFiles.value, ...newFiles]
  console.log(
    'FileUpload: Files selected:',
    validFiles.map((f) => f.name),
  )
}

const removeFile = (fileId: string) => {
  uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== fileId)
}

const removeAllFiles = () => {
  uploadedFiles.value = []
}

const startCheck = async () => {
  if (uploadedFiles.value.length === 0) return

  console.log('FileUpload: Starting check for', uploadedFiles.value.length, 'files')
  isChecking.value = true

  const results: CheckResult[] = []

  // Обрабатываем файлы по одному
  for (const fileItem of uploadedFiles.value) {
    fileItem.status = 'checking'

    try {
      // Загружаем файл через API
      const uploadResponse = await api.uploadFile(fileItem.file)

      // Проверяем статус ответа
      let processingStatus: 'compliant' | 'non-compliant' | 'processing' = 'compliant'
      if (uploadResponse.status === 'processing') {
        processingStatus = 'processing'
        fileItem.status = 'processing'
      } else if (uploadResponse.status === 'completed') {
        processingStatus = 'compliant'
        fileItem.status = 'completed'
      } else {
        processingStatus = 'non-compliant'
        fileItem.status = 'completed'
      }

      // Формируем результат проверки из ответа API
      const result: CheckResult = {
        id: uploadResponse.doc_id,
        fileName: uploadResponse.filename,
        fileType: uploadResponse.filename.split('.').pop()?.toUpperCase() || 'Unknown',
        uploadDate: uploadResponse.upload_date,
        status: processingStatus,
        violations: [], // API должен возвращать нарушения, если они есть
        complianceScore: 100, // API должен возвращать оценку соответствия, если доступна
      }

      fileItem.result = result
      // Если статус не processing, то завершаем как completed
      if (processingStatus !== 'processing') {
        fileItem.status = 'completed'
      }
      results.push(result)

      console.log('FileUpload: Completed upload for:', fileItem.file.name, uploadResponse)
    } catch (error) {
      console.error('FileUpload: Error uploading file:', fileItem.file.name, error)
      const errorMessage = handleApiError(error)

      fileItem.status = 'error'
      fileItem.error = errorMessage
    }
  }

  console.log('FileUpload: All uploads completed, results:', results)
  isChecking.value = false

  // Эмитим все результаты
  emit('filesChecked', results)
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return FileText // Можно добавить разные иконки для разных типов файлов
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock
    case 'checking':
    case 'processing':
      return Clock
    case 'completed':
      return CheckCircle
    case 'error':
      return AlertCircle
    default:
      return Clock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return isDarkMode.value ? 'text-gray-400' : 'text-gray-500'
    case 'checking':
    case 'processing':
      return isDarkMode.value ? 'text-blue-400' : 'text-blue-600'
    case 'completed':
      return isDarkMode.value ? 'text-green-400' : 'text-green-600'
    case 'error':
      return isDarkMode.value ? 'text-red-400' : 'text-red-600'
    default:
      return isDarkMode.value ? 'text-gray-400' : 'text-gray-500'
  }
}

const getStatusText = (fileItem: FileItem) => {
  switch (fileItem.status) {
    case 'pending':
      return 'Ожидает'
    case 'checking':
      return 'Загружается...'
    case 'processing':
      return 'Загружен и находится в обработке'
    case 'completed':
      return fileItem.result?.status === 'compliant' ? 'Загружен' : 'Загружен'
    case 'error':
      return `Ошибка: ${fileItem.error || 'Неизвестная ошибка'}`
    default:
      return 'Ожидает'
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
    <div :class="['p-4 sm:p-6 border-b', isDarkMode ? 'border-gray-700' : 'border-gray-200']">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center',
              isDarkMode ? 'bg-blue-600' : 'bg-blue-600',
            ]"
          >
            <CloudUpload
              class="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            />
          </div>
          <div>
            <h2
              :class="[
                'text-lg sm:text-xl font-semibold',
                isDarkMode ? 'text-white' : 'text-gray-900',
              ]"
            >
              Загрузка документов
            </h2>
            <p :class="['text-xs sm:text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              PDF
            </p>
          </div>
        </div>

        <!-- Счетчик файлов -->
        <div v-if="uploadedFiles.length > 0" class="text-right">
          <div :class="['text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">
            {{ uploadedFiles.length }} файлов
          </div>
          <div
            v-if="isChecking"
            :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']"
          >
            {{ completedFiles }}/{{ totalFiles }} готово
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 sm:p-6">
      <!-- Зона загрузки -->
      <div
        v-if="uploadedFiles.length === 0"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-300',
          isDragOver
            ? isDarkMode
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-blue-500 bg-blue-50'
            : isDarkMode
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400',
        ]"
      >
        <div :class="['mb-3 sm:mb-4', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
          <CloudUpload class="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
        </div>
        <h3
          :class="[
            'text-base sm:text-lg font-medium mb-2',
            isDarkMode ? 'text-gray-200' : 'text-gray-900',
          ]"
        >
          <span class="hidden sm:inline">Перетащите файлы сюда</span>
          <span class="sm:hidden">Выберите файлы</span>
        </h3>
        <p :class="['mb-3 sm:mb-4 text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          <span class="hidden sm:inline">или нажмите для выбора файлов</span>
          <span class="sm:hidden">Можно выбрать несколько</span>
        </p>
        <input
          type="file"
          multiple
          :accept="acceptedFormats.join(',')"
          @change="handleFileInput"
          class="hidden"
          id="file-input"
        />
        <label
          for="file-input"
          class="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Выбрать файлы
        </label>
      </div>

      <!-- Список загруженных файлов -->
      <div v-else class="space-y-3 sm:space-y-4">
        <!-- Прогресс бар -->
        <div v-if="isChecking" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span :class="[isDarkMode ? 'text-gray-300' : 'text-gray-700']">
              Загрузка файлов...
            </span>
            <span :class="[isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              {{ progressPercentage }}%
            </span>
          </div>
          <div
            :class="[
              'w-full bg-gray-200 rounded-full h-2',
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
            ]"
          >
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>

        <!-- Список файлов -->
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="fileItem in uploadedFiles"
            :key="fileItem.id"
            :class="[
              'flex items-center justify-between p-3 rounded-lg border transition-all',
              isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200',
              fileItem.status === 'checking' || fileItem.status === 'processing'
                ? 'ring-2 ring-blue-500/20'
                : '',
              fileItem.status === 'error' ? 'ring-2 ring-red-500/20' : '',
            ]"
          >
            <div class="flex items-center space-x-3 min-w-0 flex-1">
              <div
                :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  fileItem.status === 'checking' || fileItem.status === 'processing'
                    ? isDarkMode
                      ? 'bg-blue-600'
                      : 'bg-blue-100'
                    : fileItem.status === 'completed'
                      ? isDarkMode
                        ? 'bg-green-600'
                        : 'bg-green-100'
                      : fileItem.status === 'error'
                        ? isDarkMode
                          ? 'bg-red-600'
                          : 'bg-red-100'
                        : isDarkMode
                          ? 'bg-gray-600'
                          : 'bg-gray-200',
                ]"
              >
                <component
                  :is="getStatusIcon(fileItem.status)"
                  :class="[
                    'w-4 h-4',
                    fileItem.status === 'checking' || fileItem.status === 'processing'
                      ? isDarkMode
                        ? 'text-white animate-spin'
                        : 'text-blue-600 animate-spin'
                      : fileItem.status === 'completed'
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-green-600'
                        : fileItem.status === 'error'
                          ? isDarkMode
                            ? 'text-white'
                            : 'text-red-600'
                          : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-600',
                  ]"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p
                  :class="[
                    'font-medium text-sm truncate',
                    isDarkMode ? 'text-gray-200' : 'text-gray-900',
                  ]"
                >
                  {{ fileItem.file.name }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <span :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    {{ (fileItem.file.size / 1024 / 1024).toFixed(2) }} МБ
                  </span>
                  <span :class="['text-xs', getStatusColor(fileItem.status)]">
                    {{ getStatusText(fileItem) }}
                  </span>
                  <span
                    v-if="
                      fileItem.result &&
                      fileItem.result.complianceScore &&
                      fileItem.status !== 'processing'
                    "
                    :class="['text-xs font-medium', isDarkMode ? 'text-gray-300' : 'text-gray-700']"
                  >
                    {{ fileItem.result.complianceScore }}%
                  </span>
                </div>
              </div>
            </div>
            <button
              v-if="!isChecking"
              @click="removeFile(fileItem.id)"
              :class="[
                'transition-colors p-1 flex-shrink-0 ml-2',
                isDarkMode
                  ? 'text-gray-500 hover:text-red-400'
                  : 'text-gray-400 hover:text-red-500',
              ]"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            v-if="!isChecking"
            @click="startCheck"
            :disabled="uploadedFiles.length === 0"
            class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[44px]"
          >
            Загрузить файлы ({{ uploadedFiles.length }})
          </button>

          <div
            v-else
            class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-sm sm:text-base min-h-[44px] flex items-center justify-center"
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            Загрузка файлов... ({{ checkingFiles > 0 ? checkingFiles : completedFiles }}/{{
              totalFiles
            }})
          </div>

          <!-- Дополнительные кнопки -->
          <input
            type="file"
            multiple
            :accept="acceptedFormats.join(',')"
            @change="handleFileInput"
            class="hidden"
            id="add-files-input"
          />
          <label
            v-if="!isChecking"
            for="add-files-input"
            class="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors font-medium text-sm sm:text-base min-h-[44px]"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span class="hidden sm:inline">Добавить</span>
            <span class="sm:hidden">Добавить</span>
          </label>

          <button
            v-if="!isChecking"
            @click="removeAllFiles"
            class="inline-flex items-center justify-center px-4 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm sm:text-base min-h-[44px]"
          >
            <X class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span class="hidden sm:inline">Очистить</span>
            <span class="sm:hidden"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
