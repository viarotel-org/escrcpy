<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('copilot.config.title')"
    width="95%"
    destroy-on-close
    append-to-body
    fullscreen
    center
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen config-dialog"
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <div class="h-full overflow-y-auto pr-2 pt-2">
      <el-form
        ref="configFormRef"
        :model="configForm"
        :rules="formRules"
        label-width="100px"
        class="config-form"
      >
        <div class="space-y-4">
          <el-card :header="$t('copilot.config.apiSection')" class="el-card--beautify" shadow="never">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  prop="provider"
                  :label="$t('copilot.config.provider')"
                >
                  <el-select
                    v-model="configForm.provider"
                    :placeholder="$t('copilot.config.providerPlaceholder')"
                    allow-create
                    filterable
                    class="w-full"
                    @change="onProviderChange"
                  >
                    <el-option v-for="item of providerOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  prop="model"
                  :label="$t('copilot.config.model')"
                >
                  <el-select
                    v-model="configForm.model"
                    :placeholder="$t('copilot.config.modelPlaceholder')"
                    allow-create
                    filterable
                    class="w-full"
                  >
                    <el-option v-for="item of modelOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item
                  prop="baseUrl"
                  :label="$t('copilot.config.baseUrl')"
                >
                  <el-input
                    v-model="configForm.baseUrl"
                    :placeholder="$t('copilot.config.baseUrlPlaceholder')"
                    clearable
                    class="config-input"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item
                  prop="apiKey"
                  :label="$t('copilot.config.apiKey')"
                >
                  <el-input
                    v-model="configForm.apiKey"
                    :type="showApiKey ? 'text' : 'password'"
                    :placeholder="$t('copilot.config.apiKeyPlaceholder')"
                    clearable
                    class="config-input"
                  >
                    <template #suffix>
                      <el-button
                        text
                        @click="showApiKey = !showApiKey"
                      >
                        <el-icon>
                          <View v-if="showApiKey" />
                          <Hide v-else />
                        </el-icon>
                      </el-button>
                    </template>

                    <template #append>
                      <el-button
                        v-if="subscribeStore.isLoggedIn && subscribeStore.isActive"
                        @click="onAutoConfigSubscribe"
                      >
                        {{ $t('subscribe.config.auto') }}
                      </el-button>

                      <el-button
                        v-else
                        @click="openSubscribePage"
                      >
                        {{ $t('subscribe.config.quickAcquire') }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <el-card :header="$t('copilot.config.executionSection')" class="el-card--beautify" shadow="never">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  prop="lang"
                  :label="$t('copilot.config.lang')"
                  class=""
                >
                  <el-radio-group v-model="configForm.lang" class="">
                    <el-radio-button value="cn">
                      {{ $t('copilot.config.langCn') }}
                    </el-radio-button>
                    <el-radio-button value="en">
                      {{ $t('copilot.config.langEn') }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="quiet"
                  :label="$t('copilot.config.quiet')"
                >
                  <el-switch v-model="configForm.quiet" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              prop="maxSteps"
              :label="$t('copilot.config.maxSteps')"
            >
              <div class="mb-6 flex items-center justify-between w-full">
                <div class="flex-none font-semibold text-base text-primary-500">
                  {{ configForm.maxSteps }}
                </div>

                <div class="flex-1 min-w-0 px-4">
                  <el-slider
                    v-model="configForm.maxSteps"
                    :min="1"
                    :max="500"
                    :step="5"
                    class=""
                    show-input
                  />
                </div>
              </div>
            </el-form-item>
          </el-card>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <el-button @click="resetConfig">
            <el-icon class="mr-1">
              <RefreshRight />
            </el-icon>
            {{ $t('copilot.config.reset') }}
          </el-button>
        </div>

        <div class="flex items-center">
          <el-button @click="dialog.close()">
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
import { t } from '$/locales/index.js'
import copilotClient from '$copilot/services/index.js'
import { ApiModelEnum } from '$copilot/dicts/api.js'
import { defaultCopilotConfigs } from '$copilot/configs/index.js'

const props = defineProps({

})

const emit = defineEmits([])

const subscribeStore = useSubscribeStore()

const dialog = useDialog()

// Indicate API key visibility
const showApiKey = ref(false)

// Form reference
const configFormRef = ref(null)

// Form data
const configForm = reactive({
  ...defaultCopilotConfigs,
})

// Form validation rules
const formRules = reactive({
  baseUrl: [
    {
      pattern: /^https?:\/\/.+/,
      message: t('copilot.config.baseUrlInvalid'),
      trigger: 'blur',
    },
  ],
  maxSteps: [
    {
      type: 'number',
      min: 1,
      max: 100,
      message: t('copilot.config.maxStepsRange') || 'Steps must be between 1 and 100',
      trigger: 'change',
    },
  ],
})

const modelOptions = computed(() => {
  return [...new Set(ApiModelEnum.labels)]
})

const providerOptions = computed(() => {
  return ApiModelEnum.keys
})

function onProviderChange(val) {
  configForm.model = ApiModelEnum.named[val].label
  configForm.baseUrl = ApiModelEnum[val]
}

async function onOpen() {
  subscribeStore.init()
  loadConfig()
}

// Load configuration
async function loadConfig() {
  const savedConfig = await copilotClient.getConfig() || {}

  Object.assign(configForm, {
    ...savedConfig,
  })

  // Reset form validation state
  if (configFormRef.value) {
    configFormRef.value.clearValidate()
  }
}

// Submit configuration
async function submitConfig() {
  try {
    // Validate form first
    const valid = await configFormRef.value.validate()
    if (!valid)
      return

    await copilotClient.setConfig({ ...toRaw(configForm) })
    ElMessage.success(t('copilot.config.saveSuccess'))
    dialog.close()
  }
  catch (error) {
    // Validation errors are shown automatically
    if (error.name !== 'ValidationError') {
      console.error('Config save failed:', error)
      ElMessage.error(t('copilot.config.saveFailed'))
    }
  }
}

// Open subscribe page
function openSubscribePage() {
  // Notify main window via IPC to navigate to subscribe page
  window.electron?.ipcRenderer.invoke('navigate-to-route', '/subscribe')
}

// Import Copilot configuration from subscription
async function onAutoConfigSubscribe() {
  try {
    configForm.provider = 'Gitee'
    configForm.baseUrl = 'https://ai.gitee.com/v1'
    configForm.apiKey = subscribeStore.accessToken
    configForm.model = 'AutoGLM-Phone-9B-Multilingual'

    copilotClient.setConfig({ ...toRaw(configForm) })

    ElMessage.success(t('common.success'))
  }
  catch (error) {
    console.error('onAutoConfigSubscribe.error:', error)
    ElMessage.error(t('common.failed'))
  }
}

// Reset configuration
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

    Object.assign(configForm, {
      ...defaultCopilotConfigs,
    })

    // Reset form validation state
    if (configFormRef.value) {
      configFormRef.value.clearValidate()
    }

    ElMessage.success(t('copilot.config.resetSuccess'))
  }
  catch {
    // User cancelled
  }
}

defineExpose({
  ...dialog,
})
</script>

<style>
</style>
