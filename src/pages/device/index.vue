<template>
  <div class="h-full flex flex-col">
    <BatchActions
      class="overflow-hidden transition-all"
      :class="isMultipleRow ? 'max-h-12 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'"
      :devices="selectionRows"
    />

    <div class="flex-1 h-0 overflow-hidden">
      <el-table
        ref="tableRef"
        v-loading="loading && !deviceList.length"
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
          :label="$t('device.name')"
          sortable
          show-overflow-tooltip
          align="left"
          min-width="150"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <DevicePopover :key="row.status" :device="row" />

              <span class="">
                {{ row.name }}
              </span>

              <el-tag v-if="row.wifi" effect="light" class="!ml-1">
                WIFI
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('device.remark')"
          prop="remark"
          sortable
          show-overflow-tooltip
          align="left"
          min-width="150"
          :filters="remarkFilters"
          :filter-method="filterMethod"
        >
          <template #default="{ row }">
            <Remark :device="row" class="" />
          </template>
        </el-table-column>

        <el-table-column
          v-slot="{ row }"
          :label="$t('device.status')"
          prop="status"
          align="left"
          sortable
          show-overflow-tooltip
          width="150"
          :filters="statusFilters"
          :filter-method="filterMethod"
        >
          <el-tag :type="getDictLabel('deviceStatus', row.status, { labelKey: 'tagType' })">
            <div class="flex items-center">
              <el-tooltip
                v-if="['unauthorized'].includes(row.status)"
                :content="$t('device.permission.error')"
                placement="top"
              >
                <el-link type="danger" :underline="false" icon="WarningFilled" class="mr-1 flex-none"></el-link>
              </el-tooltip>

              <span class="flex-none">{{ $t(getDictLabel('deviceStatus', row.status)) || '-' }}</span>
            </div>
          </el-tag>
        </el-table-column>

        <el-table-column
          v-slot="{ row, $index }"
          :label="$t('device.control.name')"
          align="left"
          width="150"
        >
          <div class="flex items-center !space-x-0">
            <MirrorAction
              v-if="['device', 'unauthorized'].includes(row.status)"
              :ref="(value) => getMirrorActionRefs(value, $index)"
              v-bind="{ row, toggleRowExpansion, handleReset }"
            />

            <MoreDropdown v-if="['device'].includes(row.status)" v-bind="{ row, toggleRowExpansion, handleReset }" />

            <WirelessAction v-if="['device', 'unauthorized'].includes(row.status)" v-bind="{ row, handleConnect, handleRefresh }" />

            <ConnectAction
              v-if="['offline'].includes(row.status) && row.wifi"
              v-bind="{
                device: row,
                handleConnect,
              }"
            />

            <RemoveAction
              v-if="['offline'].includes(row.status)"
              v-bind="{
                device: row,
                handleRefresh,
              }"
            />
          </div>
        </el-table-column>
        <el-table-column type="expand">
          <template #header>
            <el-icon class="" :title="$t('device.control.more')">
              <Operation class="" />
            </el-icon>
          </template>

          <template #default="{ row }">
            <ControlBar :device="row" class="-my-[4px] lg:-my-[8px]" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="flex-none flex items-center py-1 overflow-x-auto py-2">
      <div class="flex-none">
        <WirelessGroup ref="wirelessGroupRef" v-bind="{ handleRefresh }" />
      </div>

      <div class="flex-1 w-0 space-x-2 flex items-center justify-end">
        <EleTooltipButton
          type="default"
          :icon="loading ? '' : 'Refresh'"
          :loading="loading"
          placement="right"
          circle
          :content="$t('device.refresh.name')"
          @click="handleRefresh"
        >
        </EleTooltipButton>
      </div>
    </div>
  </div>
</template>

<script>
import { sleep } from '$/utils/index.js'
import BatchActions from './components/BatchActions/index.vue'
import ControlBar from '$/components/ControlBar/index.vue'
import MirrorAction from './components/MirrorAction/index.vue'
import MoreDropdown from './components/MoreDropdown/index.vue'
import Remark from './components/Remark/index.vue'
import WirelessAction from './components/WirelessAction/index.vue'
import ConnectAction from './components/ConnectAction/index.vue'
import RemoveAction from './components/RemoveAction/index.vue'

import WirelessGroup from './components/WirelessGroup/index.vue'

import DevicePopover from './components/DevicePopover/index.vue'

import { getDictLabel } from '$/dicts/helper'

import { deviceStatus } from '$/dicts/index.js'
import { uniqBy } from 'lodash-es'

export default {
  name: 'Device',
  components: {
    WirelessGroup,
    ControlBar,
    Remark,
    MirrorAction,
    MoreDropdown,
    WirelessAction,
    ConnectAction,
    BatchActions,
    DevicePopover,
    RemoveAction,
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
    statusFilters() {
      const value = deviceStatus.map(item => ({
        text: window.t(item.label),
        value: item.value,
      }))

      return value
    },
    remarkFilters() {
      const value = this.deviceList.filter(item => !!item.remark).map(item => ({
        text: item.remark,
        value: item.remark,
      }))

      return uniqBy(value, 'value')
    },
  },
  async mounted() {
    this.getDeviceData()
    this.unAdbWatch = await this.$adb.watch(this.onAdbWatch)
  },
  beforeUnmount() {
    this?.unAdbWatch?.()
  },
  activated() {
    this.getDeviceData()
  },
  methods: {
    getDictLabel,
    filterMethod(value, row, column) {
      const property = column.property
      return row[property] === value
    },
    onSelectionChange(rows) {
      this.selectionRows = rows
    },
    async onAdbWatch(type, ret) {
      if (ret && ret.id) {
        this.getDeviceData()
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
      this.$refs.tableRef.toggleRowExpansion(...args)
    },

    handleConnect(...args) {
      this.$refs.wirelessGroupRef.connect(...args)
    },

    async handleRefresh() {
      this.loading = true
      await sleep()
      this.getDeviceData({ resetResolve: true, unloading: true })
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

        this.$message.success(this.$t('device.reset.success'))
      }
      catch (error) {
        if (error.message) {
          console.warn(error.message)
        }
      }
    },

    async getDeviceData(options = {}) {
      const { resetResolve = false, unloading = false } = options

      if (!unloading) {
        this.loading = true
      }

      try {
        const data = await this.$store.device.getList()

        this.deviceList = data
      }
      catch (error) {
        const message = error?.message || error?.cause?.message || ''

        console.warn(message)

        if (message.includes('failed to start daemon')) {
          this.getDeviceData()
          return false
        }

        if (message) {
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

  --el-empty-image-width: 24vh
}
</style>
