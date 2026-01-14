<template>
  <el-config-provider :locale="locale" :size="getSize($grid)">
    <div class="flex flex-col h-screen bg-white dark:bg-gray-900 p-4">
      <div class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
        <div class="flex-none flex items-center">
          <el-button
            text
            icon="Back"
            circle
            :disabled="!explorer.canGoBack.value"
            @click="explorer.goBack()"
          ></el-button>
          <el-button
            text
            icon="Right"
            circle
            :disabled="!explorer.canGoForward.value"
            @click="explorer.goForward()"
          ></el-button>
          <el-button
            text
            icon="Top"
            circle
            :disabled="explorer.isRoot.value"
            @click="explorer.goUp()"
          ></el-button>
        </div>

        <Scrollable ref="scrollableRef" class="flex-1 w-0 flex items-center mx-2">
          <el-breadcrumb separator-icon="ArrowRight" class="!flex">
            <el-breadcrumb-item
              v-for="item of explorer.breadcrumbs.value"
              :key="item.value"
              class="!flex-none"
              @click="explorer.navigateByBreadcrumb(item)"
            >
              <el-button text class="!px-2" :icon="item.icon" :title="item.label">
                {{ $t(item.label) || item.label }}
              </el-button>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </Scrollable>

        <div class="flex-none">
          <el-button
            text
            icon="Refresh"
            circle
            :loading="explorer.loading.value"
            @click="explorer.refresh()"
          ></el-button>
        </div>
      </div>

      <div class="flex items-center mb-4">
        <div class="-ml-px space-x-2 mr-auto">
          <AddPopover @success="handleAdd">
            <template #reference>
              <el-button type="default" icon="Plus">
                {{ $t('device.control.file.manager.add') }}
              </el-button>
            </template>
          </AddPopover>

          <el-dropdown ref="uploadDropdownRef" :trigger="uploadDropdownTrigger" @command="handleUpload">
            <el-button
              type="default"
              icon="Upload"
              :loading="explorer.uploader.uploading.value"
              @click="handleUpload()"
            >
              {{ $t('device.control.file.manager.upload') }}
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="openFile">
                  {{ $t('common.file') }}
                </el-dropdown-item>
                <el-dropdown-item command="openDirectory">
                  {{ $t('common.directory') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <el-button
          v-if="explorer.clipboard.hasClipboard.value"
          type="primary"
          icon="DocumentCopy"
          class="mr-2"
          @click="handlePaste"
        >
          {{ $t('device.control.file.manager.paste') }}
          ({{ explorer.clipboard.clipboardState.value.count }})
        </el-button>

        <el-button-group>
          <el-button
            type="default"
            icon="Download"
            :disabled="!explorer.selection.hasSelection.value"
            :loading="explorer.downloader.downloading.value"
            @click="handleDownload()"
          >
            {{ $t('device.control.file.manager.download') }}
          </el-button>
          <el-button
            type="default"
            icon="CopyDocument"
            :disabled="!explorer.selection.hasSelection.value"
            @click="handleCopy"
          >
            {{ $t('device.control.file.manager.copy') }}
          </el-button>
          <el-button
            type="default"
            icon="Scissor"
            :disabled="!explorer.selection.hasSelection.value"
            @click="handleCut"
          >
            {{ $t('device.control.file.manager.cut') }}
          </el-button>

          <el-button
            type="default" icon="Delete"
            :disabled="!explorer.selection.hasSelection.value"
            @click="handleRemove()"
          >
            {{ $t('common.delete') }}
          </el-button>
        </el-button-group>
      </div>

      <div class="flex-1 overflow-hidden">
        <el-table
          ref="tableRef"
          v-loading="explorer.loading.value"
          :data="explorer.files.value"
          stripe
          size="small"
          row-key="id"
          height="100%"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @row-contextmenu="handleContextMenu"
        >
          <el-table-column type="selection" reserve-selection width="50" align="left" />

          <el-table-column prop="name" :label="$t('common.name')" sortable show-overflow-tooltip min-width="200">
            <template #default="{ row }">
              <div
                class="flex items-center cursor-pointer hover:text-primary-500 hover:underline"
                :class="{ 'opacity-50': explorer.clipboard.isCut(row) }"
                @click.stop="handleNameClick(row)"
              >
                <FileIcon :file="row" size="lg" class="mr-2" />
                <span class="truncate">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="size" :label="$t('common.size')" sortable align="left" min-width="100" />

          <el-table-column prop="updateTime" :label="$t('time.update')" sortable align="left" min-width="150" />

          <el-table-column :label="$t('device.control.name')" align="left" min-width="200">
            <template #default="{ row }">
              <ExTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.preview')"
                text
                type="success"
                icon="View"
                circle
                :button-class="['file'].includes(row.type) ? '!visible' : '!invisible'"
                @click.stop="handlePreview(row)"
              />

              <ExTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('common.download')"
                text
                type="primary"
                icon="Download"
                circle
                @click.stop="handleDownload(row)"
              />

              <ExTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.edit')"
                text
                type="success"
                icon="Edit"
                circle
                @click.stop="handleEdit(row)"
              />

              <ExTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.move')"
                text
                type="info"
                icon="Rank"
                circle
                @click.stop="handleMoveItem(row)"
              />

              <ExTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('common.delete')"
                text
                type="danger"
                icon="Delete"
                circle
                @click.stop="handleRemove(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          {{ explorer.files.value.length }} {{ $t('common.item') || 'items' }}
          <span v-if="explorer.selection.hasSelection.value">
            , {{ explorer.selection.selectionCount.value }} {{ $t('common.selected') || 'selected' }}
          </span>
        </div>
        <div v-if="explorer.clipboard.hasClipboard.value" class="flex items-center gap-1">
          <el-tag size="small" :type="explorer.clipboard.isCutOperation.value ? 'warning' : 'info'">
            {{ explorer.clipboard.isCutOperation.value
              ? $t('device.control.file.manager.cut')
              : $t('device.control.file.manager.copy') }}
            : {{ explorer.clipboard.clipboardState.value.count }}
          </el-tag>
          <el-button text size="small" @click="explorer.clipboard.clear()">
            {{ $t('common.cancel') }}
          </el-button>
        </div>
      </div>
    </div>

    <MoveDialog
      ref="moveDialogRef"
      :device-id="device?.id"
      :action="pathSelectAction"
      @confirm="handlePathSelectConfirm"
    />

    <EditDialog ref="editDialogRef" :explorer />
  </el-config-provider>
</template>

<script setup>
import useExplorer from '$/hooks/useExplorer'
import AddPopover from './components/add/index.vue'
import EditDialog from './components/edit/index.vue'
import MoveDialog from './components/move/index.vue'

const deviceStore = useDeviceStore()
const preferenceStore = usePreferenceStore()
const tableRef = ref()
const scrollableRef = ref()
const moveDialogRef = ref()
const editDialogRef = ref()
const pathSelectAction = ref('move')

const uploadDropdownTrigger = ['darwin'].includes(window.electron.process.platform) ? 'contextmenu' : 'hover'

const explorer = useExplorer()

const { queryParams: device, locale, getSize } = useWindowStateSync({
  onQueryMounted() {
    explorer.init(device.value, '/sdcard')
    const deviceName = deviceStore.getLabel(device.value, 'name')
    document.title = `${deviceName} - Escrcpy Explorer`
  },
})

watch(() => explorer.breadcrumbs.value.length, async () => {
  await nextTick()
  scrollableRef.value?.scrollToEnd?.()
})

function handleSelectionChange(selection) {
  explorer.selection.setSelection(selection)
}

async function handleAdd({ name, type }) {
  let result
  if (type === 'file') {
    result = await explorer.operations.createFile(name)
  }
  else {
    result = await explorer.operations.createDirectory(name)
  }

  if (result.success) {
    ElMessage.success(window.t('common.success'))
  }
  else {
    ElMessage.error(result.error || window.t('common.faileded'))
  }
}

async function handleRemove(row) {
  try {
    await ElMessageBox.confirm(
      window.t('device.control.file.manager.delete.tips'),
      window.t('common.tips'),
      { type: 'warning' },
    )
  }
  catch {
    return
  }

  const items = row ? [row] : explorer.selection.selectedItems.value
  const result = await explorer.operations.remove(items)

  if (result.success) {
    ElMessage.success(window.t('device.control.file.manager.delete.success'))
    explorer.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.delete.error', { error: result.error }))
  }
}

function handleEdit(row) {
  editDialogRef.value?.open(row)
}

async function handleUpload(command) {
  const properties = ['multiSelections']

  const positiveDropdown = ['hover', 'click'].includes(uploadDropdownTrigger)

  if (!command && positiveDropdown) {
    return false
  }

  const openTypes = command ? [command] : ['openFile', 'openDirectory']

  properties.unshift(...openTypes)

  const files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
    properties,
  })

  if (!files || files.length === 0)
    return

  const messageLoading = useMessageLoading(
    window.t('device.control.file.manager.upload.scanning'),
    {
      showClose: true,
      onCancel: () => explorer.uploader.cancel(),
    },
  )

  try {
    const result = await explorer.uploader.upload(files, {
      onScanProgress: ({ filesFound }) => {
        messageLoading.update(
          window.t('device.control.file.manager.upload.scanning.files', { count: filesFound }),
        )
      },
      onProgress: ({ total, file }) => {
        messageLoading.update(
          window.t('device.control.file.manager.upload.progress', {
            percent: Math.round(total.percent || 0),
            completed: total.completedFiles || 0,
            total: total.files || 0,
          }),
        )
      },
    })

    messageLoading.close()

    if (result.cancelled) {
      ElMessage.info(window.t('device.control.file.manager.upload.cancelled'))
    }
    else if (result.success) {
      const stats = result.stats || {}
      ElMessage.success(
        `${window.t('device.control.file.manager.upload.success')
        } (${stats.successFiles || 0}/${stats.totalFiles || 0})`,
      )
    }
    else if (result.error) {
      ElMessage.error(window.t('device.control.file.manager.upload.error', { error: result.error }))
    }
  }
  catch (error) {
    messageLoading.close()
    console.error('Upload error:', error)
    ElMessage.error(window.t('device.control.file.manager.upload.error', { error: error.message }))
  }
}

