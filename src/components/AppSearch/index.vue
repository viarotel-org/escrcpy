<template>
  <div class="absolute -bottom-1 right-0 z-10">
    <el-input
      ref="elInputRef"
      v-model="keyword"
      prefix-icon="Search"
      placeholder="搜索"
      clearable
      class="transition-all overflow-hidden"
      :class="activated || keyword ? '!w-96' : '!w-24'"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @clear="onClear"
    >
      <template v-if="keyword" #append>
        <div
          class="flex flex-col size-full absolute inset-0 justify-center items-center"
        >
          <div class="flex-1 h-0 flex items-end">
            <el-icon size="12">
              <ElIconArrowUpBold />
            </el-icon>
          </div>

          <div class="h-px w-full border-[0.5px] border-gray-200"></div>

          <div class="flex-1 h-0 flex items-start">
            <el-icon size="12">
              <ElIconArrowDownBold />
            </el-icon>
          </div>
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup>
const elInputRef = ref(null)

const keyword = ref('')
const activated = ref(false)

function handleFocus() {
  elInputRef.value.focus()
}

async function onFocus() {
  activated.value = true
}

function onBlur() {
  activated.value = false
}

function onClear() {
  window.electron.ipcRenderer.invoke('stop-find-in-page', 'clearSelection')
}

function onInput(value) {
  if (!value) {
    onClear()
    return false
  }

  window.electron.ipcRenderer.invoke('find-in-page', {
    text: value,
    findNext: true,
  })
}
</script>

<style></style>
