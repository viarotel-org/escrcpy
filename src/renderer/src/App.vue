<template>
  <div class="absolute inset-0 px-4 pb-4 h-full overflow-hidden">
    <el-tabs v-model="activeTab" class="el-tabs-flex" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) of tabsModel"
        :key="index"
        :label="item.label"
        :name="item.prop"
      >
        <component :is="item.prop" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Wired from './components/Wired/index.vue'
import Wireless from './components/Wireless/index.vue'
import Advanced from './components/Advanced/index.vue'

export default {
  components: {
    Wired,
    Wireless,
    Advanced,
  },
  data() {
    return {
      tabsModel: [
        {
          label: '有线模式',
          prop: 'Wired',
        },
        {
          label: '无线模式',
          prop: 'Wireless',
        },
        {
          label: '高级配置',
          prop: 'Advanced',
        },
      ],
      activeTab: 'Wired',
    }
  },
  mounted() {},
  methods: {
    getDevices() {
      window.adbkit.createClient()
    },
  },
}
</script>

<style></style>