async function handlePreview(row) {
  const supportCheck = explorer.previewer.checkPreviewSupport(row)
  if (!supportCheck.supported) {
    ElMessage.warning(
      window.t('device.control.file.manager.preview.unsupported')
      + (supportCheck.reason ? `: ${supportCheck.reason}` : ''),
    )
    return
  }

  const messageLoading = useMessageLoading(
    window.t('common.loading'),
    { showClose: false },
  )

  try {
    const result = await explorer.previewer.previewFile(row, {
      onProgress: () => {
      },
    })

    messageLoading.close()

    if (result.success) {
    }
    else if (result.error) {
      ElMessage.error(window.t('device.control.file.manager.preview.error', { error: result.error }))
    }
  }
  catch (error) {
    messageLoading.close()
    console.error('Preview error:', error)
    ElMessage.error(window.t('device.control.file.manager.preview.error', { error: error.message }))
  }
}

async function handleDownload(row) {
  try {
    await ElMessageBox.confirm(
      window.t('device.control.file.manager.download.tips'),
      window.t('common.tips'),
      { type: 'info' },
    )
  }
  catch {
    return
  }

  const items = row ? [row] : explorer.selection.selectedItems.value
  if (items.length === 0)
    return

  const savePath = preferenceStore.getData(device.value.id)?.savePath || './'

  const messageLoading = useMessageLoading(
    window.t('device.control.file.manager.download.scanning'),
    {
      showClose: true,
      onCancel: () => explorer.downloader.cancel(),
    },
  )

  const result = await explorer.downloader.download(items, {
    savePath,
    onProgress: ({ total }) => {
      if (total) {
        messageLoading.update(
          window.t('device.control.file.manager.download.progress', {
            percent: total.percent || 0,
            completed: total.completedFiles || 0,
            total: total.files || 0,
          }),
        )
      }
    },
    onScanProgress: ({ filesFound }) => {
      messageLoading.update(
        window.t('device.control.file.manager.download.scanning.files', { count: filesFound }),
      )
    },
  })

  messageLoading.close()

  if (result.cancelled) {
    ElMessage.warning(window.t('device.control.file.manager.download.cancelled'))
  }
  else if (result.success) {
    console.log('result', result)
    ElMessage.success(
      window.t('device.control.file.manager.download.success', {
        total: result.stats?.totalFiles || 0,
        success: result.stats?.completedFiles || 0,
        failed: result.stats?.failedFiles || 0,
      }),
    )
    explorer.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.download.error', { error: result.error }))
  }
}

