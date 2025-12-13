<template>
  <el-dialog
    v-model="visible"
    :title="$t('copilot.config.title')"
    width="95%"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
    append-to-body
    fullscreen
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen config-dialog"
    @open="loadConfig"
  >
    <div class="config-container h-full overflow-hidden">
      <div class="config-content h-full overflow-y-auto">
        <div class="max-w-3xl mx-auto py-6 px-4">
          <!-- API 配置区 -->
          <div class="config-section mb-8">
            <div class="section-header flex items-center gap-2 mb-4">
              <div class="section-icon w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <el-icon class="text-primary-500">
                  <Connection />
                </el-icon>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ $t('copilot.config.apiSection') }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('copilot.config.apiSectionDesc') }}
                </p>
              </div>
            </div>

            <div class="config-card bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-5">
              <!-- Base URL -->
              <div class="config-item">
                <label class="config-label flex items-center gap-2 mb-2">
                  <el-icon class="text-gray-400"><Link /></el-icon>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('copilot.config.baseUrl') }}
                  </span>
                  <span class="text-red-500">*</span>
                </label>
                <el-input
                  v-model="configForm.baseUrl"
                  :placeholder="$t('copilot.config.baseUrlPlaceholder')"
                  clearable
                  size="large"
                  class="config-input"
                />
              </div>

              <!-- API Key -->
              <div class="config-item">
                <label class="config-label flex items-center gap-2 mb-2">
                  <el-icon class="text-gray-400"><Key /></el-icon>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('copilot.config.apiKey') }}
                  </span>
                  <span class="text-red-500">*</span>
                </label>
                <el-input
                  v-model="configForm.apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  :placeholder="$t('copilot.config.apiKeyPlaceholder')"
                  clearable
                  size="large"
                  class="config-input"
                >
                  <template #suffix>
                    <el-button
                      text
                      size="small"
                      @click="showApiKey = !showApiKey"
                    >
                      <el-icon>
                        <View v-if="showApiKey" />
                        <Hide v-else />
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>

              <!-- Model -->
              <div class="config-item">
                <label class="config-label flex items-center gap-2 mb-2">
                  <el-icon class="text-gray-400"><Cpu /></el-icon>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('copilot.config.model') }}
                  </span>
                </label>
                <el-select
                  v-model="configForm.model"
                  :placeholder="$t('copilot.config.modelPlaceholder')"
                  allow-create
                  filterable
                  size="large"
                  class="w-full"
                >
                  <el-option label="autoglm-phone" value="autoglm-phone">
                    <div class="flex items-center gap-2">
                      <span class="text-primary-500">●</span>
                      <span>autoglm-phone</span>
                      <el-tag size="small" type="success">
                        推荐
                      </el-tag>
                    </div>
                  </el-option>
                  <el-option label="GLM-4V-Plus" value="GLM-4V-Plus" />
                  <el-option label="GLM-4V" value="GLM-4V" />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 执行配置区 -->
          <div class="config-section mb-8">
            <div class="section-header flex items-center gap-2 mb-4">
              <div class="section-icon w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <el-icon class="text-amber-500">
                  <Setting />
                </el-icon>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ $t('copilot.config.executionSection') }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ $t('copilot.config.executionSectionDesc') }}
                </p>
              </div>
            </div>

            <div class="config-card bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-5">
              <!-- Max Steps -->
              <div class="config-item">
                <div class="flex items-center justify-between mb-2">
                  <label class="config-label flex items-center gap-2">
                    <el-icon class="text-gray-400"><Odometer /></el-icon>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('copilot.config.maxSteps') }}
                    </span>
                  </label>
                  <span class="text-sm font-semibold text-primary-500">{{ configForm.maxSteps }}</span>
                </div>
                <el-slider
                  v-model="configForm.maxSteps"
                  :min="1"
                  :max="100"
                  :step="5"
                  :marks="{ 1: '1', 25: '25', 50: '50', 75: '75', 100: '100' }"
                  class="px-2"
                />
                <p class="text-xs text-gray-400 mt-8">
                  {{ $t('copilot.config.maxStepsHint') }}
                </p>
              </div>

              <!-- Language -->
              <div class="config-item">
                <label class="config-label flex items-center gap-2 mb-2">
                  <el-icon class="text-gray-400"><ChatLineSquare /></el-icon>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('copilot.config.lang') }}
                  </span>
                </label>
                <el-radio-group v-model="configForm.lang" class="lang-radio-group">
                  <el-radio-button value="cn">
                    {{ $t('copilot.config.langCn') }}
                  </el-radio-button>
                  <el-radio-button value="en">
                    {{ $t('copilot.config.langEn') }}
                  </el-radio-button>
                </el-radio-group>
              </div>

              <!-- Quiet Mode -->
              <div class="config-item">
                <div class="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <el-icon class="text-gray-500">
                        <Mute />
                      </el-icon>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ $t('copilot.config.quiet') }}
                      </p>
                      <p class="text-xs text-gray-400">
                        {{ $t('copilot.config.quietHint') }}
                      </p>
                    </div>
                  </div>
                  <el-switch v-model="configForm.quiet" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="config-footer flex items-center justify-between px-4">
        <el-button @click="resetConfig">
          <el-icon class="mr-1">
            <RefreshRight />
          </el-icon>
          {{ $t('copilot.config.reset') }}
        </el-button>
        <div class="flex items-center gap-2">
          <el-button @click="visible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitConfig">
            <el-icon class="mr-1">
              <Check />
            </el-icon>
            {{ $t('common.save') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, toRaw, watch } from 'vue'
import {
  ChatLineSquare,
  Check,
  Connection,
  Cpu,
  Hide,
  Key,
  Link,
  Mute,
  Odometer,
  RefreshRight,
  Setting,
  View,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import copilotClient from '$/services/copilot/index.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

// 控制弹窗显示
const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// API Key 显示状态
const showApiKey = ref(false)

// 表单数据
const configForm = reactive({
  baseUrl: '',
  apiKey: '',
  model: 'autoglm-phone',
  maxSteps: 50,
  lang: 'cn',
  quiet: false,
})

// 加载配置
async function loadConfig() {
  const defaultConfig = await copilotClient.getDefaultConfig() || {}
  const savedConfig = await copilotClient.getConfig() || {}

  Object.assign(configForm, {
    ...defaultConfig,
    ...savedConfig,
  })
}

// 验证配置
function validateConfig() {
  if (!configForm.baseUrl?.trim()) {
    ElMessage.warning(t('copilot.config.baseUrlRequired'))
    return false
  }
  if (!/^https?:\/\/.+/.test(configForm.baseUrl)) {
    ElMessage.warning(t('copilot.config.baseUrlInvalid'))
    return false
  }
  if (!configForm.apiKey?.trim()) {
    ElMessage.warning(t('copilot.config.apiKeyRequired'))
    return false
  }
  return true
}

// 提交配置
async function submitConfig() {
  if (!validateConfig())
    return

  try {
    await copilotClient.setConfig(null, { ...toRaw(configForm) })
    ElMessage.success(t('copilot.config.saveSuccess'))
    visible.value = false
  }
  catch (error) {
    console.error('Config save failed:', error)
    ElMessage.error(t('copilot.config.saveFailed'))
  }
}

// 重置配置
async function resetConfig() {
  try {
    await ElMessageBox.confirm(
      t('copilot.config.resetConfirm'),
      t('copilot.config.resetTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    )

    const defaultConfig = await copilotClient.getDefaultConfig() || {}
    Object.assign(configForm, defaultConfig)

    ElMessage.success(t('copilot.config.resetSuccess'))
  }
  catch {
    // 用户取消
  }
}
</script>

<style scoped>
</style>
