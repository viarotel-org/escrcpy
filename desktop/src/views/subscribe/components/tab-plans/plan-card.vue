<template>
  <el-card class="!rounded-xl" body-class="" shadow="hover">
    <div class="space-y-2">
      <!-- Plan information -->
      <div class="flex items-start">
        <div class="flex-1 min-w-0">
          <div class="text-xl font-semibold">
            {{ plan.name || plan.ident }}
          </div>
        </div>

        <!-- Tag row -->
        <div class="flex items-center gap-2 mb-3 flex-none">
          <!-- Discount tags -->
          <template v-for="(discount, index) in plan.discounts" :key="index">
            <el-tag
              v-if="discount.start_time || discount.end_time"
            >
              {{ $t('subscribe.discountLimited') }}
              <el-tooltip
                class=""
                effect="light"
                :content="formatDiscountPeriod(discount)"
                placement="top"
              >
                <el-link icon="InfoFilled" type="primary" class="!-mt-px" underline="never"></el-link>
              </el-tooltip>
            </el-tag>

            <el-tag type="primary">
              {{ formatDiscountTag(discount) }}
            </el-tag>
          </template>

          <el-tag
            v-if="plan.billing_type === 'SUBSCRIPTION'"
            size="small"
          >
            {{ $t('subscribe.subscription') }}
          </el-tag>
          <el-tag v-else type="primary">
            {{ $t('subscribe.usageBased') }}

            <el-tooltip
              class=""
              effect="light"
              :content="$t('subscribe.usageBasedInfo', {
                tokenPrice: (1.4 * plan.billing_multiplier).toFixed(2),
                requestPrice: (0.01 * plan.billing_multiplier).toFixed(3),
              })"
              placement="top"
            >
              <el-link icon="InfoFilled" type="primary" class="!-mt-px" underline="never"></el-link>
            </el-tooltip>
          </el-tag>
        </div>
      </div>

      <!-- Price display -->
      <div class="pb-2">
        <template v-if="plan.billing_type === 'SUBSCRIPTION'">
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-primary-500">
              {{ totalPrice }}
            </span>

            <span class="text-sm text-gray-500">{{ $t('subscribe.perUnit') }} </span>

            <span
              v-if="hasDiscount"
              class="text-lg text-gray-400 line-through"
            >
              {{ originalTotalPrice }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-primary-500">
              {{ totalPrice }}
            </span>

            <span class="text-sm text-gray-500">
              {{ $t('subscribe.perUnit') }} / ({{ $t('subscribe.usageBasedDesc') }})
            </span>
          </div>
        </template>
      </div>

      <!-- Subscription: quantity selector -->
      <div v-if="plan.billing_type === 'SUBSCRIPTION'" class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {{ $t('subscribe.quantity') }}
        </span>

        <el-input-number
          v-model="quantity"
          :min="1"
          :max="100"
          class="flex-none"
        />

        <span class="text-sm text-gray-500">{{ periodText }}</span>
      </div>

      <!-- Usage-based: top-up amount -->
      <div v-if="plan.billing_type === 'USAGE_BASED'" class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {{ $t('subscribe.amount') }}
        </span>
        <el-input-number
          v-model="amount"
          :min="1"
          :max="10000"
          :precision="2"
          :step="1"
          class="flex-none"
        />
        <span class="text-sm text-gray-500">{{ $t('subscribe.perUnit') }}</span>
      </div>

      <!-- Payment method -->
      <div class="flex items-center gap-2">
        <span class="flex-none text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {{ $t('subscribe.paymentMethod') }}
        </span>

        <el-radio-group v-model="paymentType" class="flex-1 min-w-0">
          <el-radio value="wepay" class="max-w-14">
            {{ $t('subscribe.wepay') }}
          </el-radio>
          <el-radio value="alipay" class="max-w-14">
            {{ $t('subscribe.alipay') }}
          </el-radio>
        </el-radio-group>

        <el-button
          :size="$grid.xl ? 'large' : 'default'"
          type="primary"
          :icon="['SUBSCRIPTION'].includes(plan.billing_type) ? 'Goods' : 'CreditCard'"
          @click="handlePurchase"
        >
          {{ ['SUBSCRIPTION'].includes(plan.billing_type) ? $t('subscribe.buyNow') : $t('subscribe.recharge') }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['purchase'])

// State
const quantity = ref(1)
const amount = ref(1)
const paymentType = ref('wepay')

const { totalPrice, originalTotalPrice } = useSubscribePrice({
  billing_type: computed(() => props.plan.billing_type),
  price: computed(() => props.plan.price),
  discounts: computed(() => props.plan.discounts),
  quantity,
  amount,
})

// Computed properties
const periodText = computed(() => {
  const periodMap = {
    YEAR: t('subscribe.perYear'),
    MONTH: t('subscribe.perMonth'),
    DAY: t('subscribe.perDay'),
    NONE: t('subscribe.permanent'),
  }
  const period = props.plan.period || 'MONTH'
  const periodQuantity = props.plan.period_quantity || 1

  if (periodQuantity === 1) {
    return periodMap[period] || period
  }
  return `${periodQuantity}${periodMap[period] || period}`
})

const hasDiscount = computed(() => {
  return props.plan.discounts?.some(d => d.type === 'AMOUNT')
})

// Methods
function formatDiscountTag(discount) {
  // Amount discount
  if (discount.type === 'AMOUNT') {
    // For usage-based billing show gift amount; for subscriptions show discount amount
    if (props.plan.billing_type === 'USAGE_BASED') {
      return t('subscribe.giftAmount', { value: discount.value })
    }
    return t('subscribe.discountAmountValue', { value: discount.value })
  }
  // Free gift
  else if (discount.type === 'FREE') {
    const unitMap = {
      DAY: t('time.unit.day'),
      WEEK: t('time.unit.week'),
      MONTH: t('time.unit.month'),
      YEAR: t('time.unit.year'),
      CNY: t('subscribe.perUnit'),
    }
    return t('subscribe.giftPeriod', {
      value: discount.value,
      unit: unitMap[discount.unit] || discount.unit,
    })
  }
  return ''
}

// Format discount validity period
function formatDiscountPeriod(discount) {
  if (!discount.start_time && !discount.end_time) {
    return t('subscribe.longTermDiscount')
  }

  const formatDate = (timestamp) => {
    if (!timestamp)
      return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const start = discount.start_time ? formatDate(discount.start_time) : ''
  const end = discount.end_time ? formatDate(discount.end_time) : ''

  if (start && end) {
    return `${start} ~ ${end}`
  }
  else if (start) {
    return t('subscribe.effectiveFrom', { date: start })
  }
  else if (end) {
    return t('subscribe.effectiveUntil', { date: end })
  }

  return ''
}

function handlePurchase() {
  emit('purchase', {
    plan: props.plan,
    paymentType: paymentType.value,
    quantity: quantity.value,
    amount: amount.value,
  })
}
</script>

<style>
</style>
