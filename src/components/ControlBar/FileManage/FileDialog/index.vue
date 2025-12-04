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
    <!-- 导航栏 -->
    <div class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      <!-- 后退/前进/上级按钮 -->
      <div class="flex-none flex items-center">
        <el-button
          text
          icon="Back"
          circle
          :disabled="!fileManager.canGoBack.value"
          @click="fileManager.goBack()"
        ></el-button>
        <el-button
          text
          icon="Right"
          circle
          :disabled="!fileManager.canGoForward.value"
          @click="fileManager.goForward()"
        ></el-button>
        <el-button
          text
          icon="Top"
          circle
          :disabled="fileManager.isRoot.value"
          @click="fileManager.goUp()"
        ></el-button>
      </div>

      <!-- 面包屑导航 -->
      <Scrollable ref="scrollableRef" class="flex-1 w-0 flex items-center mx-2">
        <el-breadcrumb separator-icon="ArrowRight" class="!flex">
          <el-breadcrumb-item
            v-for="item of fileManager.breadcrumbs.value"
            :key="item.value"
            class="!flex-none"
            @click="fileManager.navigateByBreadcrumb(item)"
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
          :loading="fileManager.loading.value"
          @click="fileManager.refresh()"
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
          :loading="fileManager.uploader.uploading.value"
          @click="handleUpload()"
        >
          {{ $t('device.control.file.manager.upload') }}
        </el-button>

        <!-- 下载 -->
        <el-button
          type="default"
          icon="Download"
          :disabled="!fileManager.selection.hasSelection.value"
          :loading="fileManager.downloader.downloading.value"
          @click="handleDownload()"
        >
          {{ $t('device.control.file.manager.download') }}
        </el-button>
      </el-button-group>

      <!-- 剪贴板操作 -->
      <el-button-group v-if="fileManager.selection.hasSelection.value">
        <el-button type="default" icon="CopyDocument" @click="handleCopy">
          {{ $t('device.control.file.manager.copy') }}
        </el-button>
        <el-button type="default" icon="Scissor" @click="handleCut">
          {{ $t('device.control.file.manager.cut') }}
        </el-button>
      </el-button-group>

      <el-button
        v-if="fileManager.clipboard.hasClipboard.value"
        type="primary"
        icon="DocumentCopy"
        @click="handlePaste"
      >
        {{ $t('device.control.file.manager.paste') }}
        ({{ fileManager.clipboard.clipboardState.value.count }})
      </el-button>
    </div>

    <!-- 文件列表 -->
    <el-table
      ref="tableRef"
      v-loading="fileManager.loading.value"
      :data="fileManager.files.value"
      stripe
      size="small"
      row-key="id"
      @selection-change="handleSelectionChange"
      @row-contextmenu="handleContextMenu"
    >
      <el-table-column type="selection" reserve-selection width="50" align="left" />

      <el-table-column prop="name" :label="$t('common.name')" sortable show-overflow-tooltip>
        <template #default="{ row }">
          <div
            class="flex items-center cursor-pointer"
            :class="{ 'opacity-50': fileManager.clipboard.isCut(row) }"
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
            v-if="isTextFile(row)"
            effect="light"
            placement="top"
            :offset="2"
            :content="$t('device.control.file.manager.edit')"
            text
            type="success"
            icon="EditPen"
            circle
            @click="handleEdit(row)"
          />

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
            :content="$t('device.control.file.manager.rename')"
            text
            type="warning"
            icon="Edit"
            circle
            @click="handleRename(row)"
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

    <!-- 状态栏 -->
    <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
      <div>
        {{ fileManager.files.value.length }} {{ $t('common.item') || 'items' }}
        <span v-if="fileManager.selection.hasSelection.value">
          , {{ fileManager.selection.selectionCount.value }} {{ $t('common.selected') || 'selected' }}
        </span>
      </div>
      <div v-if="fileManager.clipboard.hasClipboard.value" class="flex items-center">
        <el-tag size="small" :type="fileManager.clipboard.isCutOperation.value ? 'warning' : 'info'">
          {{ fileManager.clipboard.isCutOperation.value
            ? $t('device.control.file.manager.cut')
            : $t('device.control.file.manager.copy') }}
          : {{ fileManager.clipboard.clipboardState.value.count }}
        </el-tag>
        <el-button text size="small" @click="fileManager.clipboard.clear()">
          {{ $t('common.cancel') }}
        </el-button>
      </div>
    </div>

    <template #footer></template>
  </el-dialog>

  <!-- 路径选择对话框 -->
  <MoveDialog
    ref="moveDialogRef"
    :device-id="device?.id"
    :action="pathSelectAction"
    @confirm="handlePathSelectConfirm"
  />

  <!-- 编辑对话框 -->
  <EditDialog ref="editDialogRef" :file-manager="fileManager" @success="handleEditSuccess" />
