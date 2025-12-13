<template>
  <el-dialog
    v-model="visible"
    :title="$t('copilot.config.title')"
    width="600px"
    :close-on-click-modal="false"
    @open="loadConfig"
  >
    <el-form
      ref="configFormRef"
      :model="configForm"
      :rules="configRules"
      label-width="120px"
      label-position="left"
    >
      <!-- API 配置区 -->
      <el-divider content-position="left">
        <el-icon class="mr-1">
          <Connection />
        </el-icon>
        {{ $t('copilot.config.apiSection') }}
      </el-divider>

      <el-form-item :label="$t('copilot.config.baseUrl')" prop="baseUrl">
        <el-input
          v-model="configForm.baseUrl"
          :placeholder="$t('copilot.config.baseUrlPlaceholder')"
          clearable
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('copilot.config.apiKey')" prop="apiKey">
        <el-input
          v-model="configForm.apiKey"
          :type="showApiKey ? 'text' : 'password'"
          :placeholder="$t('copilot.config.apiKeyPlaceholder')"
          clearable
        >
          <template #prefix>
            <el-icon><Key /></el-icon>
          </template>
          <template #suffix>
            <el-icon
              class="cursor-pointer hover:text-primary-500"
              @click="showApiKey = !showApiKey"
            >
              <View v-if="showApiKey" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('copilot.config.model')" prop="model">
        <el-select
          v-model="configForm.model"
          :placeholder="$t('copilot.config.modelPlaceholder')"
          allow-create
          filterable
          class="w-full"
        >
          <el-option label="autoglm-phone" value="autoglm-phone" />
          <el-option label="GLM-4V-Plus" value="GLM-4V-Plus" />
          <el-option label="GLM-4V" value="GLM-4V" />
        </el-select>
      </el-form-item>

      <!-- 执行配置区 -->
      <el-divider content-position="left">
        <el-icon class="mr-1">
          <Setting />
        </el-icon>
        {{ $t('copilot.config.executionSection') }}
      </el-divider>

      <el-form-item :label="$t('copilot.config.maxSteps')" prop="maxSteps">
        <el-input-number
          v-model="configForm.maxSteps"
          :min="1"
          :max="100"
          :step="5"
          class="w-full"
        />
        <div class="text-xs text-gray-400 mt-1">
          {{ $t('copilot.config.maxStepsHint') }}
        </div>
      </el-form-item>

      <el-form-item :label="$t('copilot.config.lang')" prop="lang">
        <el-select
          v-model="configForm.lang"
          :placeholder="$t('copilot.config.langPlaceholder')"
          allow-create
          filterable
          class="w-full"
        >
          <el-option :label="$t('copilot.config.langCn')" value="cn" />
          <el-option :label="$t('copilot.config.langEn')" value="en" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('copilot.config.quiet')" prop="quiet">
        <el-switch v-model="configForm.quiet" />
        <span class="ml-2 text-xs text-gray-400">
          {{ $t('copilot.config.quietHint') }}
        </span>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-between">
        <el-button @click="resetConfig">
          <el-icon class="mr-1">
            <RefreshRight />
          </el-icon>
          {{ $t('copilot.config.reset') }}
        </el-button>
        <div class="space-x-2">
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
import { reactive, ref, watch } from 'vue'
import {
  Check,
  Connection,
  Hide,
  Key,
  Link,
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

// 表单引用
const configFormRef = ref(null)

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

// 表单校验规则
const configRules = {
  baseUrl: [
    { required: true, message: () => t('copilot.config.baseUrlRequired'), trigger: 'blur' },
    {
      pattern: /^https?:\/\/.+/,
      message: () => t('copilot.config.baseUrlInvalid'),
      trigger: 'blur',
    },
  ],
  apiKey: [
    { required: true, message: () => t('copilot.config.apiKeyRequired'), trigger: 'blur' },
  ],
  maxSteps: [
    { required: true, message: () => t('copilot.config.maxStepsRequired'), trigger: 'change' },
    {
      type: 'number',
      min: 1,
      max: 100,
      message: () => t('copilot.config.maxStepsRange'),
      trigger: 'change',
    },
  ],
}

// 加载配置
const loadConfig = async () => {
  const defaultConfig = await copilotClient.getDefaultConfig() || {}
  const savedConfig = await copilotClient.getConfig() || {}

  Object.assign(configForm, {
    ...defaultConfig,
    ...savedConfig,
  })
}

// 提交配置
const submitConfig = async () => {
  try {
    await configFormRef.value?.validate()

    // 保存配置
    await copilotClient.setConfig(null, { ...toRaw(configForm) })

    ElMessage.success(t('copilot.config.saveSuccess'))
    visible.value = false
  }
  catch (error) {
    console.error('Config validation failed:', error)
  }
}

// 重置配置
const resetConfig = async () => {
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
/* 自定义样式 */
</style>
