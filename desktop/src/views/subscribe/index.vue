<template>
  <div class="h-full flex flex-col overflow-hidden pt-1">
    <div class="flex-none flex items-center">
      <div class="flex-1 min-w-0">
        <el-segmented v-model="activeTab" class="el-segmented--child" :options="tabsModel">
          <template #default="{ item }">
            <div class="text-sm lg:text-base">
              {{ $t(item.label) }}
            </div>
          </template>
        </el-segmented>
      </div>

      <div class="flex-none">
        <UserProfile @login="onLoginClick" @logout="onLogoutClick" />
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-auto">
      <component :is="tabComponents[activeTab]" @purchase="onPurchaseClick" />
    </div>

    <PaymentDialog
      ref="paymentDialogRef"
    />

    <LoginDialog
      ref="loginDialogRef"
    />
  </div>
</template>

<script setup>
import UserProfile from './components/user-profile/index.vue'
import TabPlans from './components/tab-plans/index.vue'
import TabAccount from './components/tab-account/index.vue'
import TabOrders from './components/tab-orders/index.vue'
import TabFeedback from './components/tab-feedback/index.vue'
import PaymentDialog from './components/payment-dialog/index.vue'
import LoginDialog from './components/login-dialog/index.vue'

const subscribeStore = useSubscribeStore()

const activeTab = ref('plans')

provide('switchSubscribeTab', switchSubscribeTab)

const tabComponents = computed(() => {
  const value = {
    plans: TabPlans,
    account: TabAccount,
    orders: TabOrders,
    feedback: TabFeedback,
  }

  return value
})

const tabsModel = computed(() => {
  const value = [
    { label: 'subscribe.plans', value: 'plans' },
  ]

  if (subscribeStore.isLoggedIn) {
    value.push(
      { label: 'subscribe.account', value: 'account' },
      { label: 'subscribe.orders', value: 'orders' },
      { label: 'subscribe.feedback', value: 'feedback' },
    )
  }

  return value
})

const paymentDialogRef = ref(null)
const loginDialogRef = ref(null)

subscribeStore.init()

function onLoginClick() {
  loginDialogRef.value.open()
}
function onLogoutClick() {
  subscribeStore.logout()
  activeTab.value = 'plans'
}

async function onPurchaseClick(params) {
  // Check login status
  if (!subscribeStore.isLoggedIn) {
    try {
      // Show login dialog
      await loginDialogRef.value.open()
    }
    catch (error) {
      // User cancelled login
      return
    }
  }

  // Open payment dialog
  paymentDialogRef.value.open({
    plan: params.plan,
    paymentType: params.paymentType,
    quantity: params.quantity,
    amount: params.amount,
    onSuccess: () => {
      subscribeStore.init()
      activeTab.value = 'account'
    },
  })
}

function switchSubscribeTab(val) {
  activeTab.value = val
}
</script>

<style>
</style>
