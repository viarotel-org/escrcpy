<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('about.update-available.title')"
    fullscreen
    center
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
  >
    <div v-if="dialog.lazyVisible" class="h-full overflow-auto">
      <div class="prose mx-auto" v-html="dialog.options.releaseNotes"></div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center">
        <el-button @click="dialog.close()">
          {{ $t('common.cancel') }}
        </el-button>

        <el-button type="primary" @click="onConfirm">
          {{ $t('about.update-available.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const dialog = useDialog()

function open(...args) {
  dialog.open(...args)
}

function onConfirm() {
  dialog.options?.onConfirm?.()
  dialog.close()
}

defineExpose({
  open,
})
</script>

<style></style>
