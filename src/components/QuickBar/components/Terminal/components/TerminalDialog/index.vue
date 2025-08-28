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
    <el-icon
      class="cursor-pointer absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[var(--el-bg-color)] hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 !active:bg-red-600 !active:text-gray-200 rounded-md"
      @click="close"
    >
      <CloseBold />
    </el-icon>
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

function onCtrlC() {
  window.gnirehtet.shell('stop')
}

function onClosed() {
  vShell.value.dispatch('clear')
  history.value = [createQuery()]
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
