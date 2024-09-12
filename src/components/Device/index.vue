<template>
  <div class="h-full flex flex-col">
    <div class="flex-none flex items-center py-1 overflow-x-auto">
      <div class="flex-none">
        <WirelessGroup ref="wirelessGroupRef" :reload="getDeviceData" />
      </div>

      <div class="w-px h-7 !mx-4 bg-gray-200 dark:bg-gray-600 flex-none"></div>

      <div class="flex-1 w-0 space-x-2">
        <el-button
          type="primary"
          plain
          :icon="loading ? '' : 'Refresh'"
          :loading="loading"
          @click="handleRefresh"
        >
          {{ $t('device.refresh.name') }}
        </el-button>
      </div>
    </div>

    <BatchActions
      class="overflow-hidden transition-all"
      :class="isMultipleRow ? 'h-12 opacity-100 mt-3' : 'h-0 opacity-0 mt-0'"
      :devices="selectionRows"
    />

    <div class="pt-4 flex-1 h-0 overflow-hidden">
      <el-table
        ref="elTable"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
        :data="deviceList"
        style="width: 100%"
        border
        height="100%"
        row-key="id"
        @selection-change="onSelectionChange"
      >
        <template #empty>
          <el-empty :description="$t('device.list.empty')" />
        </template>

        <el-table-column type="selection"></el-table-column>

        <el-table-column
          prop="id"
          :label="$t('device.id')"
          sortable
          show-overflow-tooltip
          align="left"
          min-width="100"
        />
        <el-table-column
          :label="$t('device.name')"
          sortable
          show-overflow-tooltip
          align="left"
          min-width="150"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-tooltip
                v-if="row.$unauthorized"
                :content="$t('device.permission.error')"
                placement="top-start"
              >
                <el-icon class="mr-1 text-red-600 text-lg">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>

              {{ row.$name }}

              <div class="ml-2">
                <Remark :device="row" class="" />
              </div>

              <el-tag v-if="row.$wifi" effect="light" class="ml-2">
                WIFI
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-slot="{ row, $index }"
          :label="$t('device.control.name')"
          min-width="200"
          align="left"
        >
          <MirrorAction
            :ref="(value) => getMirrorActionRefs(value, $index)"
            v-bind="{ row, toggleRowExpansion, handleReset }"
          />

          <MoreDropdown v-bind="{ row, toggleRowExpansion, handleReset }" />

          <WirelessAction v-bind="{ row, handleConnect }" />
        </el-table-column>
        <el-table-column type="expand">
          <template #header>
            <el-icon class="" :title="$t('device.control.more')">
              <Operation class="" />
            </el-icon>
          </template>

          <template #default="{ row }">
            <ControlBar :device="row" class="-my-[8px]" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { isIPWithPort, sleep } from '$/utils/index.js'
import BatchActions from './components/BatchActions/index.vue'
import ControlBar from './components/ControlBar/index.vue'
import MirrorAction from './components/MirrorAction/index.vue'
import MoreDropdown from './components/MoreDropdown/index.vue'
import Remark from './components/Remark/index.vue'
import WirelessAction from './components/WirelessAction/index.vue'

import WirelessGroup from './components/WirelessGroup/index.vue'

export default {
  components: {
    WirelessGroup,
    ControlBar,
    Remark,
    MirrorAction,
    MoreDropdown,
    WirelessAction,
    BatchActions,
  },
  data() {
    return {
      loading: false,
      deviceList: [],
      mirrorActionRefs: [],
      selectionRows: [],
    }
  },
  computed: {
    isMultipleRow() {
      return this.selectionRows.length > 0
    },
  },
  async created() {
    this.getDeviceData()
    this.unAdbWatch = await this.$adb.watch(this.onAdbWatch)
  },
  beforeUnmount() {
    this?.unAdbWatch?.()
  },
  methods: {
    onSelectionChange(rows) {
      this.selectionRows = rows
    },
    async onAdbWatch(type, ret) {
      if (ret && ret.id) {
        this.getDeviceData()
      }

      if (type === 'add' && !isIPWithPort(ret.id) && ret.$host) {
        this.formData = {
          ...this.formData,
          host: ret.$host,
        }
      }

      if (type === 'remove') {
        this.mirrorActionRefs = this.mirrorActionRefs.filter(
          item => item.row.id !== ret.id,
        )
      }
    },
    async getMirrorActionRefs(ref, index) {
      await this.$nextTick()

      if (!ref?.row?.id) {
        return false
      }

      const someFlag = this.mirrorActionRefs.some(
        item => item.row.id === ref.row.id,
      )

      if (someFlag) {
        return false
      }

      this.mirrorActionRefs.push(ref)

      const secondNum = index

      await sleep(secondNum * 2000)

      const autoMirror = this.$store.preference.data.autoMirror

      if (autoMirror) {
        ref.handleClick(ref.row)
      }
    },

    toggleRowExpansion(...args) {
      this.$refs.elTable.toggleRowExpansion(...args)
    },

    handleConnect(...args) {
      this.$refs.wirelessGroupRef.connect(...args)
    },

    handleRefresh() {
      this.getDeviceData({ resetResolve: true })
    },

    async handleReset() {
      try {
        await this.$confirm(
          `
          <div>${this.$t('device.reset.reasons[0]')}</div>
          <div class="text-red-500">${this.$t('device.reset.reasons[1]')}</div>
          `,
          this.$t('device.reset.title'),
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('device.reset.confirm'),
            cancelButtonText: this.$t('device.reset.cancel'),
            closeOnClickModal: false,
            type: 'warning',
          },
        )

        this.$store.preference.reset()

        this.$root.reRender('Preference')

        this.$message.success(this.$t('device.reset.success'))
      }
      catch (error) {
        if (error.message) {
          console.warn(error.message)
        }
      }
    },

    async getDeviceData({ resetResolve = false } = {}) {
      this.loading = true

      await sleep(500)

      try {
        const data = await this.$store.device.getList()

        this.deviceList = data
      }
      catch (error) {
        const message = error?.message || error?.cause?.message

        console.warn(message)

        if (message && !message.includes('daemon not running')) {
          this.$message.warning(message)
        }

        this.deviceList = []

        if (resetResolve) {
          this.handleReset()
        }
      }

      this.loading = false
    },
  },
}
</script>

<style lang="postcss" scoped>
:deep() {
  .el-table .el-table__row .cell {
    @apply py-1;
  }
}
</style>
