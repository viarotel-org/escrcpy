<template>
  <el-dropdown :hide-on-click="false">
    <el-button
      type="primary"
      text
      :disabled="row.$unauthorized"
      icon="CirclePlus"
    >
      {{ $t('device.actions.more.name') }}
    </el-button>

    <template #dropdown>
      <el-dropdown-menu>
        <component
          :is="item.component"
          v-for="(item, index) of options"
          :key="index"
          v-bind="{
            ...$props,
            ...(item.props || {}),
          }"
          v-slot="{ loading, trigger }"
        >
          <el-dropdown-item :disabled="loading" @click="trigger">
            <template v-if="loading">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              {{ $t('common.starting') }}
            </template>
            <template v-else>
              {{ $t(item.label) }}
            </template>
          </el-dropdown-item>
        </component>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Record from './components/Record/index.vue'
import Camera from './components/Camera/index.vue'
import Otg from './components/Otg/index.vue'
import Custom from './components/Custom/index.vue'

export default {
  components: {
    Record,
    Camera,
    Otg,
    Custom,
  },
  props: {
    ...Record.props,
    ...Otg.props,
    ...Camera.props,
    ...Custom.props,
  },
  data() {
    return {
      options: [
        {
          label: 'device.actions.more.record.name',
          component: 'Record',
        },
        {
          label: 'device.actions.more.recordCamera.name',
          component: 'Record',
          props: {
            recordType: 'camera',
          },
        },
        {
          label: 'device.actions.more.recordAudio.name',
          component: 'Record',
          props: {
            recordType: 'audio',
          },
        },
        {
          label: 'device.actions.more.camera.name',
          component: 'Camera',
        },
        {
          label: 'device.actions.more.otg.name',
          component: 'Otg',
        },
        {
          label: 'device.actions.more.custom.name',
          component: 'Custom',
        },
      ],
    }
  },
}
</script>

<style></style>
