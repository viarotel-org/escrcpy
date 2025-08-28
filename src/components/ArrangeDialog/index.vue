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
      <!-- Control Panel -->
      <div class="control-panel flex-none mb-4 py-2 px-2">
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
      </div>

      <!-- Arrangement Area -->
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
            :min-width="100"
            :min-height="100"
            :parent="true"
            class="widget-window" :class="[`${widget.type}-widget`]"
            @dragging="(x, y) => onWidgetDragging(widget.id, { x, y })"
            @resizing="(x, y, w, h) => onWidgetResizing(widget.id, { x, y, width: w, height: h })"
            @drag-stop="(x, y) => onWidgetDragStop(widget.id, { x, y })"
            @resize-stop="(x, y, w, h) => onWidgetResizeStop(widget.id, { x, y, width: w, height: h })"
          >
            <div class="widget-content">
              <div class="widget-header flex w-full space-x-2">
                <div class="flex-none flex items-center">
                  <el-icon>
                    <ElIconSetting v-if="widget.type === 'global'" />
                    <ElIconMonitor v-else />
                  </el-icon>
                </div>

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
                  <p>{{ $t('device.arrange.widget.size') }}: {{ Math.round(widget.realWidth) }}×{{ Math.round(widget.realHeight) }}</p>
                  <p>{{ $t('device.arrange.widget.position') }}: {{ Math.round(widget.realX) }}, {{ Math.round(widget.realY) }}</p>
                </div>
              </div>
            </div>
          </VueDraggableResizable>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" @click="saveLayout">
        {{ $t('device.arrange.layout.save') }}
      </el-button>
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
const { loadLayout, createWidgetFromConfig } = useLayoutManagement(scaleConverter, arrangedWidgets, allDevices)

// Initialize widget management
const { addWidget, removeWidget, clearAllWidgets, getRemovedWidgets, clearRemovedWidgets } = useWidgetManagement(arrangedWidgets, allDevices, hasGlobalWidget, createWidgetFromConfig)

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

// 监听容器尺寸变化，重新计算 widgets 比例
watch(() => `${containerWidth.value}${containerHeight.value}`, () => {
  recalculateWidgetsScale()
}, { flush: 'post' })

// 重新计算所有 widgets 的比例
function recalculateWidgetsScale() {
  if (!arrangedWidgets.value.length) {
    return
  }

  arrangedWidgets.value.forEach((widget) => {
    // 使用 realX, realY, realWidth, realHeight 作为基准，重新计算容器坐标
    const containerRect = scaleConverter({
      x: widget.realX,
      y: widget.realY,
      width: widget.realWidth,
      height: widget.realHeight,
    })

    // 更新容器坐标
    widget.x = containerRect.x
    widget.y = containerRect.y
    widget.width = containerRect.width
    widget.height = containerRect.height
  })
}

// Expose public methods for parent components
defineExpose({
  open,
  close,
})
</script>

<style lang="postcss" scoped>
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

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
  font-size: 12px;
}

.remove-btn {
  width: 14px !important;
  height: 14px !important;
  padding: 0 !important;
  font-size: 10px;
  flex-shrink: 0 !important;
}

.widget-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-info {
  text-align: center;
  font-size: max(8px, 0.5vw);
  color: #666;
  line-height: 1.4;

  p {
    margin: 2px 0;
  }
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
