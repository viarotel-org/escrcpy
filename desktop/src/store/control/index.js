import { isEqual } from 'lodash-es'

export const useControlStore = defineStore('app-control', () => {
  const barLayout = ref([])

  const swapyKey = computed(() => barLayout.value.join())

  // Initialize layout
  const getBarLayout = () => {
    barLayout.value = window.$preload.store.get('control.barLayout') || []
    return barLayout.value
  }

  // Set layout
  const setBarLayout = async (value) => {
    if (!Array.isArray(value)) {
      throw new TypeError('parameter must be an array')
    }

    if (isEqual(value, barLayout.value)) {
      return false
    }

    barLayout.value = value
    window.$preload.store.set('control.barLayout', value)
  }

  // Subscribe to external changes
  function setupWatcher() {
    window.$preload.store.onDidChange('control.barLayout', () => {
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
