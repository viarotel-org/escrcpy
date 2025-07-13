<template>
  <div
    ref="container"
    class="overflow-auto scrollable"
    :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @wheel="onWheel"
  >
    <div
      ref="content"
      class="inline-flex"
      :class="{ 'flex-col': direction === 'vertical' }"
      :style="contentStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'Scrollable',
})

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
    validator: value => ['horizontal', 'vertical'].includes(value),
  },
  speed: {
    type: Number,
    default: 1,
  },
  disabledDrag: {
    type: Boolean,
    default: false,
  },
})

const container = ref(null)
const content = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const scrollLeft = ref(0)
const scrollTop = ref(0)

const contentStyle = computed(() => ({
  transform:
    props.direction === 'horizontal'
      ? `translateX(${-scrollLeft.value}px)`
      : `translateY(${-scrollTop.value}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s ease-out',
}))

const startDrag = (e) => {
  if (props.disabledDrag) {
    return false
  }

  isDragging.value = true
  startX.value = e.pageX - container.value.offsetLeft
  startY.value = e.pageY - container.value.offsetTop
  container.value.style.cursor = 'grabbing'
}

const onDrag = (e) => {
  if (props.disabledDrag) {
    return false
  }

  if (!isDragging.value)
    return
  e.preventDefault()
  const x = e.pageX - container.value.offsetLeft
  const y = e.pageY - container.value.offsetTop
  const walkX = (x - startX.value) * props.speed
  const walkY = (y - startY.value) * props.speed

  if (props.direction === 'horizontal') {
    scrollLeft.value = Math.max(
      0,
      Math.min(
        scrollLeft.value - walkX,
        content.value.offsetWidth - container.value.offsetWidth,
      ),
    )
  }
  else {
    scrollTop.value = Math.max(
      0,
      Math.min(
        scrollTop.value - walkY,
        content.value.offsetHeight - container.value.offsetHeight,
      ),
    )
  }

  startX.value = x
  startY.value = y
}

const endDrag = () => {
  if (props.disabledDrag) {
    return false
  }

  isDragging.value = false
  container.value.style.cursor = 'grab'
}

const onWheel = (e) => {
  e.preventDefault()
  const delta
    = props.direction === 'horizontal' ? e.deltaX || e.deltaY : e.deltaY
  const newScroll
    = (props.direction === 'horizontal' ? scrollLeft.value : scrollTop.value)
      + delta * props.speed

  if (props.direction === 'horizontal') {
    scrollLeft.value = Math.max(
      0,
      Math.min(
        newScroll,
        content.value.offsetWidth - container.value.offsetWidth,
      ),
    )
  }
  else {
    scrollTop.value = Math.max(
      0,
      Math.min(
        newScroll,
        content.value.offsetHeight - container.value.offsetHeight,
      ),
    )
  }
}

const getIncrement = () => {
  return 100 * props.speed
}

const scrollToEnd = () => {
  if (props.direction === 'horizontal') {
    const maxScroll = Math.max(
      0,
      content.value.offsetWidth - container.value.offsetWidth,
    )
    scrollLeft.value = maxScroll
  }
  else {
    const maxScroll = Math.max(
      0,
      content.value.offsetHeight - container.value.offsetHeight,
    )
    scrollTop.value = maxScroll
  }
}

const scrollForward = () => {
  const increment = getIncrement()
  if (props.direction === 'horizontal') {
    scrollLeft.value = Math.min(
      scrollLeft.value + increment,
      content.value.offsetWidth - container.value.offsetWidth,
    )
  }
  else {
    scrollTop.value = Math.min(
      scrollTop.value + increment,
      content.value.offsetHeight - container.value.offsetHeight,
    )
  }
}

const scrollBackward = () => {
  const increment = getIncrement()
  if (props.direction === 'horizontal') {
    scrollLeft.value = Math.max(scrollLeft.value - increment, 0)
  }
  else {
    scrollTop.value = Math.max(scrollTop.value - increment, 0)
  }
}

onMounted(() => {
  window.addEventListener('mouseup', endDrag)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', endDrag)
})

defineExpose({
  scrollToEnd,
  scrollForward,
  scrollBackward,
})
</script>

<style>
.scrollable::-webkit-scrollbar {
 display: none;
}
</style>
