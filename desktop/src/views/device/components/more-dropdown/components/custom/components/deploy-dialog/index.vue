<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('device.actions.more.custom.name')"
    class="el-dialog--flex el-dialog--beautify el-dialog--fullscreen"
    center
    append-to-body
    fullscreen
    destroy-on-close
    @closed="onClosed"
  >
    <div class="h-full overflow-auto -mx-2 -mt-4">
      <PreferenceForm
        ref="preferenceFormRef"
        v-model="preferenceData"
        tag="el-collapse-item"
        v-bind="{
          excludes: ['common'],
          deviceScope: device.id,
          reverse: true,
        }"
      />
    </div>

    <template #footer>
      <el-button @click="close()">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading="dialog.loading" @click="submit">
        {{ $t('common.confirm') }}
      </el-button>
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

const preferenceData = ref({
  ...getDefaultData(),
})

const device = ref(null)

async function open(args = {}) {
  device.value = args.row

  dialog.open(args)
}

async function close() {
  dialog.close()
}

async function submit() {
  dialog.loading = true

  const command = await preferenceFormRef.value.generateCommand()

  emit('success', command)

  await sleep()

  dialog.loading = false

  dialog.close()
}

function onClosed() {
  preferenceData.value = { ...getDefaultData() }

  dialog.options?.onClosed()
}

function getDefaultData() {
  return preferenceStore.getDefaultData('global', () => void 0)
}

defineExpose({
  open,
  close,
})
</script>

<style></style>
