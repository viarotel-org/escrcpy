import { computed, onUnmounted, ref, watchEffect } from 'vue'

export function useScaleScreen(options = {}) {
  const display = ref(null)
  const zoomScale = ref(0)
  const aspectScale = ref(0)

  const screenWidth = computed(() => display.value?.bounds?.width || 0)
  const screenHeight = computed(() => display.value?.bounds?.height || 0)

  const containerRef = computed(() => options.containerRef?.value)
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  const resizeObserver = ref(null)

  getPrimaryDisplay()

  watchEffect(() => {
    // 断开之前的观察
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }

    if (!containerRef?.value || !display.value) {
      return
    }

    // 初始计算
    updateContainerDimensions()

    // 设置 ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver.value = new ResizeObserver(() => {
        updateContainerDimensions()
      })
      resizeObserver.value.observe(containerRef.value)
    }
  })

  // 更新容器尺寸和缩放比例的函数
  function updateContainerDimensions() {
    if (!containerRef?.value || !display.value) {
      return false
    }

    const originalWidth = containerRef.value.offsetWidth
    const originalHeight = containerRef.value.offsetHeight

    zoomScale.value = Math.min(
      originalWidth / screenWidth.value,
      originalHeight / screenHeight.value,
    )

    aspectScale.value = screenWidth.value / screenHeight.value

    getContainerAspectScaleRect({
      originalWidth,
      originalHeight,
      dimension: 'height',
    })
  }

  async function getPrimaryDisplay() {
    display.value = await window.electron?.ipcRenderer?.invoke('get-primary-display')
  }

  function scaleCalculator(val, real = false) {
    let value = 0

    if (real) {
      value = val / zoomScale.value
    }
    else {
      value = val * zoomScale.value
    }

    return value
  }

  function scaleConverter(val, real) {
    let value = 0

    if (['number', 'string'].includes(typeof val)) {
      value = scaleCalculator(val, real)
    }
    else if (Object.prototype.toString.call(val) === '[object Object]') {
      value = Object.entries(val).reduce((obj, [key, value]) => {
        obj[key] = scaleCalculator(value, real)
        return obj
      }, {})
    }

    return value
  }

  /**
   * 用于获取容器相对于屏幕比例的最大缩放矩形
   * 需要根据屏幕的宽高比，计算出容器最大缩放矩形(容器的宽度和高度)
   * @param {Object} options
   * @param {number} options.originalWidth - 容器原始宽度
   * @param {number} options.originalHeight - 容器原始高度
   * @param {string} options.dimension - 按照哪个维度计算，可选值为 'width'、'height'、'contain'
   */
  function getContainerAspectScaleRect(options = {}) {
    const { originalWidth, originalHeight, dimension = 'contain' } = options

    let width = originalWidth
    let height = originalHeight

    // 如果没有显示器信息或宽高比信息，直接使用原始尺寸
    if (!display.value || !aspectScale.value) {
      containerWidth.value = width
      containerHeight.value = height
      return
    }

    const screenAspectRatio = aspectScale.value // screenWidth / screenHeight

    switch (dimension) {
      case 'width':
        // 保持宽度不变，根据屏幕宽高比调整高度
        height = width / screenAspectRatio
        break
      case 'height':
        // 保持高度不变，根据屏幕宽高比调整宽度
        width = height * screenAspectRatio
        break
      case 'contain': {
        // 包含模式：确保容器完全适应屏幕比例，保持原始比例
        const containerAspectRatio = originalWidth / originalHeight
        if (containerAspectRatio > screenAspectRatio) {
          // 容器比屏幕更宽，以宽度为准调整高度
          height = width / screenAspectRatio
        }
        else {
          // 容器比屏幕更高，以高度为准调整宽度
          width = height * screenAspectRatio
        }
        break
      }
    }

    containerWidth.value = width
    containerHeight.value = height
  }

  // 清理 ResizeObserver
  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }
  })

  return {
    display,
    zoomScale,
    aspectScale,
    getPrimaryDisplay,
    scaleConverter,
    screenWidth,
    screenHeight,
    containerWidth,
    containerHeight,
  }
}

export default useScaleScreen
