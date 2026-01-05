<template>
  <div v-loading="loading" class="flex h-full py-4 gap-4">
    <div class="flex-none">
      <el-card class="!rounded-xl h-full min-w-72" body-class="" shadow="hover">
        <div class="flex items-center gap-4 mb-6">
          <el-avatar :size="48" class="!bg-gradient-to-br !from-primary-300 !to-primary-500">
            <el-icon class="text-3xl">
              <User />
            </el-icon>
          </el-avatar>

          <div class="">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ subscribeStore.displayUserName }}
            </div>
            <el-tag
              :type="statusTagType"
              class="ml-auto"
            >
              {{ statusText }}
            </el-tag>
          </div>
        </div>

        <el-descriptions
          :column="1"
        >
          <el-descriptions-item
            :label="$t('subscribe.balance')"
            label-class-name="text-gray-500"
            content-class-name="text-gray-900 dark:text-white"
          >
            {{ (userInfo.balance || 0).toFixed(2) }}{{ $t('subscribe.perUnit') }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="userInfo.mobile"
            :label="$t('subscribe.mobile')"
            label-class-name="text-gray-500"
            content-class-name="text-gray-900 dark:text-white"
          >
            {{ userInfo.mobile }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="userInfo.email"
            :label="$t('subscribe.email')"
            label-class-name="text-gray-500"
            content-class-name="text-gray-900 dark:text-white"
          >
            {{ userInfo.email }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="$t('subscribe.registerTime')"
            label-class-name="text-gray-500"
            content-class-name="text-gray-900 dark:text-white"
          >
            {{ formatDate(userInfo.created_at) }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="userInfo.pay_plan_ident"
            :label="$t('subscribe.currentPlan')"
            label-class-name="text-gray-500"
            content-class-name="text-gray-900 dark:text-white"
          >
            {{ userInfo.pay_plan_ident }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <div class="flex-1 min-w-0">
      <Subscriptions />
    </div>
  </div>
</template>

<script setup>
import { t } from '$/locales/index.js'
import Subscriptions from './subscriptions/index.vue'

const emit = defineEmits(['switchTab'])

const subscribeStore = useSubscribeStore()

// 状态
const loading = ref(false)

// 计算属性
const userInfo = computed(() => subscribeStore.userInfo || {})

const statusTagType = computed(() => {
  const statusMap = {
    ACTIVE: 'success',
    EXPIRED: 'danger',
    EXHAUSTED: 'warning',
    NOT_PURCHASED: 'info',
  }
  return statusMap[userInfo.value?.purchase_status] || 'info'
})

const statusText = computed(() => {
  const statusMap = {
    ACTIVE: t('subscribe.statusActive'),
    EXPIRED: t('subscribe.statusExpired'),
    EXHAUSTED: t('subscribe.statusExhausted'),
    NOT_PURCHASED: t('subscribe.statusNotPurchased'),
  }
  return statusMap[userInfo.value?.purchase_status] || userInfo.value?.purchase_status
})

// 方法
function formatDate(timestamp) {
  if (!timestamp)
    return '-'
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 初始化
onMounted(async () => {
  loading.value = true
  try {
    await subscribeStore.fetchUserInfo()
  }
  finally {
    loading.value = false
  }
})
</script>

<style scoped>
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
