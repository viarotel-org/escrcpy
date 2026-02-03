<template>
  <div class="space-y-4 h-full overflow-auto pr-2">
    <template v-if="subscriptions.length">
      <el-card
        v-for="(sub, index) of subscriptions"
        :key="sub.id"
        class="!rounded-xl"
        body-class=""
        shadow="hover"
      >
        <el-descriptions
          :column="2"
          :title="`${$t('subscribe.subscriptionInfo')}-${index + 1}`"
        >
          <el-descriptions-item :label="$t('subscribe.detail.planIdent')" class="text-gray-700">
            {{ sub.pay_plan_ident }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.billingType')">
            <el-tag
              :type="sub.billing_type === 'SUBSCRIPTION' ? 'primary' : 'success'"
              size="small"
            >
              {{ sub.billing_type === 'SUBSCRIPTION' ? $t('subscribe.detail.billingTypeSubscription') : $t('subscribe.detail.billingTypeUsage') }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item
            v-if="sub.billing_type === 'USAGE_BASED'"
            :label="$t('subscribe.detail.billingMultiplier')"
          >
            {{ sub.billing_multiplier || '-' }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.status')">
            <el-tag
              :type="sub.status === 'ACTIVE' ? 'success' : 'warning'"
              size="small"
            >
              {{ sub.status === 'ACTIVE' ? $t('subscribe.statusActive') : $t('subscribe.pendingOrders') }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.totalRecharge')">
            ¥{{ sub.amount }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="sub.billing_type === 'USAGE_BASED'"
            :label="$t('subscribe.balance')"
          >
            ¥{{ sub.balance }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.effectiveAt')">
            {{ formatTime(sub.effective_at) }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.expireAt')">
            {{ formatTime(sub.expired_at) }}
          </el-descriptions-item>

          <el-descriptions-item :label="$t('subscribe.detail.subscriptionId')" class="text-gray-700">
            <span class="font-mono text-sm">{{ sub.id }}</span>
          </el-descriptions-item>

          <el-descriptions-item
            v-for="(discount, discountIndex) of sub.discounts"
            :key="`discount_${discountIndex}`"
            :label="discount.type === 'AMOUNT' ? $t('subscribe.detail.discountAmountLabel') : $t('subscribe.detail.discountFreeLabel')"
          >
            {{ discount.value }}
            <span class="text-gray-600 font-normal ml-1">
              {{ getUnitText(discount.unit) }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </template>

    <el-card
      v-else
      class="!rounded-xl"
      body-class=""
      shadow="hover"
    >
      <el-result type="info" :title="$t('subscribe.notPurchased')">
        <template #extra>
          <el-button type="primary" @click="onGoToSubscribe">
            {{ $t('subscribe.goToSubscribe') }}
          </el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup>
const subscribeStore = useSubscribeStore()

const userInfo = computed(() => subscribeStore.userInfo || {})

const subscriptions = computed(() => userInfo.value.subscriptions || [])

// Reactive check for mobile
const isMobile = computed(() => {
  return window.innerWidth < 768
})

const switchSubscribeTab = inject('switchSubscribeTab')

// Convert timestamp to formatted date
const formatTime = (timestamp) => {
  if (!timestamp)
    return '-'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Discount unit text mapping
const getUnitText = (unit) => {
  const unitMap = {
    CNY: t('subscribe.perUnit'),
    DAY: t('time.unit.day'),
    WEEK: t('time.unit.week'),
    MONTH: t('time.unit.month'),
    YEAR: t('time.unit.year'),
  }
  return unitMap[unit] || unit
}

function onGoToSubscribe() {
  switchSubscribeTab('plans')
}

// Listen to window size changes
onMounted(() => {
  window.addEventListener('resize', () => {
    // Trigger reactive update
    isMobile.value = window.innerWidth < 768
  })
})
</script>
