<template>
  <div class="absolute inset-0 px-4 pb-4 h-full overflow-hidden">
    <el-tabs v-model="activeTab" class="el-tabs-flex" @tab-change="onTabChange">
      <el-tab-pane
        v-for="(item, index) of tabsModel"
        :key="index"
        :label="item.label"
        :name="item.prop"
        lazy
      >
        <component :is="item.prop" :ref="item.prop" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Device from './components/Device/index.vue'
import Preference from './components/Preference/index.vue'
import About from './components/About/index.vue'

export default {
  components: {
    Device,
    Preference,
    About,
  },
  data() {
    return {
      tabsModel: [
        {
          label: '设备列表',
          prop: 'Device',
        },
        {
          label: '偏好设置',
          prop: 'Preference',
        },
        {
          label: '关于',
          prop: 'About',
        },
      ],
      activeTab: 'Device',
    }
  },
  created() {
    this.$store.scrcpy.init()
  },
  methods: {
    onTabChange(prop) {},
  },
}
</script>

<style></style>
