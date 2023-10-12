<template>
  <div class="absolute inset-0 px-4 pb-4 h-full overflow-hidden">
    <el-tabs v-model="activeTab" class="el-tabs-flex" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) of tabsModel"
        :key="index"
        :label="item.label"
        :name="item.prop"
        lazy
      >
        <component :is="item.prop" ref="component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Devices from './components/Devices/index.vue'
import Advanced from './components/Advanced/index.vue'
import AboutUs from './components/AboutUs/index.vue'

export default {
  components: {
    Devices,
    Advanced,
    AboutUs,
  },
  data() {
    return {
      tabsModel: [
        {
          label: '设备列表',
          prop: 'Devices',
        },
        {
          label: '高级配置',
          prop: 'Advanced',
        },
        {
          label: '关于',
          prop: 'AboutUs',
        },
      ],
      activeTab: 'Devices',
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style></style>
