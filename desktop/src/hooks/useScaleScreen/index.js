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
    // Disconnect previous observer
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }

    if (!containerRef?.value || !display.value) {
      return
    }

    // Initial calculation
    updateContainerDimensions()

    // Set up ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver.value = new ResizeObserver(() => {
        updateContainerDimensions()
      })
      resizeObserver.value.observe(containerRef.value)
    }
  })

  // Function to update container dimensions and zoom scale
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
    display.value = await window.$preload.ipcRenderer?.invoke('get-primary-display')
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
   * Get the maximum scaled rectangle for a container relative to the screen aspect ratio
   * Calculates the container's scaled width/height based on the screen's aspect ratio
   * @param {Object} options
   * @param {number} options.originalWidth - Original container width
   * @param {number} options.originalHeight - Original container height
   * @param {string} options.dimension - Which dimension to base calculation on: 'width', 'height', or 'contain'
   */
  function getContainerAspectScaleRect(options = {}) {
    const { originalWidth, originalHeight, dimension = 'contain' } = options

    let width = originalWidth
    let height = originalHeight

    // If display information or aspect ratio is missing, use original dimensions
    if (!display.value || !aspectScale.value) {
      containerWidth.value = width
      containerHeight.value = height
      return
    }

    const screenAspectRatio = aspectScale.value // screenWidth / screenHeight

    switch (dimension) {
      case 'width':
        // Keep width fixed; adjust height based on screen aspect ratio
        height = width / screenAspectRatio
        break
      case 'height':
        // Keep height fixed; adjust width based on screen aspect ratio
        width = height * screenAspectRatio
        break
      case 'contain': {
        // Contain mode: ensure the container fits the screen aspect while preserving original proportions
        const containerAspectRatio = originalWidth / originalHeight
        if (containerAspectRatio > screenAspectRatio) {
          // Container is wider than screen: adjust height based on width
          height = width / screenAspectRatio
        }
        else {
          // Container is taller than screen: adjust width based on height
          width = height * screenAspectRatio
        }
        break
      }
    }

    containerWidth.value = width
    containerHeight.value = height
  }

  // Cleanup ResizeObserver
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
