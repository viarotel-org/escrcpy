<template>
  <ElDialog v-model="visible" v-bind="{ modal: false, closeOnClickModal: false, showClose: false, top: '3vh' }" class="ele-message-loading">
    <template #header>
      <div class="flex items-center space-x-2 opacity-70">
        <ElIcon class="is-loading flex-none">
          <ElIconLoading />
        </ElIcon>

        <div class="flex-1">
          {{ message }}
        </div>

        <ElLink v-if="showClose" :underline="false" class="flex-none" @click="cancel">
          <ElIcon class="">
            <ElIconClose />
          </ElIcon>
        </ElLink>
      </div>
    </template>
  </ElDialog>
</template>

<script setup>
const props = defineProps({
  showClose: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel'])

const message = ref('')

const visible = ref(false)

function open(message) {
  update(message)
  visible.value = true
}

function update(value) {
  message.value = value
}

function close() {
  visible.value = false
}

function cancel() {
  emit('cancel')
  visible.value = false
}

defineExpose({
  open,
  update,
  close,
  cancel,
})
</script>

<style lang="postcss">
.ele-message-loading {
  @apply !py-2 !px-4 !border !border-gray-200 !dark:border-gray-700 !w-[max-content] !max-w-[80vw];

  .el-dialog__header {
    @apply !pb-0 !pr-0;
  }

  .el-dialog__body {
    @apply !hidden;
  }
}
</style>
