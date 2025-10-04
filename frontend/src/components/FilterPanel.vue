<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { Filter, Calendar, RotateCcw } from 'lucide-vue-next'

interface FilterState {
  status: string
  dateRange: string
}

interface Props {
  modelValue: FilterState
}

interface Emits {
  'update:modelValue': [value: FilterState]
  reset: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDarkMode = inject('isDarkMode', ref(false))
const isExpanded = ref(false)

const localFilters = ref<FilterState>({ ...props.modelValue })

const dateRangeOptions = [
  { value: 'all', label: 'Все время' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
]

const hasActiveFilters = computed(() => {
  return localFilters.value.status !== 'all' || localFilters.value.dateRange !== 'all'
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (localFilters.value.status !== 'all') count++
  if (localFilters.value.dateRange !== 'all') count++
  return count
})

const updateFilters = () => {
  emit('update:modelValue', { ...localFilters.value })
}

const resetFilters = () => {
  localFilters.value = { status: 'all', dateRange: 'all' }
  updateFilters()
  emit('reset')
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const getDateRangeLabel = (range: string) => {
  const option = dateRangeOptions.find((opt) => opt.value === range)
  return option?.label || 'Все время'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filter Toggle Button -->
    <div class="flex items-center justify-between">
      <button
        @click="toggleExpanded"
        :class="[
          'inline-flex items-center px-4 py-2.5 rounded-lg border transition-all duration-200',
          'text-sm font-medium min-h-[44px]',
          hasActiveFilters
            ? isDarkMode
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-blue-600 border-blue-600 text-white'
            : isDarkMode
              ? 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400',
        ]"
      >
        <Filter
          :class="['w-4 h-4 mr-2', isExpanded && 'rotate-180 transition-transform duration-200']"
        />
        <span class="hidden sm:inline">Фильтры</span>
        <span class="sm:hidden">Фильтр</span>
        <span
          v-if="activeFiltersCount > 0"
          :class="[
            'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
            hasActiveFilters
              ? 'bg-white/20 text-white'
              : isDarkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white',
          ]"
        >
          {{ activeFiltersCount }}
        </span>
      </button>

      <!-- Reset Button -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        :class="[
          'inline-flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium min-h-[44px]',
          isDarkMode
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100',
        ]"
      >
        <RotateCcw class="w-4 h-4 mr-2" />
        <span class="hidden sm:inline">Сбросить</span>
        <span class="sm:hidden">×</span>
      </button>
    </div>

    <!-- Filter Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="overflow-hidden">
        <div
          :class="[
            'p-4 sm:p-6 rounded-lg border backdrop-blur-sm',
            isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200',
          ]"
        >
          <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6">
            <!-- Date Range Filter -->
            <div class="space-y-2">
              <label
                :class="[
                  'block text-sm font-medium',
                  isDarkMode ? 'text-gray-200' : 'text-gray-700',
                ]"
              >
                Период времени
              </label>
              <div class="relative">
                <select
                  v-model="localFilters.dateRange"
                  @change="updateFilters"
                  :class="[
                    'w-full px-4 py-2.5 pr-10 rounded-lg border transition-colors',
                    'text-sm font-medium appearance-none cursor-pointer min-h-[44px]',
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500',
                  ]"
                >
                  <option
                    v-for="option in dateRangeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Calendar :class="['w-4 h-4', isDarkMode ? 'text-gray-400' : 'text-gray-500']" />
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div
            v-if="hasActiveFilters"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex flex-wrap gap-2">
              <span
                :class="['text-xs font-medium', isDarkMode ? 'text-gray-400' : 'text-gray-600']"
              >
                Активные фильтры:
              </span>
              <span
                v-if="localFilters.dateRange !== 'all'"
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-800',
                ]"
              >
                {{ getDateRangeLabel(localFilters.dateRange) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
