<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Поиск по названию файла...',
  disabled: false,
})

const emit = defineEmits<Emits>()

const isDarkMode = inject('isDarkMode', ref(false))
const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const localValue = ref(props.modelValue)

// Синхронизация с родительским компонентом
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
)

watch(
  localValue,
  (newValue) => {
    emit('update:modelValue', newValue)
    emit('search', newValue)
  },
  { immediate: true },
)

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const clearSearch = () => {
  localValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const focusInput = () => {
  inputRef.value?.focus()
}

// Добавим debounced search для лучшего UX
const debouncedSearch = ref()
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  localValue.value = value

  // Очищаем предыдущий таймер
  if (debouncedSearch.value) {
    clearTimeout(debouncedSearch.value)
  }

  // Устанавливаем новый таймер для поиска
  debouncedSearch.value = setTimeout(() => {
    emit('search', value)
  }, 300) // 300ms задержка
}
</script>

<template>
  <div class="relative">
    <div
      :class="[
        'relative flex items-center transition-all duration-200',
        'rounded-lg border backdrop-blur-sm',
        isFocused
          ? isDarkMode
            ? 'border-blue-500 bg-gray-800/90 shadow-lg shadow-blue-500/10'
            : 'border-blue-500 bg-white/90 shadow-lg shadow-blue-500/10'
          : isDarkMode
            ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            : 'border-gray-300 bg-white/50 hover:border-gray-400',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      <!-- Search Icon -->
      <button
        @click="focusInput"
        :disabled="disabled"
        :class="[
          'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-colors',
          'rounded-l-lg',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          isFocused
            ? isDarkMode
              ? 'text-blue-400'
              : 'text-blue-600'
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-500 hover:text-gray-700',
        ]"
      >
        <Search
          :class="[
            'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200',
            isFocused && 'scale-110',
          ]"
        />
      </button>

      <!-- Input Field -->
      <input
        ref="inputRef"
        :value="localValue"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="handleFocus"
        @blur="handleBlur"
        :class="[
          'flex-1 px-2 py-3 sm:py-3.5 bg-transparent border-none outline-none',
          'text-sm sm:text-base font-medium',
          'placeholder:transition-colors placeholder:duration-200',
          isDarkMode
            ? 'text-white placeholder:text-gray-500'
            : 'text-gray-900 placeholder:text-gray-400',
          isFocused && (isDarkMode ? 'placeholder:text-gray-600' : 'placeholder:text-gray-300'),
          disabled && 'cursor-not-allowed',
        ]"
      />

      <!-- Clear Button -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-75"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-75"
      >
        <button
          v-if="localValue && !disabled"
          @click="clearSearch"
          :class="[
            'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mr-1 sm:mr-2',
            'rounded-full transition-all duration-200',
            'hover:scale-110 active:scale-95',
            isDarkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50',
          ]"
        >
          <X class="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </Transition>
    </div>
  </div>
</template>