function handleCopy() {
  const items = explorer.selection.selectedItems.value
  if (items.length > 0) {
    explorer.clipboard.copy(items)
    ElMessage.success(`${window.t('device.control.file.manager.copy')}: ${items.length}`)
  }
}

function handleCut() {
  const items = explorer.selection.selectedItems.value
  if (items.length > 0) {
    explorer.clipboard.cut(items)
    ElMessage.success(`${window.t('device.control.file.manager.cut')}: ${items.length}`)
  }
}

async function handlePaste() {
  const result = await explorer.clipboard.paste({ autoRefresh: true })
  if (result.success) {
    ElMessage.success(window.t('device.control.file.manager.paste.success'))
    explorer.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.paste.error', { error: result.error }))
  }
}

function handleMoveItem(row) {
  pathSelectAction.value = 'move'
  moveDialogRef.value?.open([row], explorer.currentPath.value)
}

async function handlePathSelectConfirm({ targetPath, items }) {
  let result
  if (pathSelectAction.value === 'move') {
    result = await explorer.operations.move(items, targetPath, { autoRefresh: true })
  }
  else {
    result = await explorer.operations.copy(items, targetPath, { autoRefresh: true })
  }

  if (result.success) {
    const msgKey = pathSelectAction.value === 'move'
      ? 'device.control.file.manager.move.success'
      : 'device.control.file.manager.copy.success'
    ElMessage.success(window.t(msgKey))
    explorer.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    const msgKey = pathSelectAction.value === 'move'
      ? 'device.control.file.manager.move.error'
      : 'device.control.file.manager.copy.error'
    ElMessage.error(window.t(msgKey, { error: result.error }))
  }
}

async function handleNameClick(row) {
  if (!['file'].includes(row.type)) {
    explorer.navigateTo(row.id)
    return false
  }

  const supportCheck = explorer.previewer.checkPreviewSupport(row)

  if (supportCheck) {
    handlePreview(row)
    return false
  }

  handleDownload(row)
}

function handleContextMenu(row, column, event) {
  event.preventDefault()
  tableRef.value?.toggleRowSelection(row)
}

async function handleRowClick(row) {
  tableRef.value?.toggleRowSelection(row)
}
</script>

<style scoped>
</style>
