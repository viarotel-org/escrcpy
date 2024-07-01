<template>
  <el-dialog
    v-model="visible"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    class="overflow-hidden !rounded-md el-dialog-headless dark:border dark:border-gray-700"
    @open="onOpen"
  >
    <el-icon
      class="cursor-pointer absolute top-3 right-3 w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 !active:bg-red-600 !active:text-gray-200 rounded-md"
      @click="hide"
    >
      <CloseBold />
    </el-icon>

    <VueCommand
      v-if="renderShell"
      :ref="(value) => (vShell = value)"
      v-model:history="history"
      :dispatched-queries="dispatchedQueries"
      :commands="commands"
      hide-bar
      show-help
      help-text="Type in help"
      :help-timeout="3000"
      :invert="invert"
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

<script>
import { ref, shallowRef } from 'vue'
import VueCommand, {
  createQuery,
  createStdout,
  listFormatter,
} from 'vue-command'
import 'vue-command/dist/vue-command.css'
import { useAdb } from './composables/adb-async.js'
import { useScrcpy } from './composables/scrcpy.js'
import { useGnirehtet } from './composables/gnirehtet.js'

export default {
  components: {
    VueCommand,
  },
  setup() {
    const vShell = ref(null)
    const history = shallowRef([createQuery()])
    const loading = ref(false)
    const renderShell = ref(false)
    const dispatchedQueries = ref(new Set([]))

    const { adb } = useAdb({ vShell, history, loading })
    const { scrcpy } = useScrcpy({ vShell, history, loading })
    const { gnirehtet } = useGnirehtet({ vShell, history, loading })

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

    const onOpen = () => {
      renderShell.value = true
    }

    return {
      vShell,
      loading,
      history,
      commands,
      dispatchedQueries,
      onOpen,
      renderShell,
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    invert() {
      return !this.$store.theme.isDark
    },
  },
  watch: {
    'vShell.signals': {
      handler(value) {
        value.off('SIGINT')

        value.on('SIGINT', () => {
          this.onCtrlC()
        })
      },
    },
  },
  methods: {
    show() {
      this.visible = true
    },

    hide() {
      this.visible = false
    },

    onDispatchedQueriesUpdate(value) {
      this.$appStore.set('terminal.dispatchedQueries', Array.from(value))

      this.dispatchedQueries = value
    },

    onCtrlC() {
      window.gnirehtet.shell('stop')
    },
  },
}
</script>

<style lang="postcss" scoped>
:deep() {
  .vue-command__history,
  .vue-command__history--invert {
    @apply !bg-transparent !p-0;
  }
}
</style>
