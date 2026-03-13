<template>
  <el-dialog
    v-model="dialog.visible"
    :title="dialogTitle || $t('device.actions.more.custom.name')"
    class="el-dialog--flex el-dialog--beautify el-dialog--fullscreen"
    center
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
  >
    <div class="h-full overflow-auto">
      <PreferenceForm
        ref="preferenceFormRef"
        v-model="preferenceData"
        v-bind="{
          excludes: ['common'],
          deviceScope: device?.id,
          reverse: true,
        }"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-center">
        <el-button @click="close()">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" :loading="dialog.loading" @click="submit">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import PreferenceForm from '$/components/preference-form/index.vue'
import { sleep } from '$/utils'

const emit = defineEmits(['success'])

const preferenceStore = usePreferenceStore()
const dialog = useDialog()

const preferenceFormRef = ref(null)
const preferenceData = ref({ ...getDefaultData() })
const device = ref(null)
const dialogTitle = ref('')

/**
 * Open the dialog.
 *
 * @param {{ row?: object, title?: string, initialData?: object, onSuccess?: (args: string, data: object) => void, onClosed?: () => void }} args
 */
async function open(args = {}) {
  device.value = args.row || null
  dialogTitle.value = args.title || ''
  preferenceData.value = {
    ...getDefaultData(),
    ...(args.initialData || {}),
  }
  dialog.open(args)
}

async function close() {
  dialog.close()
}

async function submit() {
  dialog.loading = true
  const command = await preferenceFormRef.value.generateCommand()
  const data = toRaw(preferenceData.value)
  emit('success', command, data)
  dialog.options?.onSuccess?.(command, data)
  await sleep()
  dialog.loading = false
  dialog.close()
}

function onClosed() {
  preferenceData.value = { ...getDefaultData() }
  dialog.options?.onClosed?.()
}

function getDefaultData() {
  return preferenceStore.getDefaultData('global', () => void 0)
}

defineExpose({ open, close })
</script>
