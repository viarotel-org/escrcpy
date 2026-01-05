<template>
  <div v-loading="loading" class="pr-2 pb-4">
    <el-alert
      v-if="isSubscribePlansAlertShow"
      class="!mt-4"
      :title="$t('subscribe.plans.alert')"
      type="primary"
      show-icon
      @close="onAlertClose"
    />

    <!-- 加载失败 -->
    <el-result
      v-if="loadError"
      icon="warning"
      :title="$t('subscribe.loadFailed')"
    >
      <template #extra>
        <el-button type="primary" icon="Refresh" @click="retryLoad">
          {{ $t('subscribe.retryLoad') }}
        </el-button>
      </template>
    </el-result>

    <!-- 订阅计费 -->
    <div v-else class="space-y-8">
      <div v-for="item of planModel" :key="item.label">
        <el-divider content-position="left" class="el-divider--plain">
          <div class="">
            {{ $t(item.label) }}
          </div>
        </el-divider>

        <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <PlanCard
            v-for="plan in item.children"
            :key="plan.ident"
            :plan="plan"
            @purchase="handlePurchase"
          />
        </div>
      </div>
    </div>

    <!-- 无套餐提示 -->
    <el-empty v-if="!subscriptionPlans.length && !usageBasedPlans.length" :description="$t('subscribe.noPlans')" :image-size="64">
      <template #image>
        <ElIconBox class=""></ElIconBox>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import PlanCard from './plan-card.vue'

const emit = defineEmits(['purchase'])

const subscribeStore = useSubscribeStore()

const isSubscribePlansAlertShow = useStorage('subscribe.plans.alert.show', true)

// 状态
const loading = ref(false)
const loadError = ref(false)

// 计算属性
const subscriptionPlans = computed(() => subscribeStore.subscriptionPlans)
const usageBasedPlans = computed(() => subscribeStore.usageBasedPlans)

const planModel = computed(() => {
  const value = [
    {
      label: 'subscribe.subscriptionPlans',
      children: subscriptionPlans.value,
    },
    {
      label: 'subscribe.usageBasedPlans',
      children: usageBasedPlans.value,
    },
  ]

  return value.filter(item => item.children.length > 0)
})

// 初始化
onMounted(async () => {
  if (!subscribeStore.paymentPlans.length) {
    await loadPlans()
  }
})

// 方法
function handlePurchase(params) {
  emit('purchase', params)
}

async function loadPlans() {
  loading.value = true
  loadError.value = false

  try {
    await subscribeStore.fetchAppInfo()
  }
  catch (error) {
    console.error('Failed to load plans:', error)
    loadError.value = true
    ElMessage.error($t('subscribe.loadFailed'))
  }
  finally {
    loading.value = false
  }
}

function retryLoad() {
  loadPlans()
}

function onAlertClose() {
  isSubscribePlansAlertShow.value = false
}
</script>

<style>
</style>
