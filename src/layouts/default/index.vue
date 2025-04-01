<template>
  <div
    class="absolute inset-0 h-full flex flex-col px-4 pt-1 space-y-2 overflow-hidden"
  >
    <div
      class="flex items-center flex-none border-b border-gray-200 dark:border-gray-700 pb-1"
    >
      <div class="flex-none">
        <el-segmented
          v-slot="{ item }"
          v-model="activeTab"
          :options="tabsModel"
        >
          <div class="text-sm lg:text-base">
            {{ $t(item.label) }}
          </div>
        </el-segmented>
      </div>
      <div class="flex-1 w-0 flex items-center justify-end">
        <QuickBar />
      </div>
    </div>

    <div class="flex-1 h-0 overflow-auto">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import QuickBar from '$/components/QuickBar/index.vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const tabsModel = [
  {
    label: 'device.list',
    value: '/device',
  },
  {
    label: 'preferences.name',
    value: '/preference',
  },
  {
    label: 'about.name',
    value: '/about',
  },
]

const activeTab = computed({
  get() {
    return route.path
  },
  set(value) {
    router.push(value)
  },
})

provide('activeTab', activeTab)
</script>

<style lang="postcss" scoped>
:deep() {
  .el-segmented {
    --el-border-radius-base: 5px;
    --el-segmented-bg-color: transparent;
    --el-segmented-item-selected-bg-color: var(--el-color-primary-light-9);
    --el-segmented-item-selected-color: rgba(var(--color-primary-500), 1);
  }
}
</style>
