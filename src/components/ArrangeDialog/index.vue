<template>
  <el-dialog
    v-model="visible"
    :title="$t('device.arrange.dialog.title')"
    width="95%"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    destroy-on-close
    append-to-body
    fullscreen
    class="el-dialog--beautify el-dialog--flex el-dialog--fullscreen"
    @closed="onClosed"
  >
    <div class="arrange-container overflow-hidden flex flex-col h-full">
      <div ref="arrangementAreaRef" class="arrangement-area flex-1 h-0 overflow-auto">
        <div
          ref="screenContainerRef"
          class="screen-container border border-primary-300 border border-dashed"
          :style="screenContainerStyle"
        >
          <VueDraggableResizable
            v-for="widget in arrangedWidgets"
            :key="widget.id"
            :x="widget.x"
            :y="widget.y"
            :w="widget.width"
            :h="widget.height"
            :min-width="containerWidth / 6"
            :min-height="containerHeight / 4"
            :parent="true"
            class="widget-window" :class="[`${widget.type}-widget`]"
            @dragging="(x, y) => onWidgetDragging(widget.id, { x, y })"
            @resizing="(x, y, w, h) => onWidgetResizing(widget.id, { x, y, width: w, height: h })"
            @drag-stop="(x, y) => onWidgetDragStop(widget.id, { x, y })"
            @resize-stop="(x, y, w, h) => onWidgetResizeStop(widget.id, { x, y, width: w, height: h })"
          >
            <div class="widget-content">
              <div class="widget-header flex w-full space-x-2">
                <div class="widget-name flex-1 w-0 truncate" :title="widget.name">
                  {{ widget.name }}
                </div>

                <div class="flex-none flex items-center">
                  <el-button
                    type="danger"
                    :icon="Close"
                    size="small"
                    circle
                    class="remove-btn"
                    @click="removeWidget(widget.id)"
                  />
                </div>
              </div>
              <div class="widget-body">
                <div class="widget-info">
                  <p>{{ Math.round(widget.realWidth) }} × {{ Math.round(widget.realHeight) }}</p>
                  <p>{{ Math.round(widget.realX) }}, {{ Math.round(widget.realY) }}</p>
                </div>
              </div>
            </div>
          </VueDraggableResizable>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="control-panel flex-none flex items-center space-x-2">
        <el-dropdown type="primary" @command="addWidget">
          <el-button type="primary">
            <template #icon>
              <el-icon><el-icon-plus /></el-icon>
            </template>
            {{ $t('device.arrange.widget.add') }}
            <el-icon class="el-icon--right">
              <el-icon-arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="global" :disabled="hasGlobalWidget">
                <el-icon><Setting /></el-icon>
                {{ $t('device.arrange.widget.global') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-for="device in availableDevices"
                :key="device.id"
                :command="device.id"
              >
                <el-icon><Monitor /></el-icon>
                {{ device.name || device.id }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button-group>
          <el-button :icon="Refresh" @click="resetLayout">
            {{ $t('device.arrange.layout.reset') }}
          </el-button>

          <el-button
            :icon="Delete"
            :disabled="arrangedWidgets.length === 0"
            @click="clearAllWidgets"
          >
            {{ $t('device.arrange.layout.clear') }}
          </el-button>
        </el-button-group>

        <el-button type="primary" class="!ml-auto" @click="saveLayout">
          {{ $t('device.arrange.layout.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Close, Delete, Monitor, Refresh, Setting } from '@element-plus/icons-vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'
import { useScaleScreen } from '$/hooks/useScaleScreen/index.js'
import {
  useDeviceManagement,
  useDialogManagement,
  useLayoutManagement,
  useSaveLayout,
  useWidgetEvents,
  useWidgetManagement,
} from './hooks/index.js'

/**
 * ArrangeDialog - Window arrangement dialog component
 */

// Dialog state
const visible = ref(false)
const arrangementAreaRef = ref(null)
const screenContainerRef = ref(null)

// Initialize scale screen hook
const {
  scaleConverter,
  containerWidth,
  containerHeight,
} = useScaleScreen({
  containerRef: arrangementAreaRef,
})

// State management
const arrangedWidgets = ref([])

// Initialize device management
const { allDevices, loadDevices } = useDeviceManagement()

// Computed properties
const hasGlobalWidget = computed(() => {
  return arrangedWidgets.value.some(w => w.type === 'global')
})

const availableDevices = computed(() => {
  const arrangedDeviceIds = arrangedWidgets.value
    .filter(w => w.type === 'device')
    .map(w => w.deviceId)

  return allDevices.value.filter(d => !arrangedDeviceIds.includes(d.id))
})

const screenContainerStyle = computed(() => {
  return {
    width: `${containerWidth.value}px`,
    height: `${containerHeight.value}px`,
  }
})

// Initialize layout management
const { loadLayout, updateLayout, createWidgetFromConfig } = useLayoutManagement(
  scaleConverter,
  arrangedWidgets,
  allDevices,
)

// Initialize widget management
const { addWidget, removeWidget, clearAllWidgets, getRemovedWidgets, clearRemovedWidgets } = useWidgetManagement(
  arrangedWidgets,
  allDevices,
  hasGlobalWidget,
  createWidgetFromConfig,
  containerWidth,
  containerHeight,
)

const resetLayout = () => {
  arrangedWidgets.value = []
  loadLayout()
}

// Initialize widget events
const {
  onWidgetDragging,
  onWidgetResizing,
  onWidgetDragStop,
  onWidgetResizeStop,
} = useWidgetEvents(scaleConverter, arrangedWidgets)

// Initialize dialog management
const { open, close, onClosed } = useDialogManagement(visible, arrangedWidgets, loadDevices, loadLayout)

// Initialize save layout
const { saveLayout } = useSaveLayout(arrangedWidgets, close, getRemovedWidgets, clearRemovedWidgets)

watch(() => `${containerWidth.value}${containerHeight.value}`, () => {
  updateLayout()
}, { flush: 'post' })

// Expose public methods for parent components
defineExpose({
  open,
  close,
})
</script>

<style lang="postcss" scoped>
.arrangement-area {
  display: flex;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
}

.screen-container {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.widget-window {
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &.global-widget {
    border-color: #409eff;

    &:hover {
      border-color: #66b1ff;
    }
  }

  &.device-widget {
    border-color: #67c23a;

    &:hover {
      border-color: #85ce61;
    }
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.widget-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.widget-header {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.widget-name {
  font-weight: 500;
  color: #333;
  font-size: 10px;
}

.remove-btn {
  width: 14px !important;
  height: 14px !important;
  font-size: 10px;
}

.widget-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-info {
  text-align: center;
  font-size: 10px;
  color: #666;
}

/* Custom drag handle styles */
:deep(.handle) {
  background: #409eff !important;
  border: 2px solid white !important;
  border-radius: 50%;
  width: 12px !important;
  height: 12px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: #66b1ff !important;
    transform: scale(1.1);
  }
}
</style>
