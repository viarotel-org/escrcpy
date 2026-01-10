<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('subscribe.paymentTitle')"
    width="480px"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
    fullscreen
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
    @closed="onClosed"
  >
    <div class="h-full flex flex-col overflow-hidden">
      <!-- Order information -->
      <div class="flex-none bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-500">{{ $t('subscribe.planName') }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ dialog.options.plan?.name || dialog.options.plan?.ident }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-500">{{ $t('subscribe.payAmount') }}</span>
          <span class="text-xl font-bold text-primary-500">¥{{ totalPrice }}</span>
        </div>
      </div>

      <!-- Payment status -->
      <div
        v-loading="['generating'].includes(status)"
        class="flex flex-col justify-center items-center gap-4 py-4 flex-1 min-h-0"
        :element-loading-text="$t('subscribe.generatingOrder')"
      >
        <!-- Pending payment - show QR code -->
        <template v-if="status === 'pending'">
          <div
            ref="qrcodeRef"
          ></div>

          <div class="">
            <el-text size="large" class="mb-2" type="primary">
              {{ dialog.options.paymentType === 'wepay' ? $t('subscribe.scanWepay') : $t('subscribe.scanAlipay') }}
            </el-text>
          </div>

          <div class="">
            <el-text>
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              {{ $t('subscribe.waitingPayment') }}
            </el-text>
          </div>
        </template>

        <!-- Payment success -->
        <template v-else-if="status === 'success'">
          <el-icon class="text-5xl text-green-500 mb-4">
            <CircleCheck />
          </el-icon>
          <p class="text-lg font-medium text-gray-900 dark:text-white">
            {{ $t('subscribe.paymentSuccess') }}
          </p>
        </template>

        <!-- Payment failed / cancelled -->
        <template v-else-if="status === 'failed' || status === 'cancelled'">
          <el-icon class="text-5xl text-red-500 mb-4">
            <CircleClose />
          </el-icon>
          <p class="text-gray-600 dark:text-gray-400">
            {{ status === 'cancelled' ? $t('subscribe.paymentCancelled') : $t('subscribe.paymentFailed') }}
          </p>
          <el-button type="primary" class="mt-4" @click="retryPayment">
            {{ $t('subscribe.retry') }}
          </el-button>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="text-center">
        <el-button @click="handleClose">
          {{ status === 'success' ? $t('common.confirm') : $t('common.cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import { t } from '$/locales/index.js'
import subscribeClient from '$/services/subscribe/index.js'
import { ApiModelEnum } from '$copilot/dicts/api.js'
import { sleep } from '$/utils/index.js'

const emit = defineEmits(['update:modelValue', 'success'])

const dialog = useDialog()

const subscribeStore = useSubscribeStore()

const status = ref('generating') // generating | pending | success | failed | cancelled
const orderInfo = ref(null)
const checkingStatus = ref(false)
const qrcodeRef = ref(null)

let pollTimer = null

// Computed properties
const { totalPrice } = useSubscribePrice({
  billing_type: computed(() => dialog.options.plan.billing_type),
  price: computed(() => dialog.options.plan.price),
  discounts: computed(() => dialog.options.plan.discounts),
  quantity: computed(() => dialog.options.quantity),
  amount: computed(() => dialog.options.amount),
})

function open(options) {
  dialog.open(options)
  createOrder()
}

function onClosed() {
  stopPolling()
}

// Create order
async function createOrder() {
  if (!dialog.options.plan)
    return

  status.value = 'generating'

  try {
    const data = {
      plan_ident: dialog.options.plan.ident,
      type: dialog.options.paymentType,
    }

    if (dialog.options.plan.billing_type === 'SUBSCRIPTION') {
      data.quantity = dialog.options.quantity
    }
    else {
      data.amount = dialog.options.amount
    }

    const result = await subscribeClient.createPayOrder(data, subscribeStore.accessToken)

    if (result?.url) {
      orderInfo.value = result
      status.value = 'pending'

      // Generate QR code
      await nextTick()
      generateQRCode(result.url)

      // Start polling payment status
      startPolling()
    }
    else {
      throw new Error(t('subscribe.orderCreateFailed'))
    }
  }
  catch (error) {
    console.error('Create order failed:', error)
    status.value = 'failed'
    ElMessage.error(error.message || t('subscribe.orderCreateFailed'))
  }
}

// Generate QR code
async function generateQRCode(url) {
  if (!qrcodeRef.value)
    return

  try {
    qrcodeRef.value.innerHTML = ''
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, url, {
      width: 200,
      margin: 1,
    })
    qrcodeRef.value.appendChild(canvas)
  }
  catch (error) {
    console.error('Generate QRCode failed:', error)
  }
}

// Start polling payment status (every 2 seconds)
function startPolling() {
  stopPolling()

  pollTimer = setInterval(async () => {
    await checkPaymentStatus()
  }, 2000)
}

// Stop polling
function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

// Check payment status
async function checkPaymentStatus() {
  if (!orderInfo.value?.ident)
    return

  try {
    checkingStatus.value = true

    const result = await subscribeClient.getPayDetail(
      orderInfo.value.ident,
      subscribeStore.accessToken,
    )

    if (result?.status === 'PAID') {
      stopPolling()
      status.value = 'success'

      await sleep(1500)

      // Prompt user to configure Copilot
      const copilotConfig = window.appStore?.get('copilot') || {}

      if (copilotConfig.apiKey !== subscribeStore.accessToken) {
        try {
          await ElMessageBox.confirm(
            t('subscribe.config.tip'),
            t('subscribe.paymentSuccess'),
            {
              confirmButtonText: t('subscribe.config.now'),
              cancelButtonText: t('subscribe.config.later'),
              type: 'success',
            },
          )
          // User confirmed configuration
          await configureApiSettings()
          ElMessage.success(t('subscribe.config.success'))
        }
        catch {
        // User cancelled configuration
          console.log('[Subscribe] User cancelled Copilot configuration')
        }
      }

      dialog.options.onSuccess?.()
    }
    else if (result?.status === 'CANCEL') {
      stopPolling()
      status.value = 'cancelled'
    }
  }
  catch (error) {
    console.error('Check payment status failed:', error)
  }
  finally {
    checkingStatus.value = false
  }
}

// Configure API settings (auto-configure after successful payment)
async function configureApiSettings() {
  try {
    // Retrieve copilot config and update
    const copilotConfig = window.appStore?.get('copilot') || {}

    window.appStore?.set('copilot', {
      ...copilotConfig,
      apiKey: subscribeStore.accessToken,
      provider: 'Gitee',
      baseUrl: ApiModelEnum.Gitee,
      model: ApiModelEnum.named.Gitee.label,
    })

    console.log('[Subscribe] API settings configured successfully')
  }
  catch (error) {
    console.error('Configure API settings failed:', error)
  }
}

// Retry payment
function retryPayment() {
  createOrder()
}

// Close dialog
function handleClose() {
  if (status.value === 'success') {
    dialog.options.onSuccess?.()
  }

  dialog.close()
}

// Cleanup
onUnmounted(() => {
  stopPolling()
})

defineExpose({
  open,
})
</script>

<style scoped>
.qrcode-container {
  display: flex;
  justify-content: center;
}

.qrcode canvas {
  display: block;
}
</style>
