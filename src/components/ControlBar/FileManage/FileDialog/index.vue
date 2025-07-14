<template>
  <el-dialog
    v-model="dialog.visible"
    :title="$t('device.control.file.name')"
    width="97%"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    class="el-dialog--beautify"
    @closed="onClosed"
  >
    <div
      class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1"
    >
      <el-button
        text
        icon="Top"
        circle
        class="mr-2 flex-none"
        @click="handlePrev"
      ></el-button>

      <Scrollable ref="scrollableRef" class="flex-1 w-0 flex items-center">
        <el-breadcrumb separator-icon="ArrowRight" class="!flex">
          <el-breadcrumb-item
            v-for="item of breadcrumbModel"
            :key="item.value"
            class="!flex-none"
            @click="handleBreadcrumb(item)"
          >
            <el-button text class="!px-2" :icon="item.icon" :title="item.label">
              {{ $t(item.label) }}
            </el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </Scrollable>

      <div class="flex-none">
        <el-button text icon="Refresh" circle @click="getTableData"></el-button>
      </div>
    </div>

    <el-button-group class="mb-4 -ml-px">
      <AddPopover @success="handleAdd">
        <template #reference>
          <el-button type="default" icon="FolderAdd">
            {{ $t('device.control.file.manager.add') }}
          </el-button>
        </template>
      </AddPopover>

      <el-button
        type="default"
        icon="DocumentChecked"
        v-bind="{ loading: fileActions.loading }"
        @click="handleUpload(device)"
      >
        {{ $t('device.control.file.manager.upload') }}
      </el-button>

      <el-button
        type="default"
        icon="FolderChecked"
        v-bind="{ loading: fileActions.loading }"
        @click="handleUpload(device, 'openDirectory')"
      >
        {{ $t('device.control.file.manager.upload.directory') }}
      </el-button>

      <el-button
        type="default"
        icon="Download"
        :disabled="!selectionRows.length"
        @click="handleDownload()"
      >
        {{ $t('device.control.file.manager.download') }}
      </el-button>
    </el-button-group>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      size="small"
      row-key="id"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        type="selection"
        reserve-selection
        width="50"
        align="left"
        :selectable="(row) => ['file'].includes(row.type)"
      ></el-table-column>

      <el-table-column
        prop="name"
        :label="$t('common.name')"
        sortable
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-link
            v-if="row.type === 'directory'"
            type="default"
            icon="Folder"
            class="!space-x-2"
            @click="handleDirectory(row)"
          >
            {{ row.name }}
          </el-link>
          <el-link
            v-else
            type="default"
            icon="Document"
            class="!space-x-2"
            @click="handleDownload(row)"
          >
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        prop="size"
        :label="$t('common.size')"
        sortable
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="updateTime"
        :label="$t('time.update')"
        sortable
        align="center"
      >
      </el-table-column>

      <el-table-column :label="$t('device.control.name')" align="center">
        <template #default="{ row }">
          <EleTooltipButton
            v-if="['file'].includes(row.type)"
            effect="light"
            placement="top"
            :offset="2"
            :content="$t('common.download')"
            text
            type="primary"
            icon="Download"
            circle
            @click="handleDownload(row)"
          >
          </EleTooltipButton>

          <EleTooltipButton
            effect="light"
            placement="top"
            :offset="2"
            :content="$t('common.delete')"
            text
            type="danger"
            icon="Delete"
            circle
            @click="handleRemove(row)"
          >
          </EleTooltipButton>
        </template>
      </el-table-column>
    </el-table>

    <template #footer></template>
  </el-dialog>
</template>

<script setup>
import AddPopover from './AddPopover/index.vue'

const preferenceStore = usePreferenceStore()

const fileActions = reactive(useFileActions())

const dialog = reactive(useDialog())

const device = ref()

const loading = ref(false)

const tableData = ref([])

const currentPath = ref('/sdcard')

const presetMap = {
  sdcard: {
    icon: 'Iphone',
    label: 'device.control.file.manager.storage',
    value: '/sdcard',
  },
}

const breadcrumbModel = computed(() => {
  const slicePath = currentPath.value.slice(1)

  const list = slicePath ? slicePath.split('/') : ['/']

  const value = list.map(item => ({
    label: item,
    value: item,
    ...(presetMap[item] || {}),
  }))

  return value
})

function open(args) {
  device.value = args
  dialog.open(args)
  getTableData()
}

function onClosed() {
  currentPath.value = 'sdcard'
  dialog.reset()
}

async function getTableData() {
  loading.value = true

  const data = await window.adb.readdir(device.value.id, currentPath.value)

  loading.value = false

  tableData.value = data
}

const selectionRows = ref([])

function onSelectionChange(selection) {
  selectionRows.value = selection
}

const scrollableRef = ref()

async function handleDirectory(row) {
  currentPath.value = row.id
  getTableData()

  await nextTick()
  scrollableRef.value.scrollToEnd()
}

function handleBreadcrumb(data) {
  const index = currentPath.value.indexOf(data.value)

  currentPath.value = currentPath.value.slice(0, index + data.value.length)

  getTableData()
}

function handlePrev() {
  let value = '/'

  if (breadcrumbModel.value.length > 1) {
    value = breadcrumbModel.value
      .slice(0, -1)
      .map(item => item.value)
      .join('/')
  }

  currentPath.value = value

  getTableData()
}

async function handleAdd(dirname) {
  await window.adb.deviceShell(
    device.value.id,
    `mkdir ${currentPath.value}/${dirname}`,
  )

  getTableData()
}

async function handleRemove(row) {
  try {
    await ElMessageBox.confirm(
      window.t('device.control.file.manager.delete.tips'),
      window.t('common.tips'),
      {
        type: 'warning',
      },
    )
  }
  catch (error) {
    return error.message
  }

  await window.adb.deviceShell(
    device.value.id,
    `rm -r "${currentPath.value}/${row.name}"`,
  )

  getTableData()
}

async function handleUpload(device, openType) {
  await fileActions.send(device, {
    openType,
    remotePath: currentPath.value,
  })

  getTableData()
}

async function handleDownload(row) {
  try {
    await ElMessageBox.confirm(
      window.t('device.control.file.manager.download.tips'),
      window.t('common.tips'),
      {
        type: 'info',
      },
    )
  }
  catch (error) {
    return error.message
  }

  const pathList = row
    ? [row.id]
    : selectionRows.value
        .filter(item => item.type === 'file')
        .map(item => item.id)

  const savePath = preferenceStore.getData(device.value.id)?.savePath

  const closeLoading = ElMessage.loading(window.t('common.downloading')).close

  for (let index = 0; index < pathList.length; index++) {
    const item = pathList[index]

    await window.adb
      .pull(device.value.id, item, { savePath })
      .catch(e => console.warn(e?.message))
  }

  closeLoading()

  ElMessage.success(window.t('common.success'))
}

defineExpose({
  open,
})
</script>

<style></style>
