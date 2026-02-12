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
import { sleep } from '$/utils'
import { openFloatControl } from '$/utils/device/index.js'
import DeployDialog from './components/deploy-dialog/index.vue'

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

const deviceStore = useDeviceStore()

const loading = ref(false)
const deployDialogRef = ref()
const deployLazy = useLazy()

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

  loading.value = true

  const isCamera = ['--camera-facing'].some(key => args.includes(key))
  if (isCamera)
    args += ' --video-source=camera'

  toggleRowExpansion(row, true)

  try {
    const mirroring = window.$preload.scrcpy.mirror(row.id, {
      title: deviceStore.getLabel(row, 'custom'),
      args,
      stdout: onStdout,
      stderr: onStderr,
    })

    await sleep(1000)

    loading.value = false

    openFloatControl(toRaw(row))

    await mirroring
  }
  catch (error) {
    console.error('mirror.args', args)
    console.error('mirror.error', error)

    if (error?.message) {
      ElMessage.warning(error.message)
    }

    loading.value = false
  }
}

function onStdout() {}
function onStderr() {}
</script>

<style scoped>
</style>
