<template>
  <div class="flex flex-col absolute inset-0 h-full overflow-hidden">
    <div class="py-4 px-4 flex items-center flex-none">
      <a class="block" :href="escrcpyURL" target="_blank">
        <img src="$electron/resources/build/logo.png" class="h-9" alt="" />
      </a>
      <div class="pl-2 text-sm">
        Escrcpy Copilot
      </div>
    </div>

    <div class="flex-1 h-0 overflow-hidden bg-gray-100">
      <el-tabs v-model="tabValue" class="el-tabs-flex" @tab-click="onTabClick">
        <el-tab-pane
          v-for="(item, index) of tabModel"
          :key="index"
          :label="item.label"
          :name="item.value"
          lazy
          class=""
        >
          <component :is="item.value" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Transmission from './components/Transmission/index.vue'

export default {
  components: {
    Transmission,
  },
  data() {
    return {
      escrcpyURL: 'https://github.com/viarotel-org/escrcpy',
      tabValue: 'Transmission',
      tabModel: [
        {
          label: '传输助手',
          value: 'Transmission',
        },
      ],
    }
  },
  methods: {
    onTabClick() {},
  },
}
</script>

<style lang="postcss" scoped>
:deep() {
  .el-tabs__header {
    @apply bg-white px-4;
  }
  .el-tabs__nav-wrap::after {
    @apply bg-transparent;
  }
}
</style>
