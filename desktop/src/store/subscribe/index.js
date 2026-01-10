/**
 * Subscribe Store - Subscription billing state management
 */
import { defineStore } from 'pinia'
import subscribeClient from '$/services/subscribe/index.js'

export const useSubscribeStore = defineStore('app-subscribe', () => {
  // State
  const accessToken = ref('')
  const userInfo = ref(null)
  const appInfo = ref(null)
  const paymentPlans = ref([])
  const loading = ref(false)

  // Computed properties
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

  // Initialization
  async function init() {
    if (!accessToken.value) {
      return false
    }

    try {
      await fetchUserInfo()
    }
    catch (error) {
      // Ignore fetch user info failure (token may have expired)
      console.warn('[SubscribeStore] Fetch user info failed on init:', error)
    }
  }

  // Set access token
  async function setAccessToken(token) {
    accessToken.value = token
    subscribeClient.accessToken = token
  }

  // Fetch app information
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

  // Fetch user information
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
      // Token invalid, clear login state
      if (error.status === 401) {
        logout()
      }
      throw error
    }
    finally {
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    accessToken.value = ''
    userInfo.value = null
    subscribeClient.accessToken = ''
  }

  // Reset
  function $reset() {
    accessToken.value = ''
    userInfo.value = null
    appInfo.value = null
    paymentPlans.value = []
    loading.value = false
  }

  return {
    // State
    accessToken,
    userInfo,
    appInfo,
    paymentPlans,
    loading,

    // Computed
    isLoggedIn,
    subscriptionPlans,
    usageBasedPlans,
    purchaseStatus,
    isActive,
    currentPlanIdent,
    displayUserName,

    // Methods
    init,
    setAccessToken,
    fetchAppInfo,
    fetchUserInfo,
    logout,
    $reset,
  }
},
{
  persist: {
    paths: ['accessToken'],
  },
})
