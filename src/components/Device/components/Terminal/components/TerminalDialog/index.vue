<template>
  <el-dialog
    v-model="visible"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="overflow-hidden rounded-xl el-dialog-headless"
    @open="onOpen"
  >
    <el-icon
      class="cursor-pointer absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-200 hover:bg-gray-700 !active:bg-red-600 rounded"
      @click="hide"
    >
      <CloseBold />
    </el-icon>

    <VueCommand
      v-if="visible"
      :ref="(value) => (vShell = value)"
      v-model:history="history"
      :commands="commands"
      hide-bar
      show-help
      help-text="Type in help"
      :help-timeout="3500"
      class=""
      :dispatched-queries="dispatchedQueries"
    >
      <template #prompt>
        <div class="flex items-center pr-2">
          <span class="">escrcpy~$</span>
        </div>
      </template>
    </VueCommand>
  </el-dialog>
</template>

<script>
import { ref } from 'vue'
import VueCommand, {
  createQuery,
  createStdout,
  listFormatter,
} from 'vue-command'
import 'vue-command/dist/vue-command.css'
import { useAdb } from './composables/adb.js'
import { useScrcpy } from './composables/scrcpy.js'
import { useGnirehtet } from './composables/gnirehtet.js'

export default {
  components: {
    VueCommand,
  },
  setup() {
    const vShell = ref(null)
    const history = ref([createQuery()])
    const loading = ref(false)
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

    dispatchedQueries.value = new Set(Object.keys(commands.value))

    return {
      vShell,
      loading,
      history,
      commands,
      dispatchedQueries,
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    async onOpen() {
      console.log('vShell', this.vShell)

      this.vShell.signals.off('SIGINT')

      this.vShell.signals.on('SIGINT', () => {
        console.log('vShell.signals.on.SIGINT')
        this.$gnirehtet.shell('stop')
      })
    },
  },
}
</script>
