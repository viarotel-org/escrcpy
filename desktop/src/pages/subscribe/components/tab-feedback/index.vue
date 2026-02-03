<template>
  <div class="py-4 pr-2">
    <el-card class="!rounded-xl" body-class="!py-8" shadow="never">
      <el-form ref="formRef" :model="formInfo" :rules="formRules" label-position="right" label-width="120px" class="">
        <el-form-item :label="$t('subscribe.feedbackType')" prop="type">
          <el-radio-group v-model="formInfo.type">
            <el-radio-button value="BUG">
              {{ $t('subscribe.feedbackBug') }}
            </el-radio-button>
            <el-radio-button value="SUGGESTION">
              {{ $t('subscribe.feedbackSuggestion') }}
            </el-radio-button>
            <el-radio-button value="OTHER">
              {{ $t('subscribe.feedbackOther') }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('subscribe.feedbackDesc')" prop="description">
          <el-input
            v-model="formInfo.description"
            type="textarea"
            resize="vertical"
            :autosize="{ minRows: 2 }"
            :placeholder="$t('subscribe.feedbackDescPlaceholder')"
            maxlength="2500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('subscribe.feedbackAttachment')">
          <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :limit="3"
            :auto-upload="false"
            accept="image/jpeg,image/png,image/webp"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="text-gray-400 text-xs mt-2">
                {{ $t('subscribe.feedbackAttachmentTip') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('subscribe.feedback.contact')" prop="contact">
          <el-input
            v-model="formInfo.contact"
            :placeholder="$t('subscribe.feedback.contact.placeholder')"
          />
        </el-form-item>

        <el-form-item label="" class="">
          <el-button
            type="primary"
            size="default"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ $t('subscribe.submitFeedback') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import subscribeClient from '$/services/subscribe/index.js'

const subscribeStore = useSubscribeStore()

// Form
const formRef = ref(null)

const formInfo = reactive({
  type: 'SUGGESTION',
  description: '',
  contact_type: '',
  contact: '',
})

const subscribeValidator = reactive(
  useSubscribeValidator({
    input: computed(() => formInfo.contact),
  }),
)

const fileList = ref([])

const submitting = ref(false)

// Form rules
const formRules = {
  type: [
    { required: true, message: t('subscribe.feedbackTypeRequired'), trigger: 'change' },
  ],
  description: [
    { required: true, message: t('subscribe.feedbackDescRequired'), trigger: 'blur' },
    { min: 10, max: 2500, message: t('subscribe.feedbackDescMinLength'), trigger: 'blur' },
  ],
  contact: [
    {
      validator: (rule, value, callback) => {
        if (!subscribeValidator.isEmailOrPhoneNumber) {
          callback(new Error(t('subscribe.accountInvalid')))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// Methods
function handleExceed() {
  ElMessage.warning(t('subscribe.feedbackMaxFiles'))
}

function beforeUpload(file) {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error(t('subscribe.feedbackInvalidFileType'))
    return false
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(t('subscribe.feedbackFileTooLarge'))
    return false
  }

  return true
}

async function handleSubmit() {
  if (!formRef.value)
    return

  try {
    await formRef.value.validate()
  }
  catch {
    return
  }

  try {
    submitting.value = true

    const attachments = fileList.value.map(item => item.raw)

    const data = {
      type: formInfo.type,
      description: formInfo.description,
      attachments,
      contact_type: subscribeValidator.channelType,
      contact: formInfo.contact || null,
    }

    const result = await subscribeClient.submitFeedback(data, subscribeStore.accessToken)

    if (result === true || result) {
      ElMessage.success(t('subscribe.feedbackSuccess'))
      // Reset form
      formRef.value.resetFields()
      fileList.value = []
    }
    else {
      throw new Error(t('subscribe.feedbackFailed'))
    }
  }
  catch (error) {
    console.error('Submit feedback failed:', error)
    ElMessage.error(error.message || t('subscribe.feedbackFailed'))
  }
  finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>
