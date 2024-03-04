<template>
  <el-dropdown :hide-on-click="false">
    <el-button
      type="primary"
      text
      :disabled="deviceInfo.$unauthorized"
      icon="Monitor"
    >
      {{ $t('device.mirror.start') }}
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <component
          :is="item.component"
          v-for="(item, index) of options"
          :key="index"
          v-bind="{
            ...$props,
          }"
        >
          <el-dropdown-item>
            {{ item.label }}
          </el-dropdown-item>
        </component>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Default from './components/Default/index.vue'
import Record from './components/Record/index.vue'
import Otg from './components/Otg/index.vue'
import Camera from './components/Camera/index.vue'

export default {
  components: {
    Default,
    Record,
    Otg,
    Camera,
  },
  props: {
    ...Default.props,
    ...Record.props,
    ...Otg.props,
    ...Camera.props,
  },
  data() {
    return {
      options: [
        {
          label: '默认模式',
          component: 'Default',
        },
        {
          label: '录制模式',
          component: 'Record',
        },
        {
          label: 'OTG模式',
          component: 'Otg',
        },
        {
          label: '摄像模式',
          component: 'Camera',
        },
      ],
    }
  },
}
</script>

<style></style>
