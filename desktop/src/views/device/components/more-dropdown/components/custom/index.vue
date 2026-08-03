<template>
  <slot
    :loading="loading"
    :trigger="handleClick"
  />

  <DeployDialog
    v-if="deployLazy.visible"
    ref="deployDialogRef"
    @success="handleScrcpy"
  />
</template>

<script setup>
import { openFloatControl } from '$/utils/device/index.js'
import DeployDialog from '$/components/preference-form/dialog.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
  toggleRowExpansion: {
    type: Function,
    default: () => () => false,
  },
})

const loading = ref(false)
const deployDialogRef = ref()
const deployLazy = useLazy()

const deviceStore = useDeviceStore()

async function handleClick() {
  await deployLazy.mount()

  deployDialogRef.value?.open({
    row: props.row,
    onClosed() {
      deployLazy.unmount()
    },
  })
}

async function handleScrcpy(args) {
  const { row, toggleRowExpansion } = props

  const isCamera = ['--camera-facing'].some(key => args.includes(key))

  if (isCamera) {
    args += ' --video-source=camera'
  }

  toggleRowExpansion(row, true)

  const mirroring = window.$preload.scrcpy.mirror(row.id, {
    title: deviceStore.getLabel(row, 'custom'),
    args,
    resolveOnReady: true,
    stdout: onStdout,
    stderr: onStderr,
  })

  loading.value = true

  try {
    await mirroring
    openFloatControl(toRaw(row))
  }
  catch (error) {
    console.error('mirror.args', args)
    console.error('mirror.error', error)

    if (error?.message) {
      ElMessage.warning(error.message)
    }
  }

  loading.value = false
}

function onStdout() {}
function onStderr() {}
</script>

<style scoped>
</style>
