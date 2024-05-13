<template>
  <div class="absolute -bottom-[5px] right-0 z-10">
    <el-input
      ref="elInputRef"
      v-model="keyword"
      prefix-icon="Search"
      :placeholder="$t('common.search')"
      clearable
      class="transition-all overflow-hidden"
      :class="activated || keyword ? '!w-96' : '!w-26'"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @clear="onClear"
    >
      <template v-if="keyword" #append>
        <div class="flex flex-col size-full absolute inset-0 justify-center">
          <div
            class="flex-1 h-0 flex items-end justify-center apply-search-button"
            @click="handlePrev"
          >
            <el-icon size="12">
              <ElIconArrowUpBold />
            </el-icon>
          </div>

          <div class="h-px w-full bg-gray-200 dark:bg-gray-600"></div>

          <div
            class="flex-1 h-0 flex items-start justify-center apply-search-button"
            @click="handleNext"
          >
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
  window.electron.ipcRenderer.invoke('findInPageStop')
}

async function onChange(value) {
  if (!value) {
    onClear()
    return false
  }

  window.electron.ipcRenderer.invoke('findInPageStart', {
    text: value,
  })
}

function handlePrev() {
  window.electron.ipcRenderer.invoke('findInPagePrev')
}

function handleNext() {
  window.electron.ipcRenderer.invoke('findInPageNext')
}

window.electron.ipcRenderer.on('focus-on-search', (event, ret) => {
  handleFocus()
})
</script>

<style lang="postcss">
.apply-search-button {
  @apply hover:bg-gray-200 dark:hover:bg-gray-700 !active:bg-gray-300 !dark:active:bg-gray-600 !active:text-primary-500;
}
</style>
