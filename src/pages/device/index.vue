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

        <el-table-column type="selection" :selectable="selectable"></el-table-column>

        <el-table-column
          :label="$t('device.serial')"
          sortable
          show-overflow-tooltip
          align="left"
          min-width="200"
        >
          <template #default="{ row }">
            <div class="flex items-center space-x-2 relative">
              <DevicePopover :key="row.status" :device="row" class="" />

              <div class="flex-none max-w-[75%] truncate">
                {{ row.id }}
              </div>

              <el-link type="primary" :underline="false" title="WIFI" class="flex-none">
                <svg-icon v-if="row.wifi" name="wifi" class=""></svg-icon>
              </el-link>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('device.name')"
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
          v-slot="{ row }"
          :label="$t('device.control.name')"
          align="left"
          width="150"
        >
          <div class="flex items-center !space-x-0">
            <MirrorAction
              v-if="['device', 'unauthorized'].includes(row.status)"
              :ref="getMirrorActionRefs"
              v-bind="{ row, toggleRowExpansion }"
            />

            <MoreDropdown v-if="['device'].includes(row.status)" v-bind="{ row, toggleRowExpansion }" />

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

    <div class="flex-none flex items-center py-1 overflow-hidden py-2">
      <div class="flex-none">
        <WirelessGroup ref="wirelessGroupRef" v-bind="{ handleRefresh }" @auto-connected="onAutoConnected" />
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

<script setup>
import { sleep } from '$/utils/index.js'
import { uniqBy } from 'lodash-es'

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

const deviceStore = useDeviceStore()
const preferenceStore = usePreferenceStore()

const loading = ref(false)
const deviceList = ref([])
const mirrorActionRefs = ref([])
const selectionRows = ref([])

const { proxy } = getCurrentInstance()

const isMultipleRow = computed(() => selectionRows.value.length > 0)

const statusFilters = computed(() => {
  return deviceStatus
    .map(item => ({
      text: window.t(item.label),
      value: item.value,
    }))
    .filter(item => !['emulator'].includes(item.value))
})

const remarkFilters = computed(() => {
  const value = deviceList.value
    .filter(item => !!item.remark)
    .map(item => ({
      text: item.remark,
      value: item.remark,
    }))
  return uniqBy(value, 'value')
})

function selectable(row) {
  return ['device', 'emulator'].includes(row.status)
}

async function getDeviceData(options = {}) {
  const { unloading = false } = options

  if (!unloading) {
    loading.value = true
  }

  try {
    const data = await deviceStore.getList()
    deviceList.value = data
  }
  catch (error) {
    const message = error?.message || error?.cause?.message || ''
    console.warn('Device list fetch error:', message)

    if (message.includes('failed to start daemon')) {
      await getDeviceData()
      return false
    }

    if (message) {
      proxy.$message.warning(message)
    }

    deviceList.value = []
  }

  loading.value = false
}

function filterMethod(value, row, column) {
  const property = column.property
  return row[property] === value
}

function onSelectionChange(rows) {
  selectionRows.value = rows
}

async function onAdbWatch(type, ret) {
  if (ret && ret.id) {
    await sleep(1000)
    getDeviceData()
  }

  if (type === 'remove') {
    mirrorActionRefs.value = mirrorActionRefs.value.filter(
      item => item.row.id !== ret.id,
    )
  }
}

async function getMirrorActionRefs(ref) {
  await nextTick()

  if (!ref?.row?.id)
    return false

  const exists = mirrorActionRefs.value.some(item => item.row.id === ref.row.id)
  if (exists)
    return false

  const length = mirrorActionRefs.value.length
  mirrorActionRefs.value.push(ref)

  await sleep(length * 1000)

  const autoMirror = preferenceStore.data.autoMirror
  if (autoMirror) {
    ref.handleClick(ref.row)
  }
}

function toggleRowExpansion(...args) {
  proxy.$refs.tableRef.toggleRowExpansion(...args)
}

function handleConnect(...args) {
  proxy.$refs.wirelessGroupRef.connect(...args)
}

async function handleRefresh() {
  loading.value = true
  await sleep()
  getDeviceData({ resetResolve: true, unloading: true })
}

function onAutoConnected() {}

let unAdbWatch = null

onMounted(async () => {
  await getDeviceData()
  unAdbWatch = await proxy.$adb.watch(onAdbWatch)
})

onBeforeUnmount(() => {
  unAdbWatch?.()
})

onActivated(() => {
  getDeviceData()
})
</script>

<style lang="postcss" scoped>
:deep() {
  .el-table .el-table__row .cell {
    @apply py-1;
  }

  --el-empty-image-width: 24vh
}
</style>
