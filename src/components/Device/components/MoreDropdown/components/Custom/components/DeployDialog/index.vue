<template>
  <TemplatePromise v-slot="{ resolve, reject }">
    <el-dialog
      v-model="visible"
      :title="$t('device.actions.more.custom.name')"
      class="!w-[98%] el-dialog-flex el-dialog-beautify"
      append-to-body
      destroy-on-close
      @close="close(reject)"
    >
      <div class="h-full overflow-auto -mx-2 pr-2">
        <PreferenceForm
          ref="preferenceFormRef"
          v-model="preferenceData"
          tag="el-collapse-item"
          v-bind="{
            collapseProps: { accordion: true },
            excludes: ['common'],
          }"
        />
      </div>

      <template #footer>
        <el-button @click="close(reject)">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit(resolve)">
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </TemplatePromise>
</template>

<script setup>
import { createTemplatePromise } from '@vueuse/core'

import { nextTick } from 'vue'
import { usePreferenceStore } from '$/store/index.js'

import PreferenceForm from '$/components/Preference/components/PreferenceForm/index.vue'

const TemplatePromise = createTemplatePromise()

const preferenceStore = usePreferenceStore()

const visible = ref(false)

const preferenceFormRef = ref(null)

const preferenceData = ref({
  ...getDefaultData(),
})

const collapseValue = ref([])

const device = ref(null)

async function open(row) {
  device.value = row
  visible.value = true

  return TemplatePromise.start()
}

async function submit(resolve) {
  const data = await preferenceFormRef.value.generateCommand()

  visible.value = false

  resolve(data)
}

async function close(reject) {
  visible.value = false

  await nextTick()

  preferenceData.value = { ...getDefaultData() }

  reject(new Error('User cancel operation'))
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
