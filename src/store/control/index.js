import { isEqual } from 'lodash-es'

export const useControlStore = defineStore('app-control', () => {
  const barLayout = ref([])

  const swapyKey = computed(() => barLayout.value.join())

  // 初始化布局
  const getBarLayout = () => {
    barLayout.value = window.appStore.get('control.barLayout') || []
    return barLayout.value
  }

  // 设置布局
  const setBarLayout = async (value) => {
    if (!Array.isArray(value)) {
      throw new TypeError('parameter must be an array')
    }

    if (isEqual(value, barLayout.value)) {
      return false
    }

    barLayout.value = value
    window.appStore.set('control.barLayout', value)
  }

  // 订阅外部变更
  function setupWatcher() {
    window.appStore.onDidChange('control.barLayout', () => {
      getBarLayout()
    })
  }

  getBarLayout()
  setupWatcher()

  return {
    barLayout,
    swapyKey,
    getBarLayout,
    setBarLayout,
  }
})
