<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.actions.more.custom.name')"
    class="!w-[98%] el-dialog--flex el-dialog--beautify"
    append-to-body
    destroy-on-close
    @closed="onClosed"
  >
    <div class="h-full overflow-auto -mx-2 pr-2">
      <PreferenceForm
        ref="preferenceFormRef"
        v-model="preferenceData"
        tag="el-collapse-item"
        v-bind="{
          collapseProps: { accordion: true },
          excludes: ['common'],
          deviceScope: device.id,
        }"
      />
    </div>

    <template #footer>
      <el-button @click="close">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" :loading @click="submit">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import PreferenceForm from '$/components/PreferenceForm/index.vue'

import { sleep } from '$/utils'

const emit = defineEmits(['success'])

const preferenceStore = usePreferenceStore()

const visible = ref(false)

const loading = ref(false)

const preferenceFormRef = ref(null)

const preferenceData = ref({
  ...getDefaultData(),
})

const device = ref(null)

async function open(args = {}) {
  device.value = args.row

  visible.value = true
}

async function close() {
  visible.value = false
}

async function submit() {
  loading.value = true

  const command = await preferenceFormRef.value.generateCommand()

  emit('success', command)

  await sleep()

  loading.value = false

  visible.value = false
}

function onClosed() {
  preferenceData.value = { ...getDefaultData() }
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
