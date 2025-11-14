<template>
  <el-dialog
    v-model="visible"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
    append-to-body
    class="overflow-hidden !rounded-md el-dialog--headless dark:border dark:border-gray-700"
    @closed="onClosed"
  >
    <div class="absolute top-3 right-3 flex items-center gap-2 z-10 z-50">
      <el-icon
        class="cursor-pointer w-8 h-8 flex items-center justify-center bg-[var(--el-bg-color)] hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 !active:bg-red-600 !active:text-gray-200 rounded-md transition-colors"
        @click="close"
      >
        <CloseBold />
      </el-icon>
    </div>

    <div class="absolute bottom-3 right-3 flex items-center gap-2 z-10 z-50">
      <div
        v-if="delayLoading"
        class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-sm"
      >
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <span>{{ $t('terminal.executing') }}</span>
      </div>

      <el-tooltip
        v-if="history.length > 2"
        :content="$t('terminal.terminate')"
        placement="bottom"
      >
        <el-icon
          class="cursor-pointer w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-md transition-colors"
          @click="handleTerminate"
        >
          <CircleClose />
        </el-icon>
      </el-tooltip>
    </div>

    <VueCommand
      ref="vShell"
      v-model:history="history"
      :dispatched-queries="dispatchedQueries"
      :commands="commands"
      :invert="invert"
      hide-bar
      show-help
      help-text="Type in help"
      :help-timeout="3000"
      class=""
      @update:dispatched-queries="onDispatchedQueriesUpdate"
    >
      <template #prompt>
        <div class="flex items-center pr-2">
          <span class="">Escrcpy~$</span>
        </div>
      </template>
    </VueCommand>
  </el-dialog>
</template>

<script setup>
import { sleep } from '$/utils/index.js'
import VueCommand, {
  createQuery,
  createStderr,
  createStdout,
  listFormatter,
} from 'vue-command'
import { useAdb } from './hooks/adb-async.js'
import { useGnirehtet } from './hooks/gnirehtet.js'
import { useScrcpy } from './hooks/scrcpy.js'
import 'vue-command/dist/vue-command.css'

const themeStore = useThemeStore()
const taskStore = useTaskStore()

const loading = ref(false)
const visible = ref(false)

const vShell = ref(null)
const history = shallowRef([createQuery()])
const dispatchedQueries = ref(new Set([]))

const { adb } = useAdb({ vShell, history, loading })
const { scrcpy } = useScrcpy({ vShell, history, loading })
const { gnirehtet } = useGnirehtet({ vShell, history, loading })

const invert = computed(() => !themeStore.isDark)

const commands = ref({
  adb,
  scrcpy,
  gnirehtet,
  clear() {
    history.value = []
    return createQuery()
  },
})

commands.value.help = () => {
  const commandList = Object.keys(commands.value)
  return createStdout(listFormatter('Supported Commands:', ...commandList))
}

dispatchedQueries.value = new Set([
  ...(window.appStore.get('terminal.dispatchedQueries') || []),
  ...Object.keys(commands.value),
])

const delayLoading = ref(false)

watchEffect(async () => {
  if (!loading.value) {
    await sleep(500)
  }

  delayLoading.value = loading.value
})

function getShell() {
  let unwatch = null

  return new Promise((resolve) => {
    unwatch = watch(
      () => vShell.value,
      (value) => {
        if (value) {
          unwatch?.()
          resolve(value)
        }
      },
      { immediate: true },
    )
  })
}

;(async () => {
  const shell = await getShell()

  shell.signals.off('SIGINT')

  shell.signals.on('SIGINT', () => {
    onCtrlC()
  })
})()

async function open() {
  visible.value = true
  await focus()
}

function close() {
  visible.value = false
}

async function invoke(command, options = {}) {
  visible.value = true

  const shell = await getShell()

  shell.setQuery(command)

  await focus()

  if (options.message) {
    ElMessage.info(options.message)
  }
}

async function focus() {
  await nextTick()

  const shell = await getShell()

  const targetRefs = shell.$refs.vueCommandHistoryEntryComponentRefs || []

  const targetRef = targetRefs[targetRefs.length - 1]

  if (!targetRef) {
    return false
  }

  await sleep()

  targetRef.focus()
}

function onDispatchedQueriesUpdate(value) {
  window.appStore.set('terminal.dispatchedQueries', Array.from(value))

  dispatchedQueries.value = value
}

async function killAllProcesses() {
  try {
    // Kill all running processes
    const results = await Promise.allSettled([
      window.adb.killProcesses(),
      window.scrcpy.killProcesses(),
      window.gnirehtet.killProcesses(),
    ])

    // Log any errors but don't throw
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const names = ['adb', 'scrcpy', 'gnirehtet']
        console.warn(`Error killing ${names[index]} processes:`, result.reason)
      }
    })

    // Reset loading state
    loading.value = false
  }
  catch (error) {
    console.warn('Error killing processes:', error)
    loading.value = false
  }
}

async function handleTerminate() {
  try {
    await ElMessageBox.confirm(
      window.t('terminal.terminate.confirm'),
      window.t('common.tips'),
      {
        confirmButtonText: window.t('common.confirm'),
        cancelButtonText: window.t('common.cancel'),
        type: 'warning',
      },
    )

    // Kill all processes
    await killAllProcesses()

    // Add termination message to history
    const shell = await getShell()
    shell.appendToHistory(createStderr(window.t('terminal.terminated')))

    // Reset loading state
    loading.value = false

    ElMessage.success(window.t('terminal.terminate.success'))
  }
  catch (error) {
    if (error !== 'cancel') {
      console.warn('Terminate error:', error)
      ElMessage.error(window.t('terminal.terminate.error'))
    }
  }
}

async function onCtrlC() {
  // Kill all processes when Ctrl+C is pressed
  await killAllProcesses()

  // Add termination message to history
  try {
    const shell = await getShell()
    shell.appendToHistory(createStderr(window.t('terminal.terminated')))
  }
  catch (error) {
    console.warn('Error adding termination message:', error)
  }
}

async function onClosed() {
  await onCtrlC()
  vShell.value.dispatch('clear')
}

taskStore.on('terminal', (task) => {
  invoke(task.command, { message: task.message })
})

defineExpose({
  open,
  close,
  invoke,
})
</script>

<style lang="postcss" scoped>
:deep() {
  .vue-command__history,
  .vue-command__history--invert {
    @apply !bg-transparent !p-0;
  }
}
</style>
