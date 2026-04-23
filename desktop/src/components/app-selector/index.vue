<template>
  <el-dropdown
    ref="dropdownRef"
    :trigger="trigger"
    :max-height="maxHeight"
    v-bind="$attrs"
    @visible-change="onVisibleChange"
    @mouseenter="loadAppList"
    @keydown.stop
  >
    <slot :current="current" :loading="loading" />

    <template #dropdown>
      <el-dropdown-menu>
        <div class="sticky top-0 z-10 px-2 pt-2 pb-2 bg-[var(--el-bg-color-overlay)] border-b dark:border-gray-700">
          <el-input
            v-model="keyword"
            class="!w-full"
            :placeholder="$t('common.search')"
            prefix-icon="Search"
          />
        </div>

        <el-dropdown-item
          v-for="item of options"
          :key="item.value"
          :command="item.value"
          :divided="item.divided"
          :icon="item.icon"
          :title="item.packageName"
          @click="onSelect(item)"
        >
          <div :class="showActions ? 'pr-24' : ''">
            {{ item.label }}
          </div>

          <div v-if="showActions" class="absolute inset-y-center right-1 z-5 flex items-center">
            <slot name="actions" :item="item" />
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { pinyin } from 'pinyin-pro'
import { sleep } from '$/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
  trigger: {
    type: String,
    default: 'click',
  },
  withHome: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: '300px',
  },
  labelFormatter: {
    type: Function,
    default: item => `${item.name || item.label}[${item.packageName}]`,
  },
})

const emit = defineEmits(['change'])

const modelValue = defineModel({
  type: String,
  default: null,
})

const appList = ref([])
const loading = ref(false)
const loaded = ref(false)
const keyword = ref('')
const popupVisible = ref(false)
const dropdownRef = ref(null)
let loadPromise = null

const options = computed(() => {
  const value = appList.value.map(item => ({
    ...item,
    label: item.label || props.labelFormatter(item),
    value: item.value ?? item.packageName,
  }))

  if (props.withHome) {
    value.unshift({
      label: window.t('device.control.home'),
      value: '',
      icon: 'HomeFilled',
    })
  }

  if (keyword.value) {
    return value.filter((item) => {
      const pinyinLabel = pinyin(item.label, { toneType: 'none' }).replaceAll(' ', '')
      const matchText = [item.label, item.value, pinyinLabel, pinyinLabel.toLowerCase()].join('')
      return matchText.includes(keyword.value)
    })
  }

  return value
})

const current = computed(() => {
  const found = options.value.find(item => item.value === modelValue.value)
  return found || null
})

function parseUserList(rawText = '') {
  return rawText
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/UserInfo\{(\d+):([^:}]+):/)

      if (!match) {
        return null
      }

      return {
        id: Number(match[1]),
        name: match[2].trim(),
      }
    })
    .filter(Boolean)
}

function parsePackageList(rawText = '') {
  return new Set(
    rawText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.startsWith('package:'))
      .map(line => line.replace(/^package:/, '').trim()),
  )
}

function parseActivityList(rawText = '') {
  return rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && line.includes('/'))
    .map((line) => {
      const [packageName] = line.split('/', 1)

      return {
        packageName,
        activity: line,
      }
    })
}

function buildSecondaryUserLabel(user) {
  return user.name || `User ${user.id}`
}

async function loadSecondaryUserApps(baseAppList = []) {
  const rawUsers = await window.$preload.adb.deviceShell(props.deviceId, 'pm list users').catch(() => '')
  const users = parseUserList(rawUsers).filter(item => item.id > 0)

  if (!users.length) {
    return []
  }

  const baseNameMap = new Map(
    baseAppList.map(item => [item.packageName, item.name || item.label || item.packageName]),
  )

  const groups = await Promise.all(
    users.map(async (user) => {
      const [rawPackages, rawActivities] = await Promise.all([
        window.$preload.adb.deviceShell(props.deviceId, `pm list packages -3 --user ${user.id}`).catch(() => ''),
        window.$preload.adb.deviceShell(
          props.deviceId,
          `cmd package query-activities --brief --components --user ${user.id} -a android.intent.action.MAIN -c android.intent.category.LAUNCHER`,
        ).catch(() => ''),
      ])

      const thirdPartyPackages = parsePackageList(rawPackages)

      if (!thirdPartyPackages.size) {
        return []
      }

      const dedupe = new Set()

      return parseActivityList(rawActivities)
        .filter(item => thirdPartyPackages.has(item.packageName))
        .filter((item) => {
          const key = `${user.id}:${item.activity}`

          if (dedupe.has(key)) {
            return false
          }

          dedupe.add(key)
          return true
        })
        .map((item) => {
          const userLabel = buildSecondaryUserLabel(user)
          const appName = baseNameMap.get(item.packageName) || item.packageName

          return {
            name: appName,
            label: `${appName}[${userLabel}]`,
            value: `${item.packageName}@user:${user.id}`,
            packageName: item.packageName,
            activity: item.activity,
            userId: user.id,
            userName: userLabel,
            isCloned: true,
          }
        })
    }),
  )

  return groups.flat()
}

async function loadAppList() {
  if (!props.deviceId) {
    return []
  }

  if (loaded.value) {
    return appList.value
  }

  if (loadPromise) {
    return loadPromise
  }

  loading.value = true

  loadPromise = (async () => {
    try {
      const baseAppList = await window.$preload.scrcpy.getAppList(props.deviceId)
      const secondaryUserApps = await loadSecondaryUserApps(baseAppList)

      appList.value = [...(baseAppList || []), ...secondaryUserApps]
      loaded.value = true
    }
    catch {
      appList.value = []
    }
    finally {
      loading.value = false
      loadPromise = null
    }

    return appList.value
  })()

  return loadPromise
}

async function updateDropdownPosition() {
  await nextTick()

  requestAnimationFrame(() => {
    dropdownRef.value?.popperRef?.updatePopper?.()
  })
}

async function onVisibleChange(val) {
  popupVisible.value = val

  if (val) {
    await loadAppList()
    await updateDropdownPosition()
    return
  }

  if (!val) {
    await sleep()
    keyword.value = ''
  }
}

function onSelect(item) {
  modelValue.value = item.value
  emit('change', item.value, item)
}

watch(() => props.deviceId, () => {
  loaded.value = false
  appList.value = []
  loadPromise = null
})

watch(
  () => options.value.length,
  () => {
    if (!popupVisible.value) {
      return
    }

    updateDropdownPosition()
  },
  { flush: 'post' },
)

watch(keyword, () => {
  if (!popupVisible.value) {
    return
  }

  updateDropdownPosition()
}, { flush: 'post' })

defineExpose({ loadAppList, appList, loading })
</script>
