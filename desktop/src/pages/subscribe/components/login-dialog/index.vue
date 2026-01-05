<template>
  <el-dialog
    v-model="visible"
    :title="$t('subscribe.loginTitle')"
    width="500px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div class="space-y-8 pb-4">
      <div class="text-center space-y-4">
        <el-avatar class="!size-16 !bg-gradient-to-br !from-primary-500 !to-primary-600">
          <el-icon class="text-3xl text-white">
            <ElIconUser />
          </el-icon>
        </el-avatar>

        <div class="text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('subscribe.loginDesc') }}
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form ref="formRef" :model="formInfo" :rules="formRules" @submit.prevent="handleSubmit">
        <!-- 账号输入 -->
        <el-form-item prop="account">
          <el-input
            v-model="formInfo.account"
            size="default"
            :placeholder="$t('subscribe.accountPlaceholder')"
            :prefix-icon="subscribeValidator.channelType === 'email' ? 'Message' : 'Iphone'"
            clearable
          />
        </el-form-item>

        <!-- 验证码输入 -->
        <el-form-item prop="code">
          <div class="flex gap-3 w-full">
            <el-input
              v-model="formInfo.code"
              size="default"
              :placeholder="$t('subscribe.codePlaceholder')"
              prefix-icon="Key"
              maxlength="6"
              class="flex-1"
              @keyup.enter="handleSubmit"
            />
            <el-button
              size="default"
              :loading="smsCountdown.loading"
              :disabled="smsCountdown.value > 0 || !subscribeValidator.isEmailOrPhoneNumber"
              @click="onSmsClick"
            >
              {{ smsCountdown.value > 0 ? `${smsCountdown.value}s` : $t('subscribe.sendCode') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button size="default" @click="visible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="default"
        :loading="logging"
        @click="handleSubmit"
      >
        {{ $t('subscribe.login') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { t } from '$/locales/index.js'
import subscribeClient from '$/services/subscribe/index.js'

const visible = ref(false)

const subscribeStore = useSubscribeStore()

const smsCountdown = reactive(useSmsCountdown())

// 表单
const formRef = ref(null)

const formInfo = reactive({
  account: '',
  code: '',
})

const subscribeValidator = reactive(
  useSubscribeValidator({
    input: computed(() => formInfo.account),
  }),
)

// 表单规则
const formRules = {
  account: [
    { required: true, message: t('subscribe.accountRequired'), trigger: 'blur' },
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
  code: [
    { required: true, message: t('subscribe.codeRequired'), trigger: 'blur' },
    { len: 6, message: t('subscribe.codeLength'), trigger: 'blur' },
  ],
}

// 状态
const logging = ref(false)

// resolve/reject 用于 Promise
let resolveLogin = null
let rejectLogin = null

async function onSmsClick() {
  try {
    smsCountdown.loading = true

    const data = {
      channel_type: subscribeValidator.channelType,
    }

    if (subscribeValidator.channelType === 'email') {
      data.email = formInfo.account.trim()
    }
    else {
      data.mobile = formInfo.account.trim()
    }

    await subscribeClient.sendVerifyCode(data)

    ElMessage.success(t('subscribe.codeSent'))

    smsCountdown.start()
  }
  catch (error) {
    console.error('Send code failed:', error)
    ElMessage.error(error.message || t('subscribe.codeSendFailed'))
  }
  finally {
    smsCountdown.loading = false
  }
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
    logging.value = true

    const data = {
      channel_type: subscribeValidator.channelType,
      code: formInfo.code.trim(),
    }

    if (subscribeValidator.channelType === 'email') {
      data.email = formInfo.account.trim()
    }
    else {
      data.mobile = formInfo.account.trim()
    }

    const result = await subscribeClient.getUserToken(data)

    if (result?.access_token) {
      // 保存令牌
      await subscribeStore.setAccessToken(result.access_token)

      await subscribeStore.init()

      // 登录成功
      visible.value = false
      ElMessage.success(t('subscribe.loginSuccess'))

      // resolve Promise
      if (resolveLogin) {
        resolveLogin(result)
      }
    }
    else {
      throw new Error(t('subscribe.loginFailed'))
    }
  }
  catch (error) {
    console.error('Login failed:', error)
    ElMessage.error(error.message || t('subscribe.loginFailed'))

    // reject Promise
    if (rejectLogin) {
      rejectLogin(error)
    }
  }
  finally {
    logging.value = false
  }
}

function handleClosed() {
  // 重置表单
  formRef.value?.resetFields()
  formInfo.account = ''
  formInfo.code = ''

  smsCountdown.reset()

  // reject Promise（如果用户关闭对话框）
  if (rejectLogin) {
    rejectLogin(new Error('Login cancelled'))
    rejectLogin = null
  }
}

// 打开对话框（返回 Promise）
function open() {
  visible.value = true

  return new Promise((resolve, reject) => {
    resolveLogin = resolve
    rejectLogin = reject
  })
}

// 清理
onUnmounted(() => {
  smsCountdown.reset()
})

// 暴露方法
defineExpose({
  open,
})
</script>

<style>
</style>