</template>

<script setup>
import useAdbFileManager from '$/hooks/useAdbFileManager'
import AddPopover from './AddPopover/index.vue'
import EditDialog from './EditDialog/index.vue'
import MoveDialog from './MoveDialog/index.vue'

const preferenceStore = usePreferenceStore()
const dialog = reactive(useDialog())
const device = ref()
const tableRef = ref()
const scrollableRef = ref()
const moveDialogRef = ref()
const editDialogRef = ref()
const pathSelectAction = ref('move')

// 使用文件管理器 hook
const fileManager = useAdbFileManager()

// 允许编辑的文本文件扩展名
const TEXT_FILE_EXTENSIONS = ['.txt', '.md', '.log', '.json']

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

// 打开对话框
function open(info) {
  device.value = info
  dialog.open(info)
  fileManager.init(info, '/sdcard')
}

// 关闭对话框
function onClosed() {
  fileManager.reset()
  dialog.reset()
}

// 处理选择变化
function handleSelectionChange(selection) {
  fileManager.selection.setSelection(selection)
}

// 处理项目点击
async function handleItemClick(row) {
  if (row.type === 'directory') {
    await fileManager.navigateTo(row.id)
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
    result = await fileManager.operations.createFile(name)
  }
  else {
    result = await fileManager.operations.createDirectory(name)
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

  const items = row ? [row] : fileManager.selection.selectedItems.value
  const result = await fileManager.operations.remove(items)

  if (result.success) {
    ElMessage.success(window.t('device.control.file.manager.delete.success'))
    fileManager.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.delete.error', { error: result.error }))
  }
}

// 重命名
function handleRename(row) {
  editDialogRef.value?.openRename(row)
}

// 编辑文件
function handleEdit(row) {
  editDialogRef.value?.openEdit(row)
}

// 编辑成功回调
function handleEditSuccess() {
  // 编辑对话框已经处理了刷新，这里不需要额外操作
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
      onCancel: () => fileManager.uploader.cancel(),
    },
  )

  try {
    const result = await fileManager.uploader.upload(files, {
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
            completed: total.uploaded || 0,
            total: total.size || 0,
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
  const supportCheck = fileManager.previewer.checkPreviewSupport(row)
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
    const result = await fileManager.previewer.previewFile(row, {
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

  const items = row ? [row] : fileManager.selection.selectedItems.value
  if (items.length === 0)
    return

  const savePath = preferenceStore.getData(device.value.id)?.savePath || './'

  // 创建进度提示
  const messageLoading = useMessageLoading(
    window.t('device.control.file.manager.download.scanning'),
    {
      showClose: true,
      onCancel: () => fileManager.downloader.cancel(),
    },
  )

  const result = await fileManager.downloader.download(items, {
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
    fileManager.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.download.error', { error: result.error }))
  }
}

// 复制到剪贴板
function handleCopy() {
  const items = fileManager.selection.selectedItems.value
  if (items.length > 0) {
    fileManager.clipboard.copy(items)
    ElMessage.success(`${window.t('device.control.file.manager.copy')}: ${items.length}`)
  }
}

// 剪切到剪贴板
function handleCut() {
  const items = fileManager.selection.selectedItems.value
  if (items.length > 0) {
    fileManager.clipboard.cut(items)
    ElMessage.success(`${window.t('device.control.file.manager.cut')}: ${items.length}`)
  }
}

// 粘贴
async function handlePaste() {
  const result = await fileManager.clipboard.paste({ autoRefresh: true })
  if (result.success) {
    ElMessage.success(window.t('device.control.file.manager.paste.success'))
    fileManager.selection.clearSelection()
    tableRef.value?.clearSelection()
  }
  else {
    ElMessage.error(window.t('device.control.file.manager.paste.error', { error: result.error }))
  }
}

// 移动单个项目
function handleMoveItem(row) {
  pathSelectAction.value = 'move'
  moveDialogRef.value?.open([row], fileManager.currentPath.value)
}

// 路径选择确认
async function handlePathSelectConfirm({ targetPath, items }) {
  let result
  if (pathSelectAction.value === 'move') {
    result = await fileManager.operations.move(items, targetPath, { autoRefresh: true })
  }
  else {
    result = await fileManager.operations.copy(items, targetPath, { autoRefresh: true })
  }

  if (result.success) {
    const msgKey = pathSelectAction.value === 'move'
      ? 'device.control.file.manager.move.success'
      : 'device.control.file.manager.copy.success'
    ElMessage.success(window.t(msgKey))
    fileManager.selection.clearSelection()
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

defineExpose({
  open,
})
</script>

<style></style>
