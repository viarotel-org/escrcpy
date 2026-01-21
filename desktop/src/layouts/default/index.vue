<template>
  <div
    class="absolute inset-0 h-full flex flex-col px-2 space-y-2 overflow-hidden"
  >
    <div
      class="app-region-drag flex items-center flex-none pt-2"
      :class="[
        {
          'pl-20': isPlatform('macos'),
          'pr-[calc(100px+3.6vw)]': isPlatform('windows') || isPlatform('linux'),
        },
      ]"
    >
      <div class="flex-none">
        <el-segmented
          v-slot="{ item }"
          v-model="activeTab"
          :options="tabsModel"
          class="el-segmented--parent *:app-region-no-drag"
        >
          <div class="text-sm lg:text-base">
            {{ $t(item.label) }}
          </div>
        </el-segmented>
      </div>

      <div class="flex-1 min-w-0 flex items-center justify-end">
        <QuickBar class="" />
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
import QuickBar from '$/components/quick-bar/index.vue'
import { isPlatform } from '$/utils/index.js'

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
    label: 'subscribe.subscription',
    value: '/subscribe',
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
</style>
