/**
 * Subscribe Store - 订阅计费模块状态管理
 */
import { defineStore } from 'pinia'
import subscribeClient from '$/services/subscribe/index.js'

export const useSubscribeStore = defineStore('app-subscribe', () => {
  // 状态
  const accessToken = ref('')
  const userInfo = ref(null)
  const appInfo = ref(null)
  const paymentPlans = ref([])
  const loading = ref(false)

  // 计算属性
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

  // 初始化
  async function init() {
    if (!accessToken.value) {
      return false
    }

    try {
      await fetchUserInfo()
    }
    catch (error) {
      // 忽略用户信息获取失败（可能 token 已过期）
      console.warn('[SubscribeStore] Fetch user info failed on init:', error)
    }
  }

  // 设置访问令牌
  async function setAccessToken(token) {
    accessToken.value = token
    subscribeClient.accessToken = token
  }

  // 获取应用信息
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

  // 获取用户信息
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
      // Token 无效，清除登录状态
      if (error.status === 401) {
        logout()
      }
      throw error
    }
    finally {
      loading.value = false
    }
  }

  // 登出
  async function logout() {
    accessToken.value = ''
    userInfo.value = null
    subscribeClient.accessToken = ''
  }

  // 重置
  function $reset() {
    accessToken.value = ''
    userInfo.value = null
    appInfo.value = null
    paymentPlans.value = []
    loading.value = false
  }

  return {
    // 状态
    accessToken,
    userInfo,
    appInfo,
    paymentPlans,
    loading,

    // 计算属性
    isLoggedIn,
    subscriptionPlans,
    usageBasedPlans,
    purchaseStatus,
    isActive,
    currentPlanIdent,
    displayUserName,

    // 方法
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
