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
      <div v-if="loading" class="h-32 w-48 flex flex-col items-center justify-center gap-2 text-primary-500">
        <div class="i-ep-loading  animate-spin size-6"></div>
        <div class="">
          {{ $t('common.loading') }}
        </div>
      </div>

      <el-dropdown-menu v-else class="!p-0">
        <div class="sticky top-0 z-10 px-2 py-2 bg-[var(--el-bg-color-overlay)] border-b dark:border-gray-700">
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
          <div :class="[labelClass]">
            {{ item.label }}
          </div>

          <div v-if="$slots.actions" class="absolute inset-y-center right-1 z-5 flex items-center">
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
import { parseActivityList, parsePackageList, parseUserList } from './helpers/index.js'

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
  labelClass: {
    type: [String, Object, Array],
    default: '',
  },
  maxHeight: {
    type: String,
    default: '300px',
  },
  labelFormatter: {
    type: Function,
    default: item => `${item.name || item.label}[${item.packageName}]`,
  },
  withSecondary: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change', 'visible-change'])

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

function buildSecondaryUserLabel(user) {
  return user.name || `User ${user.id}`
}

async function loadSecondaryUserApps(baseAppList = []) {
  const deviceId = props.deviceId
  const adbShell = window.$preload.adb.deviceShell

  const rawUsers = await adbShell(deviceId, 'pm list users').catch(() => '')
  const users = parseUserList(rawUsers).filter(({ id }) => id > 0)

  if (users.length === 0) {
    return []
  }

  const baseNameMap = new Map()

  for (const { packageName, name, label } of baseAppList) {
    if (!packageName) {
      continue
    }

    baseNameMap.set(packageName, name || label || packageName)
  }

  const results = await Promise.all(
    users.map(async (user) => {
      const userId = user.id
      const userLabel = buildSecondaryUserLabel(user)

      const [rawPackages, rawActivities] = await Promise.all([
        adbShell(deviceId, `pm list packages -3 --user ${userId}`).catch(() => ''),
        adbShell(
          deviceId,
          `cmd package query-activities --brief --components --user ${userId} -a android.intent.action.MAIN -c android.intent.category.LAUNCHER`,
        ).catch(() => ''),
      ])

      const thirdPartyPackages = parsePackageList(rawPackages)
      if (thirdPartyPackages.size === 0) {
        return []
      }

      const apps = []
      const dedupe = new Set()

      for (const item of parseActivityList(rawActivities)) {
        const { packageName, activity } = item

        if (!thirdPartyPackages.has(packageName)) {
          continue
        }
        if (dedupe.has(activity)) {
          continue
        }

        dedupe.add(activity)

        const appName = baseNameMap.get(packageName) || packageName

        apps.push({
          name: appName,
          label: `${appName}[${userLabel}]`,
          value: `${packageName}@user:${userId}`,
          packageName,
          activity,
          userId,
          userName: userLabel,
          isCloned: true,
        })
      }

      return apps
    }),
  )

  const apps = []

  for (const group of results) {
    apps.push(...group)
  }

  return apps
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
      const baseAppList = await window.$preload.scrcpy.getAppList(props.deviceId) || []

      appList.value = baseAppList
      loaded.value = true

      if (props.withSecondary) {
        const secondaryUserApps = await loadSecondaryUserApps(baseAppList).catch((error) => {
          console.warn('appSelector.loadSecondaryUserApps.error', error)
          return []
        })

        appList.value = [...baseAppList, ...secondaryUserApps]
      }
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

  emit('visible-change', val)

  if (val) {
    await loadAppList()
    await nextTick()
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

defineExpose({ loadAppList, appList, loading })
</script>
