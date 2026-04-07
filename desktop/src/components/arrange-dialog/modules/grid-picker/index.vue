<template>
  <el-popover
    v-model:visible="popoverVisible"
    placement="bottom-start"
    width="auto"
    trigger="click"
    popper-class="grid-picker-popper"
  >
    <template #reference>
      <slot>
        <el-button>
          <template #icon>
            <el-icon><Grid /></el-icon>
          </template>
          {{ $t('device.arrange.layout.auto') }}
          <el-icon class="el-icon--right">
            <el-icon-arrow-down />
          </el-icon>
        </el-button>
      </slot>
    </template>

    <div class="grid-picker" @mouseleave="onLeave">
      <div
        v-for="row in maxRows"
        :key="row"
        class="grid-picker__row"
      >
        <div
          v-for="col in maxCols"
          :key="col"
          class="grid-picker__cell"
          :class="{ 'grid-picker__cell--active': col <= hoverCol && row <= hoverRow }"
          @mouseenter="onEnter(col, row)"
          @click="onSelect(col, row)"
        />
      </div>

      <div class="grid-picker__label">
        {{ hoverCol > 0 ? `${hoverCol} × ${hoverRow}` : $t('device.arrange.grid.select') }}
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { Grid } from '@element-plus/icons-vue'

const props = defineProps({
  maxCols: {
    type: Number,
    default: 12,
  },
  maxRows: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits(['select'])

const popoverVisible = ref(false)
const hoverCol = ref(0)
const hoverRow = ref(0)

function onEnter(col, row) {
  hoverCol.value = col
  hoverRow.value = row
}

function onLeave() {
  hoverCol.value = 0
  hoverRow.value = 0
}

function onSelect(col, row) {
  emit('select', { cols: col, rows: row })
  popoverVisible.value = false
  hoverCol.value = 0
  hoverRow.value = 0
}
</script>

<style lang="postcss" scoped>
.grid-picker {
  padding: 4px;
  user-select: none;
}

.grid-picker__row {
  display: flex;
  gap: 3px;
  margin-bottom: 3px;

  &:last-child {
    margin-bottom: 0;
  }
}

.grid-picker__cell {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-light);
  transition:
    background 0.1s,
    border-color 0.1s;

  &:hover,
  &--active {
    background: var(--el-color-primary-light-5);
    border-color: var(--el-color-primary);
  }
}

.grid-picker__label {
  margin-top: 6px;
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-height: 18px;
  line-height: 18px;
}
</style>
