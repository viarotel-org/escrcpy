<template>
  <el-popover
    ref="popoverRef"
    placement="bottom-start"
    :width="300"
    trigger="click"
    @hide="onHide"
  >
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <div class="flex items-center space-x-2">
      <el-input
        v-model="dirname"
        :placeholder="$t('common.input.placeholder')"
        clearable
        class="flex-1 w-0"
      ></el-input>

      <el-button type="primary" class="flex-none" @click="handleConfirm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-popover>
</template>

<script setup>
const emit = defineEmits(['success'])

const defaultText = 'NewFolder'

const dirname = ref(defaultText)

const popoverRef = ref()

function onHide() {
  dirname.value = defaultText
}

function handleConfirm() {
  emit('success', dirname.value)
  popoverRef.value.hide()
}
</script>

<style></style>
