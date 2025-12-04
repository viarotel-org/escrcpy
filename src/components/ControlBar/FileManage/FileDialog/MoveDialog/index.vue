<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    class="el-dialog--beautify"
    @closed="onClosed"
  >
    <!-- 路径导航栏 -->
    <div class="flex items-center mb-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      <el-button
        text
        icon="Top"
        circle
        class="mr-2 flex-none"
        :disabled="isRoot"
        @click="handleGoUp"
      ></el-button>

      <Scrollable ref="scrollableRef" class="flex-1 w-0 flex items-center">
        <el-breadcrumb separator-icon="ArrowRight" class="!flex">
          <el-breadcrumb-item
            v-for="item of breadcrumbs"
            :key="item.value"
            class="!flex-none"
            @click="handleBreadcrumb(item)"
          >
            <el-button text class="!px-2" :icon="item.icon" :title="item.label">
              {{ $t(item.label) || item.label }}
            </el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </Scrollable>

      <div class="flex-none">
        <el-button text icon="Refresh" circle @click="loadDirectories"></el-button>
      </div>
    </div>

    <!-- 目录列表 -->
    <div class="border rounded-lg overflow-hidden" style="height: 300px;">
      <el-scrollbar>
        <div v-loading="loading" class="min-h-full">
          <div
            v-for="item in directories"
            :key="item.id"
            class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-blue-50 dark:bg-blue-900': selectedPath === item.id }"
            @click="selectDirectory(item)"
            @dblclick="enterDirectory(item)"
          >
            <el-icon class="mr-2 text-yellow-500">
              <Folder />
            </el-icon>
            <span class="truncate">{{ item.name }}</span>
          </div>
          <div v-if="!loading && directories.length === 0" class="py-8 text-center text-gray-400">
            {{ $t('common.empty') }}
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 当前选择的路径 -->
    <div class="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
      <span class="text-gray-500">{{ $t('device.control.file.manager.target.path') }}:</span>
      <span class="ml-2 font-mono">{{ selectedPath || currentPath }}</span>
    </div>

    <template #footer>
      <el-button @click="visible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="handleConfirm">
        {{ $t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    default: 'move', // 'move' or 'copy'
  },
})

const emit = defineEmits(['confirm'])

const visible = ref(false)
const loading = ref(false)
const currentPath = ref('/sdcard')
const selectedPath = ref('')
const directories = ref([])
const scrollableRef = ref()
const items = ref([])

const presetMap = {
  sdcard: {
    icon: 'Iphone',
    label: 'device.control.file.manager.storage',
    value: '/sdcard',
  },
}

const title = computed(() => {
  const key = props.action === 'move'
    ? 'device.control.file.manager.move.select.path'
    : 'device.control.file.manager.copy.select.path'
  return window.t(key)
})

const breadcrumbs = computed(() => {
  const slicePath = currentPath.value.slice(1)
  const list = slicePath ? slicePath.split('/') : ['/']
  return list.map(item => ({
    label: item,
    value: item,
    ...(presetMap[item] || {}),
  }))
})

const isRoot = computed(() => currentPath.value === '/')

async function loadDirectories() {
  loading.value = true
  try {
    const data = await window.adb.readdir(props.deviceId, currentPath.value)
    directories.value = data.filter(item => item.type === 'directory')
  }
  catch (error) {
    console.error('Failed to load directories:', error)
    directories.value = []
  }
  finally {
    loading.value = false
  }
}

function selectDirectory(item) {
  selectedPath.value = item.id
}

async function enterDirectory(item) {
  currentPath.value = item.id
  selectedPath.value = ''
  await loadDirectories()
  await nextTick()
  scrollableRef.value?.scrollToEnd()
}

function handleGoUp() {
  if (isRoot.value)
    return
  const segments = currentPath.value.split('/').filter(Boolean)
  currentPath.value = segments.length <= 1 ? '/' : `/${segments.slice(0, -1).join('/')}`
  selectedPath.value = ''
  loadDirectories()
}

function handleBreadcrumb(data) {
  const index = currentPath.value.indexOf(data.value)
  currentPath.value = currentPath.value.slice(0, index + data.value.length)
  if (!currentPath.value.startsWith('/'))
    currentPath.value = `/${currentPath.value}`
  selectedPath.value = ''
  loadDirectories()
}

function handleConfirm() {
  const targetPath = selectedPath.value || currentPath.value
  emit('confirm', { targetPath, items: items.value })
  visible.value = false
}

function onClosed() {
  currentPath.value = '/sdcard'
  selectedPath.value = ''
  directories.value = []
  items.value = []
}

function open(targetItems, initialPath = '/sdcard') {
  items.value = Array.isArray(targetItems) ? targetItems : [targetItems]
  currentPath.value = initialPath
  visible.value = true
  loadDirectories()
}

defineExpose({ open })
</script>
