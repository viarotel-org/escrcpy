import { isEqual } from 'lodash-es'

export const useControlStore = defineStore('app-control', () => {
  const barLayout = ref([])

  const swapyKey = ref('')

  function getBarLayout() {
    barLayout.value = window.$preload.store.get('control.barLayout') || []
    return barLayout.value
  }

  function setBarLayout(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('parameter must be an array')
    }

    if (isEqual(value, barLayout.value)) {
      return false
    }

    barLayout.value = value

    updateSwapyKey()

    window.$preload.store.set('control.barLayout', value)
  }

  function setupWatcher() {
    window.$preload.store.onDidChange('control.barLayout', () => {
      getBarLayout()
    })
  }

  async function updateSwapyKey() {
    await nextTick()
    swapyKey.value = barLayout.value.join()
  }

  getBarLayout()
  updateSwapyKey()
  setupWatcher()

  return {
    barLayout,
    swapyKey,
    getBarLayout,
    setBarLayout,
  }
})
