<template>
  <el-config-provider :locale="locale" :size="getSize($grid)">
    <div class="flex flex-col h-screen bg-white dark:bg-gray-900 p-4">
      <!-- 导航栏 -->
      <div class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
        <!-- 后退/前进/上级按钮 -->
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

        <!-- 面包屑导航 -->
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

        <!-- 刷新按钮 -->
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

      <!-- 工具栏 -->
      <div class="flex items-center justify-between mb-4">
        <el-button-group class="-ml-px">
          <!-- 新建 -->
          <AddPopover @success="handleAdd">
            <template #reference>
              <el-button type="default" icon="Plus">
                {{ $t('device.control.file.manager.add') }}
              </el-button>
            </template>
          </AddPopover>

          <!-- 上传（统一文件和目录上传） -->
          <el-button
            type="default"
            icon="Upload"
            :loading="explorer.uploader.uploading.value"
            @click="handleUpload()"
          >
            {{ $t('device.control.file.manager.upload') }}
          </el-button>
        </el-button-group>

        <!-- 批量操作 -->
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

        <el-button
          v-if="explorer.clipboard.hasClipboard.value"
          type="primary"
          icon="DocumentCopy"
          @click="handlePaste"
        >
          {{ $t('device.control.file.manager.paste') }}
          ({{ explorer.clipboard.clipboardState.value.count }})
        </el-button>
      </div>

      <!-- 文件列表 -->
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
          @row-contextmenu="handleContextMenu"
        >
          <el-table-column type="selection" reserve-selection width="50" align="left" />

          <el-table-column prop="name" :label="$t('common.name')" sortable show-overflow-tooltip>
            <template #default="{ row }">
              <div
                class="flex items-center cursor-pointer"
                :class="{ 'opacity-50': explorer.clipboard.isCut(row) }"
                @click="handleItemClick(row)"
              >
                <el-icon class="mr-2" :class="getFileIconClass(row)">
                  <component :is="getFileIcon(row)" />
                </el-icon>
                <span class="truncate">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="size" :label="$t('common.size')" sortable align="center" width="120" />

          <el-table-column prop="updateTime" :label="$t('time.update')" sortable align="center" width="180" />

          <el-table-column :label="$t('device.control.name')" align="center" width="240">
            <template #default="{ row }">
              <!-- 编辑按钮（仅文本文件可用） -->

              <EleTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('common.download')"
                text
                type="primary"
                icon="Download"
                circle
                @click="handleDownload(row)"
              />

              <!-- 预览按钮（仅文件） -->
              <EleTooltipButton
                v-if="!row.isDirectory"
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.preview')"
                text
                type="success"
                icon="View"
                circle
                @click="handlePreview(row)"
              />

              <EleTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.edit')"
                text
                type="success"
                icon="Edit"
                circle
                @click="handleEdit(row)"
              />

              <EleTooltipButton
                effect="light"
                placement="top"
                :offset="2"
                :content="$t('device.control.file.manager.move')"
                text
                type="info"
                icon="Rank"
                circle
                @click="handleMoveItem(row)"
              />

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
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 状态栏 -->
      <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          {{ explorer.files.value.length }} {{ $t('common.item') || 'items' }}
          <span v-if="explorer.selection.hasSelection.value">
            , {{ explorer.selection.selectionCount.value }} {{ $t('common.selected') || 'selected' }}
          </span>
        </div>
        <div v-if="explorer.clipboard.hasClipboard.value" class="flex items-center">
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

    <!-- 路径选择对话框 -->
    <MoveDialog
      ref="moveDialogRef"
      :device-id="device?.id"
      :action="pathSelectAction"
      @confirm="handlePathSelectConfirm"
    />

    <!-- 编辑对话框 -->
    <EditDialog ref="editDialogRef" :explorer />
  </el-config-provider>
</template>

<script setup>
import { TEXT_FILE_EXTENSIONS } from '$/dicts/index.js'
import useExplorer from '$/hooks/useExplorer'
import AddPopover from './components/AddPopover/index.vue'
import EditDialog from './components/EditDialog/index.vue'
import MoveDialog from './components/MoveDialog/index.vue'

const deviceStore = useDeviceStore()
const preferenceStore = usePreferenceStore()
const tableRef = ref()
const scrollableRef = ref()
const moveDialogRef = ref()
const editDialogRef = ref()
const pathSelectAction = ref('move')

// 使用文件管理器 hooks
const explorer = useExplorer()

const { init: initWindowStateSync, currentDevice: device, locale } = useWindowStateSync({
  onDeviceChange() {
    explorer.init(device.value, '/sdcard')
    const deviceName = deviceStore.getLabel(device.value, 'name')
    document.title = `${deviceName} - Escrcpy Explorer`
  },
})

initWindowStateSync()

onMounted(() => {
  window.electron.ipcRenderer.send('explorer-mounted')
})

