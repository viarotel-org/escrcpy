<template>
  <div class="absolute inset-0 px-4 pb-4 h-full overflow-hidden">
    <el-tabs v-model="activeTab" class="el-tabs-flex" @tab-change="onTabChange">
      <el-tab-pane
        v-for="(item, index) of tabsModel"
        :key="index"
        :label="$t(item.label)"
        :name="item.prop"
        lazy
      >
        <component
          :is="item.prop"
          v-if="isRender(item)"
          :ref="item.prop"
          :re-render="reRender"
        />
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
          label: 'device.list',
          prop: 'Device',
        },
        {
          label: 'preferences.name',
          prop: 'Preference',
        },
        {
          label: 'about.name',
          prop: 'About',
        },
      ],
      activeTab: 'Device',
      renderTab: '',
      rendered: true,
      renderSign: false,
    }
  },
  created() {
    this.$store.theme.init()
    this.$store.preference.init()
    this.showTips()
  },
  methods: {
    async showTips() {
      const { scrcpyPath } = this.$electron?.configs || {}

      if (scrcpyPath) {
        return false
      }

      this.$alert(
        `<div>
          ${this.$t('dependencies.lack.content', {
            name: '<a class="hover:underline text-primary-500" href="https://github.com/Genymobile/scrcpy" target="_blank">scrcpy</a>',
          })}
        <div>`,
        this.$t('dependencies.lack.title'),
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$t('common.confirm'),
        },
      )
    },

    isRender(item) {
      if (this.renderTab === item.prop) {
        return this.rendered
      }

      return true
    },

    async reRender(other) {
      this.renderTab = other || this.activeTab

      this.rendered = false
      await this.$nextTick()
      this.rendered = true

      this.renderTab = ''
    },

    reRenderPost() {
      this.renderSign = true
    },

    async onTabChange(prop) {
      if (!this.renderSign) {
        return false
      }

      switch (prop) {
        case 'Device':
          this.reRender()
          break
        case 'Preference':
          this.reRender()
          break
      }

      this.renderSign = false
    },
  },
}
</script>

<style lang="postcss" scoped>
:deep() {
  .el-tabs__header {
    @apply !mb-3;
  }
}
</style>
