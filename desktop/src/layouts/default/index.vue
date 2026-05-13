<template>
  <div
    class="absolute inset-0 h-full flex flex-col px-2 space-y-2 overflow-hidden"
  >
    <AppHeader
      class="flex-none"
    >
      <template #default>
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
      </template>

      <template #right>
        <QuickBar class="" />
      </template>
    </AppHeader>

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
import AppHeader from '$/components/app-header/index.vue'
import QuickBar from '$/components/quick-bar/index.vue'

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
</style>
