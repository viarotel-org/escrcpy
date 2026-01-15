import { defineStore } from 'pinia'
import subscribeClient from '$/services/subscribe/index.js'

export const useSubscribeStore = defineStore('app-subscribe', () => {
  const userInfo = ref(null)
  const appInfo = ref(null)
  const paymentPlans = ref([])
  const loading = ref(false)

  const subscribeInfo = ref(window.electronStore.get('subscribe') ?? {})

  const accessToken = computed({
    get: () => {
      subscribeInfo.value = window.electronStore.get('subscribe') ?? {}
      return subscribeInfo.value.accessToken
    },
    set: (val) => {
      subscribeInfo.value.accessToken = val
      window.electronStore.set('subscribe.accessToken', val)
    },
  })

  const isLoggedIn = computed(() => !!accessToken.value)

  const subscriptionPlans = computed(() =>
    paymentPlans.value.filter(p => p.billing_type === 'SUBSCRIPTION'),
  )

  const usageBasedPlans = computed(() =>
    paymentPlans.value.filter(p => p.billing_type === 'USAGE_BASED'),
  )

  const purchaseStatus = computed(() => userInfo.value?.purchase_status || 'NOT_PURCHASED')

  const isActive = computed(() => purchaseStatus.value === 'ACTIVE')

  const currentPlanIdent = computed(() => userInfo.value?.pay_plan_ident || '')

  const displayUserName = computed(() => {
    if (!userInfo.value) {
      return 'User'
    }

    return userInfo.value.nickname || userInfo.value.email || userInfo.value.mobile || 'User'
  })

  init()

  window.electronStore.onDidChange('subscribe.accessToken', (val) => {
    if (val === accessToken.value) {
      return false
    }

    setAccessToken(val)
    init()
  })

  async function init() {
    if (!accessToken.value) {
      return false
    }

    try {
      await fetchUserInfo()
    }
    catch (error) {
      console.warn('[SubscribeStore] Fetch user info failed on init:', error)
    }
  }

  async function setAccessToken(token) {
    accessToken.value = token
  }

  async function fetchAppInfo() {
    try {
      loading.value = true
      const data = await subscribeClient.getAppInfo()
      if (data) {
        appInfo.value = data
        paymentPlans.value = data.payment_plans || []
      }
      return data
    }
    catch (error) {
      console.error('[SubscribeStore] Fetch app info failed:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  async function fetchUserInfo() {
    if (!accessToken.value)
      return null

    try {
      loading.value = true
      const data = await subscribeClient.getUserInfo(accessToken.value)
      if (data) {
        userInfo.value = data
      }
      return data
    }
    catch (error) {
      console.error('[SubscribeStore] Fetch user info failed:', error)
      if (error.status === 401) {
        logout()
      }
      throw error
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    accessToken.value = ''
    userInfo.value = null
  }

  function $reset() {
    accessToken.value = ''
    userInfo.value = null
    appInfo.value = null
    paymentPlans.value = []
    loading.value = false
  }

  return {
    accessToken,
    userInfo,
    appInfo,
    paymentPlans,
    loading,

    isLoggedIn,
    subscriptionPlans,
    usageBasedPlans,
    purchaseStatus,
    isActive,
    currentPlanIdent,
    displayUserName,

    init,
    setAccessToken,
    fetchAppInfo,
    fetchUserInfo,
    logout,
    $reset,
  }
})