// 文件图标映射
const FILE_ICON_MAP = {
  // 目录
  directory: { icon: 'Folder', class: 'text-yellow-500' },
  // 图片
  image: { icon: 'Picture', class: 'text-green-500', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'] },
  // 视频
  video: { icon: 'VideoCamera', class: 'text-purple-500', extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'] },
  // 音频
  audio: { icon: 'Headset', class: 'text-pink-500', extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'] },
  // 文档
  document: { icon: 'Document', class: 'text-blue-500', extensions: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'] },
  // 压缩包
  archive: { icon: 'Files', class: 'text-orange-500', extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'] },
  // 代码
  code: { icon: 'Tickets', class: 'text-cyan-500', extensions: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.vue', '.jsx', '.tsx'] },
  // 文本
  text: { icon: 'Memo', class: 'text-gray-500', extensions: ['.txt', '.md', '.log', '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg'] },
  // APK
  apk: { icon: 'Box', class: 'text-green-600', extensions: ['.apk'] },
  // 默认
  default: { icon: 'Document', class: 'text-blue-500' },
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string}
 */
function getFileExtension(filename) {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1)
    return ''
  return filename.substring(lastDotIndex).toLowerCase()
}

/**
 * 判断是否为文本文件
 * @param {Object} row - 文件行数据
 * @returns {boolean}
 */
function isTextFile(row) {
  if (row.type === 'directory')
    return false
  const ext = getFileExtension(row.name)
  return TEXT_FILE_EXTENSIONS.includes(ext)
}

/**
 * 获取文件图标组件名
 * @param {Object} row - 文件行数据
 * @returns {string}
 */
function getFileIcon(row) {
  if (row.type === 'directory') {
    return FILE_ICON_MAP.directory.icon
  }

  const ext = getFileExtension(row.name)

  for (const [, config] of Object.entries(FILE_ICON_MAP)) {
    if (config.extensions?.includes(ext)) {
      return config.icon
    }
  }

  return FILE_ICON_MAP.default.icon
}

/**
 * 获取文件图标样式类
 * @param {Object} row - 文件行数据
 * @returns {string}
 */
function getFileIconClass(row) {
  if (row.type === 'directory') {
    return FILE_ICON_MAP.directory.class
  }

  const ext = getFileExtension(row.name)

  for (const [, config] of Object.entries(FILE_ICON_MAP)) {
    if (config.extensions?.includes(ext)) {
      return config.class
    }
  }

  return FILE_ICON_MAP.default.class
}

// 处理选择变化
function handleSelectionChange(selection) {
  explorer.selection.setSelection(selection)
}

// 处理项目点击
async function handleItemClick(row) {
  if (row.type === 'directory') {
    await explorer.navigateTo(row.id)
    await nextTick()
    scrollableRef.value?.scrollToEnd()
  }
  else {
    handleDownload(row)
  }
}

// 新建文件或文件夹
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
    ElMessage.error(result.error || window.t('common.failed'))
  }
}

// 删除文件/文件夹
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

// 编辑文件
function handleEdit(row) {
  editDialogRef.value?.open(row)
}

// 上传文件
async function handleUpload() {
  // 选择文件和目录
  const files = await window.electron.ipcRenderer.invoke('show-open-dialog', {
    properties: ['openFile', 'openDirectory', 'multiSelections'],
  })

  if (!files || files.length === 0)
    return

  // 创建进度提示
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
        console.log('total', total)
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

// 预览文件
async function handlePreview(row) {
  // 检查是否支持预览
  const supportCheck = explorer.previewer.checkPreviewSupport(row)
  if (!supportCheck.supported) {
    ElMessage.warning(
      window.t('device.control.file.manager.preview.unsupported')
      + (supportCheck.reason ? `: ${supportCheck.reason}` : ''),
    )
    return
  }

  const messageLoading = useMessageLoading(
    window.t('device.control.file.manager.download.scanning'),
    { showClose: false },
  )

  try {
    const result = await explorer.previewer.previewFile(row, {
      onProgress: () => {
        // 预览时不显示详细进度
      },
    })

    messageLoading.close()

    if (result.success) {
      // 文件已成功打开，无需额外提示
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

// 下载文件
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

  // 创建进度提示
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

// 复制到剪贴板
function handleCopy() {
  const items = explorer.selection.selectedItems.value
  if (items.length > 0) {
    explorer.clipboard.copy(items)
    ElMessage.success(`${window.t('device.control.file.manager.copy')}: ${items.length}`)
  }
}

// 剪切到剪贴板
function handleCut() {
  const items = explorer.selection.selectedItems.value
  if (items.length > 0) {
    explorer.clipboard.cut(items)
    ElMessage.success(`${window.t('device.control.file.manager.cut')}: ${items.length}`)
  }
}

// 粘贴
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

// 移动单个项目
function handleMoveItem(row) {
  pathSelectAction.value = 'move'
  moveDialogRef.value?.open([row], explorer.currentPath.value)
}

// 路径选择确认
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

// 右键菜单
function handleContextMenu(row, column, event) {
  event.preventDefault()
  // 可以在这里添加右键菜单逻辑
}

function getSize(grid) {
  const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'

  return value
}
</script>

<style scoped>
</style>
