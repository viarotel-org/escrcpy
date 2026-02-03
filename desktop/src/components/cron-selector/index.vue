<template>
  <div class="cron-selector">
    <!-- Visual selector -->
    <div class="cron-visual-selector">
      <!-- Preset shortcuts -->
      <div class="cron-presets mb-4">
        <el-radio-group
          v-model="presetType"
          @change="handlePresetChange"
        >
          <el-radio-button value="hourly">
            {{ $t('cron.preset.hourly') }}
          </el-radio-button>
          <el-radio-button value="daily">
            {{ $t('cron.preset.daily') }}
          </el-radio-button>
          <el-radio-button value="weekly">
            {{ $t('cron.preset.weekly') }}
          </el-radio-button>
          <el-radio-button value="monthly">
            {{ $t('cron.preset.monthly') }}
          </el-radio-button>
          <el-radio-button value="custom">
            {{ $t('cron.preset.custom') }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- Hourly configuration -->
      <div v-if="presetType === 'hourly'" class="cron-config-section">
        <div class="flex items-center gap-2 flex-wrap">
          <span>{{ $t('cron.hourly.at') }}</span>
          <el-input-number
            v-model="config.minute"
            :min="0"
            :max="59"
            class="!w-24"
          />
          <span>{{ $t('cron.hourly.minute') }}</span>
        </div>
      </div>

      <!-- Daily configuration -->
      <div v-if="presetType === 'daily'" class="cron-config-section">
        <div class="flex items-center gap-2 flex-wrap">
          <span>{{ $t('cron.daily.at') }}</span>
          <el-time-picker
            v-model="config.time"
            format="HH:mm"
            value-format="HH:mm"
            class="!w-32"
            :placeholder="$t('common.select.please')"
          />
        </div>
      </div>

      <!-- Weekly configuration -->
      <div v-if="presetType === 'weekly'" class="cron-config-section">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span>{{ $t('cron.weekly.on') }}</span>
          <el-checkbox-group v-model="config.weekdays" class="flex-1">
            <el-checkbox-button
              v-for="day in weekDays"
              :key="day.value"
              :value="day.value"
              class=""
            >
              {{ $t(day.label) }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span>{{ $t('cron.weekly.at') }}</span>
          <el-time-picker
            v-model="config.time"
            format="HH:mm"
            value-format="HH:mm"
            class="!w-32"
            :placeholder="$t('common.select.please')"
          />
        </div>
      </div>

      <!-- Monthly configuration -->
      <div v-if="presetType === 'monthly'" class="cron-config-section">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span>{{ $t('cron.monthly.on') }}</span>
          <el-select
            v-model="config.days"
            multiple
            :placeholder="$t('common.select.please')"
            class="!w-60"
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="day in 31"
              :key="day"
              :label="`${day}${$t('cron.monthly.day')}`"
              :value="day"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span>{{ $t('cron.monthly.at') }}</span>
          <el-time-picker
            v-model="config.time"
            format="HH:mm"
            value-format="HH:mm"
            class="!w-32"
            :placeholder="$t('common.select.please')"
          />
        </div>
      </div>

      <!-- Custom Cron expression configuration -->
      <div v-if="presetType === 'custom'" class="cron-config-section">
        <!-- Visual configuration panels -->
        <el-collapse v-model="activePanel" class="mb-4">
          <!-- Minute configuration -->
          <el-collapse-item name="minute" :title="$t('cron.custom.minute')">
            <div class="cron-field-config">
              <el-radio-group v-model="customConfig.minute.type" class="mb-2">
                <el-radio value="every">
                  {{ $t('cron.custom.every') }}
                </el-radio>
                <el-radio value="specific">
                  {{ $t('cron.custom.specific') }}
                </el-radio>
                <el-radio value="range">
                  {{ $t('cron.custom.range') }}
                </el-radio>
                <el-radio value="step">
                  {{ $t('cron.custom.step') }}
                </el-radio>
              </el-radio-group>

              <div v-if="customConfig.minute.type === 'specific'" class="mt-2">
                <el-select
                  v-model="customConfig.minute.values"
                  multiple
                  :placeholder="$t('common.select.please')"
                  class="w-full"
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="i in 60"
                    :key="i - 1"
                    :label="i - 1"
                    :value="i - 1"
                  />
                </el-select>
              </div>

              <div v-if="customConfig.minute.type === 'range'" class="mt-2 flex items-center gap-2">
                <el-input-number v-model="customConfig.minute.start" :min="0" :max="59" />
                <span>{{ $t('cron.custom.to') }}</span>
                <el-input-number v-model="customConfig.minute.end" :min="0" :max="59" />
              </div>

              <div v-if="customConfig.minute.type === 'step'" class="mt-2 flex items-center gap-2">
                <span>{{ $t('cron.custom.every') }}</span>
                <el-input-number v-model="customConfig.minute.step" :min="1" :max="59" />
                <span>{{ $t('cron.custom.minuteUnit') }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- Hour configuration -->
          <el-collapse-item name="hour" :title="$t('cron.custom.hour')">
            <div class="cron-field-config">
              <el-radio-group v-model="customConfig.hour.type" class="mb-2">
                <el-radio value="every">
                  {{ $t('cron.custom.every') }}
                </el-radio>
                <el-radio value="specific">
                  {{ $t('cron.custom.specific') }}
                </el-radio>
                <el-radio value="range">
                  {{ $t('cron.custom.range') }}
                </el-radio>
                <el-radio value="step">
                  {{ $t('cron.custom.step') }}
                </el-radio>
              </el-radio-group>

              <div v-if="customConfig.hour.type === 'specific'" class="mt-2">
                <el-select
                  v-model="customConfig.hour.values"
                  multiple
                  :placeholder="$t('common.select.please')"
                  class="w-full"
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="i in 24"
                    :key="i - 1"
                    :label="`${i - 1}:00`"
                    :value="i - 1"
                  />
                </el-select>
              </div>

              <div v-if="customConfig.hour.type === 'range'" class="mt-2 flex items-center gap-2">
                <el-input-number v-model="customConfig.hour.start" :min="0" :max="23" />
                <span>{{ $t('cron.custom.to') }}</span>
                <el-input-number v-model="customConfig.hour.end" :min="0" :max="23" />
              </div>

              <div v-if="customConfig.hour.type === 'step'" class="mt-2 flex items-center gap-2">
                <span>{{ $t('cron.custom.every') }}</span>
                <el-input-number v-model="customConfig.hour.step" :min="1" :max="23" />
                <span>{{ $t('cron.custom.hourUnit') }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- Day configuration -->
          <el-collapse-item name="day" :title="$t('cron.custom.day')">
            <div class="cron-field-config">
              <el-radio-group v-model="customConfig.day.type" class="mb-2">
                <el-radio value="every">
                  {{ $t('cron.custom.every') }}
                </el-radio>
                <el-radio value="specific">
                  {{ $t('cron.custom.specific') }}
                </el-radio>
                <el-radio value="range">
                  {{ $t('cron.custom.range') }}
                </el-radio>
              </el-radio-group>

              <div v-if="customConfig.day.type === 'specific'" class="mt-2">
                <el-select
                  v-model="customConfig.day.values"
                  multiple
                  :placeholder="$t('common.select.please')"
                  class="w-full"
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="i in 31"
                    :key="i"
                    :label="`${i}${$t('cron.monthly.day')}`"
                    :value="i"
                  />
                </el-select>
              </div>

              <div v-if="customConfig.day.type === 'range'" class="mt-2 flex items-center gap-2">
                <el-input-number v-model="customConfig.day.start" :min="1" :max="31" />
                <span>{{ $t('cron.custom.to') }}</span>
                <el-input-number v-model="customConfig.day.end" :min="1" :max="31" />
              </div>
            </div>
          </el-collapse-item>

          <!-- Weekday options -->
          <el-collapse-item name="weekday" :title="$t('cron.custom.weekday')">
            <div class="cron-field-config">
              <el-radio-group v-model="customConfig.weekday.type" class="mb-2">
                <el-radio value="every">
                  {{ $t('cron.custom.every') }}
                </el-radio>
                <el-radio value="specific">
                  {{ $t('cron.custom.specific') }}
                </el-radio>
              </el-radio-group>

              <div v-if="customConfig.weekday.type === 'specific'" class="mt-2">
                <el-checkbox-group v-model="customConfig.weekday.values">
                  <el-checkbox-button
                    v-for="day in weekDays"
                    :key="day.value"
                    :value="day.value"
                  >
                    {{ $t(day.label) }}
                  </el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- Advanced mode: enter Cron expression directly -->
    <div class="cron-advanced mt-4">
      <el-divider>
        <el-button
          text
          type="primary"
          @click="showAdvanced = !showAdvanced"
        >
          <el-icon class="mr-1">
            <ArrowUp v-if="showAdvanced" />
            <ArrowDown v-else />
          </el-icon>
          {{ showAdvanced ? $t('cron.hideExpression') : $t('cron.showExpression') }}
        </el-button>
      </el-divider>

      <div v-if="showAdvanced" class="cron-expression-input">
        <div class="flex items-center gap-2">
          <el-input
            v-model="cronExpression"
            :placeholder="$t('cron.expressionPlaceholder')"
            :class="{ 'is-error': !isValidCron && cronExpression }"
            @input="handleExpressionInput"
          >
            <template #prepend>
              Cron
            </template>
          </el-input>
        </div>

        <!-- Validation status display -->
        <div class="cron-validation mt-2">
          <el-tag v-if="isValidCron && cronExpression" type="success">
            <el-icon class="mr-1">
              <Check />
            </el-icon>
            {{ $t('cron.valid') }}
          </el-tag>
          <el-tag v-else-if="!isValidCron && cronExpression" type="danger">
            <el-icon class="mr-1">
              <Close />
            </el-icon>
            {{ $t('cron.invalid') }}
          </el-tag>
        </div>

        <!-- Next run time preview -->
        <div v-if="isValidCron && nextExecutions.length > 0" class="next-executions mt-3">
          <div class="text-sm text-gray-500 mb-2">
            {{ $t('cron.nextExecutions') }}
          </div>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="(time, index) in nextExecutions"
              :key="index"
              type="info"
            >
              {{ time }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- Human-friendly description -->
    <div v-if="cronDescription" class="cron-description mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
      <div class="flex items-start gap-2">
        <el-icon class="text-primary mt-0.5">
          <InfoFilled />
        </el-icon>
        <span class="text-sm">{{ cronDescription }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Cron } from 'croner'
import dayjs from 'dayjs'
import { ArrowDown, ArrowUp, Check, Close, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  /**
   * Cron expression value (v-model)
   */
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'valid-change'])

// Preset types
const presetType = ref('daily')

// Whether to show advanced mode
const showAdvanced = ref(false)

// Custom configuration expanded panels
const activePanel = ref(['minute', 'hour'])

// Weekday options
const weekDays = [
  { label: 'cron.weekday.sun', value: 0 },
  { label: 'cron.weekday.mon', value: 1 },
  { label: 'cron.weekday.tue', value: 2 },
  { label: 'cron.weekday.wed', value: 3 },
  { label: 'cron.weekday.thu', value: 4 },
  { label: 'cron.weekday.fri', value: 5 },
  { label: 'cron.weekday.sat', value: 6 },
]

// Simple configuration
const config = reactive({
  minute: 0,
  time: '08:00',
  weekdays: [1], // Default: Monday
  days: [1], // Default: day 1 of month
})

// Custom configuration (for advanced customization)
const customConfig = reactive({
  minute: {
    type: 'every',
    values: [],
    start: 0,
    end: 59,
    step: 5,
  },
  hour: {
    type: 'every',
    values: [],
    start: 0,
    end: 23,
    step: 1,
  },
  day: {
    type: 'every',
    values: [],
    start: 1,
    end: 31,
  },
  weekday: {
    type: 'every',
    values: [],
  },
})

// Cron expression
const cronExpression = ref(props.modelValue || '')

/**
 * Validate whether a Cron expression is valid
 * Use croner library for validation
 */
const isValidCron = computed(() => {
  if (!cronExpression.value) {
    return false
  }
  try {
    // Validate expression using the Cron constructor
    new Cron(cronExpression.value, { legacyMode: false })
    return true
  }
  catch {
    return false
  }
})

/**
 * Get next execution times (up to 5)
 */
const nextExecutions = computed(() => {
  if (!isValidCron.value) {
    return []
  }
  try {
    const cron = new Cron(cronExpression.value, { legacyMode: false })
    const times = []
    let date = new Date()

    for (let i = 0; i < 5; i++) {
      const next = cron.nextRun(date)
      if (next) {
        times.push(dayjs(next).format('YYYY-MM-DD HH:mm'))
        date = new Date(next.getTime() + 1000) // Add 1 second to avoid duplicates
      }
    }

    return times
  }
  catch {
    return []
  }
})

/**
 * Generate a human-friendly Cron description
 */
const cronDescription = computed(() => {
  if (!cronExpression.value) {
    return ''
  }

  // Generate description based on preset type
  switch (presetType.value) {
    case 'hourly':
      return t('cron.desc.hourly', { minute: config.minute })
    case 'daily': {
      const [hour, minute] = (config.time || '08:00').split(':')
      return t('cron.desc.daily', { hour, minute })
    }
    case 'weekly': {
      const [hour, minute] = (config.time || '08:00').split(':')
      const days = config.weekdays.map(d => t(weekDays.find(w => w.value === d)?.label || '')).join('、')
      return t('cron.desc.weekly', { days, hour, minute })
    }
    case 'monthly': {
      const [hour, minute] = (config.time || '08:00').split(':')
      const days = config.days.join('、')
      return t('cron.desc.monthly', { days, hour, minute })
    }
    case 'custom':
      return t('cron.desc.custom', { expression: cronExpression.value })
    default:
      return ''
  }
})

/**
 * Generate Cron expression from visual configuration
 */
function generateCronExpressionFromConfig() {
  let expression = ''

  switch (presetType.value) {
    case 'hourly':
      // Nth minute of every hour
      expression = `${config.minute} * * * *`
      break

    case 'daily': {
      // Fixed time each day
      const [hour, minute] = (config.time || '08:00').split(':')
      expression = `${Number.parseInt(minute)} ${Number.parseInt(hour)} * * *`
      break
    }

    case 'weekly': {
      // Specific weekdays and time
      const [hour, minute] = (config.time || '08:00').split(':')
      const weekdaysStr = config.weekdays.length > 0 ? config.weekdays.sort((a, b) => a - b).join(',') : '*'
      expression = `${Number.parseInt(minute)} ${Number.parseInt(hour)} * * ${weekdaysStr}`
      break
    }

    case 'monthly': {
      // Specific days of month and time
      const [hour, minute] = (config.time || '08:00').split(':')
      const daysStr = config.days.length > 0 ? config.days.sort((a, b) => a - b).join(',') : '*'
      expression = `${Number.parseInt(minute)} ${Number.parseInt(hour)} ${daysStr} * *`
      break
    }

    case 'custom':
      expression = generateCustomCronExpression()
      break
  }

  return expression
}

/**
 * Generate Cron expression from custom configuration
 */
function generateCustomCronExpression() {
  const parts = []

  // Minute part
  parts.push(generateFieldExpression(customConfig.minute, 0, 59))

  // Hour part
  parts.push(generateFieldExpression(customConfig.hour, 0, 23))

  // Day part
  parts.push(generateFieldExpression(customConfig.day, 1, 31))

  // Month part (fixed to every month)
  parts.push('*')

  // Weekday part
  if (customConfig.weekday.type === 'every') {
    parts.push('*')
  }
  else if (customConfig.weekday.type === 'specific' && customConfig.weekday.values.length > 0) {
    parts.push(customConfig.weekday.values.sort((a, b) => a - b).join(','))
  }
  else {
    parts.push('*')
  }

  return parts.join(' ')
}

/**
 * Generate a Cron expression for a single field
 */
function generateFieldExpression(fieldConfig, min, max) {
  switch (fieldConfig.type) {
    case 'every':
      return '*'
    case 'specific':
      return fieldConfig.values.length > 0
        ? fieldConfig.values.sort((a, b) => a - b).join(',')
        : '*'
    case 'range':
      return `${fieldConfig.start}-${fieldConfig.end}`
    case 'step':
      return `*/${fieldConfig.step}`
    default:
      return '*'
  }
}

/**
 * Handle preset type changes
 */
function handlePresetChange() {
  updateCronExpression()
}

/**
 * Handle user-entered expression
 */
function handleExpressionInput(value) {
  cronExpression.value = value
  emit('update:modelValue', value)
  emit('change', value)
  emit('valid-change', isValidCron.value)

  // Attempt to parse back into the visual configuration
  parseExpressionToConfig(value)
}

/**
 * Try to parse Cron expression into visual config
 */
function parseExpressionToConfig(expression) {
  if (!expression) {
    return
  }

  const parts = expression.trim().split(/\s+/)
  if (parts.length < 5) {
    return
  }

  const [minute, hour, day, month, weekday] = parts

  // Attempt to recognize preset type
  if (minute !== '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    // Hourly mode
    presetType.value = 'hourly'
    config.minute = Number.parseInt(minute) || 0
  }
  else if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
    // Daily mode
    presetType.value = 'daily'
    config.time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
  }
  else if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday !== '*') {
    // Weekly mode
    presetType.value = 'weekly'
    config.time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    config.weekdays = weekday.split(',').map(d => Number.parseInt(d))
  }
  else if (minute !== '*' && hour !== '*' && day !== '*' && month === '*' && weekday === '*') {
    // Monthly mode
    presetType.value = 'monthly'
    config.time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
    config.days = day.split(',').map(d => Number.parseInt(d))
  }
  else {
    // Custom mode
    presetType.value = 'custom'
  }
}

/**
 * Update Cron expression and emit events
 */
function updateCronExpression() {
  const expression = generateCronExpressionFromConfig()
  cronExpression.value = expression
  emit('update:modelValue', expression)
  emit('change', expression)
  emit('valid-change', isValidCron.value)
}

// Watch config changes and auto-update Cron expression
watch(
  () => [config.minute, config.time, config.weekdays, config.days],
  () => {
    if (presetType.value !== 'custom') {
      updateCronExpression()
    }
  },
  { deep: true },
)

// Watch custom config changes
watch(
  customConfig,
  () => {
    if (presetType.value === 'custom') {
      updateCronExpression()
    }
  },
  { deep: true },
)

// Watch external value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== cronExpression.value) {
      cronExpression.value = newValue
      parseExpressionToConfig(newValue)
    }
  },
)

// Initialization
if (props.modelValue) {
  cronExpression.value = props.modelValue
  parseExpressionToConfig(props.modelValue)
}
else {
  // Generate a default expression
  updateCronExpression()
}

// Expose methods
defineExpose({
  /**
   * Get current Cron expression
   */
  getCronExpression: () => cronExpression.value,
  /**
   * Validate whether the current expression is valid
   */
  validate: () => isValidCron.value,
  /**
   * Get list of next execution times
   */
  getNextExecutions: () => nextExecutions.value,
})
</script>

<style lang="postcss" scoped>
.cron-selector {
  @apply p-4 bg-white dark:bg-gray-900 rounded-lg;
}

.cron-visual-selector {
  @apply space-y-4;
}

.cron-field-config {
  @apply p-3;
}

.cron-expression-input {
  @apply p-4 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.cron-expression-input .is-error :deep(.el-input__wrapper) {
  @apply border-red-500;
}

.next-executions {
  @apply p-3 bg-blue-50 dark:bg-blue-900/20 rounded;
}

.cron-description {
  @apply text-gray-600 dark:text-gray-300;
}
</style>
