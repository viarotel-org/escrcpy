import { defineStore } from 'pinia'

export const useControlStore = defineStore('app-control', () => {
  const barLayout = ref([])

  getBarLayout()

  function getBarLayout() {
    barLayout.value = window.appStore.get('control.barLayout') || []
    return barLayout.value
  }

  function setBarLayout(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('parameter must be an array')
    }

    barLayout.value = value
    window.appStore.set('control.barLayout', value)
  }

  return {
    barLayout,
    setBarLayout,
    getBarLayout,
    update: getBarLayout,
  }
})
