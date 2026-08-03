<template>
  <el-dropdown ref="dropdownRef" trigger="click" max-height="70vh" @visible-change="handleVisibleChange">
    <el-button type="default" icon="Star">
      {{ $t('device.control.file.manager.quickAccess') }}
      <el-icon class="el-icon--right">
        <ArrowDown />
      </el-icon>
    </el-button>

    <template #dropdown>
      <el-dropdown-menu class="!py-0 quick-access-dropdown">
        <!-- Favorites section -->
        <div class="px-3 pt-3 pb-1">
          <div class="text-xs font-medium text-gray-500 mb-2">
            {{ $t('device.control.file.manager.favorites') }}
          </div>

          <template v-if="favorites.length > 0">
            <div
              v-for="item in displayFavorites"
              :key="item.id"
              class="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
              @click="handleSelect(item)"
            >
              <div class="flex items-center flex-1 min-w-0">
                <FileIcon
                  :file="{ name: item.name, type: item.type }"
                  size="lg"
                  class="mr-2 flex-none"
                />
                <span class="truncate text-sm" :title="item.id">{{ item.name }}</span>
              </div>

              <el-button
                text
                type="danger"
                size="small"
                class="!opacity-0 group-hover:!opacity-100 !p-1 !ml-1 flex-none"
                @click.stop="handleRemoveFavorite(item.id)"
              >
                <el-icon size="12">
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </template>

          <div v-else class="text-xs text-gray-400 py-2">
            {{ $t('device.control.file.manager.noFavorites') }}
          </div>
        </div>

        <el-divider class="!my-1" />

        <!-- Recent section -->
        <div class="px-3 pt-1 pb-2">
          <div class="text-xs font-medium text-gray-500 mb-2">
            {{ $t('device.control.file.manager.recentAccess') }}
          </div>

          <template v-if="recent.length > 0">
            <div
              v-for="item in displayRecent"
              :key="item.id"
              class="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              @click="handleSelect(item)"
            >
              <FileIcon
                :file="{ name: item.name, type: item.type }"
                size="lg"
                class="mr-2 flex-none"
              />
              <span class="truncate text-sm" :title="item.id">{{ item.name }}</span>
            </div>
          </template>
          <div v-else class="text-xs text-gray-400 py-2">
            {{ $t('device.control.file.manager.noRecentAccess') }}
          </div>

          <el-divider v-if="recent.length > 0" class="!my-1" />

          <div
            v-if="recent.length > 0"
            class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer text-center py-1"
            @click="handleClearRecent"
          >
            {{ $t('device.control.file.manager.clearRecent') }}
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown, Close } from '@element-plus/icons-vue'
import { DISPLAY_LIMIT } from '$/hooks/use-explorer/modules/use-quick-access.js'

const props = defineProps({
  favorites: {
    type: Array,
    default: () => [],
  },
  recent: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'remove-favorite', 'clear-recent'])

const displayFavorites = computed(() => props.favorites.slice(0, DISPLAY_LIMIT))
const displayRecent = computed(() => props.recent.slice(0, DISPLAY_LIMIT))

const dropdownRef = ref()

function handleSelect(item) {
  emit('select', item)
  dropdownRef.value?.handleClose()
}

function handleRemoveFavorite(id) {
  emit('remove-favorite', id)
}

function handleClearRecent() {
  emit('clear-recent')
}

function handleVisibleChange(visible) {
  // Placeholder for future batch stale-detection if needed
}
</script>

<style scoped>
.quick-access-dropdown {
  min-width: 240px;
  max-width: 320px;
}
</style>
