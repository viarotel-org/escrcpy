<template>
  <el-popover
    v-model:visible="popoverVisible"
    placement="bottom"
    :width="240"
    trigger="click"
  >
    <template #reference>
      <div class="hover:underline hover:text-primary-500 cursor-pointer text-center absolute inset-center whitespace-nowrap text-[10px]">
        <div class="">
          {{ Math.round(widget.realWidth) }} × {{ Math.round(widget.realHeight) }}
        </div>
        <div class="">
          {{ Math.round(widget.realX) }}, {{ Math.round(widget.realY) }}
        </div>
      </div>
    </template>

    <el-form :model="formData">
      <el-form-item class="">
        <div class="flex items-center gap-2">
          <el-input-number
            v-model="formData.realWidth"
            :min="minWidth"
            :step="1"
            :controls="false"
            class="!w-full"
          >
            <template #prefix>
              <span>W</span>
            </template>
          </el-input-number>

          <el-input-number
            v-model="formData.realHeight"
            :min="minHeight"
            :step="1"
            :controls="false"
            class="!w-full"
          >
            <template #prefix>
              <span>H</span>
            </template>
          </el-input-number>
        </div>
      </el-form-item>

      <el-form-item class="">
        <div class="flex items-center gap-2">
          <el-input-number
            v-model="formData.realX"
            :min="0"
            :step="1"
            :controls="false"
            class="!w-full"
          >
            <template #prefix>
              <span>X</span>
            </template>
          </el-input-number>

          <el-input-number
            v-model="formData.realY"
            :min="0"
            :step="1"
            :controls="false"
            class="!w-full"
          >
            <template #prefix>
              <span>Y</span>
            </template>
          </el-input-number>
        </div>
      </el-form-item>

      <div class="flex justify-center">
        <el-button @click="handleCancel">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-form>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  widget: {
    type: Object,
    required: true,
  },
  scaleConverter: {
    type: Function,
    required: true,
  },
  arrangedWidgets: {
    type: Array,
    default: () => [],
  },
  minWidth: {
    type: Number,
    default: 0,
  },
  minHeight: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:position'])

const popoverVisible = ref(false)

const formData = reactive({
  realX: 0,
  realY: 0,
  realWidth: 0,
  realHeight: 0,
})

watch(() => popoverVisible.value, (val) => {
  if (!val) {
    return false
  }

  formData.realX = Math.round(props.widget.realX)
  formData.realY = Math.round(props.widget.realY)
  formData.realWidth = Math.round(props.widget.realWidth)
  formData.realHeight = Math.round(props.widget.realHeight)
}, { immediate: true })

function handleConfirm() {
  handleUpdatePosition({
    realX: formData.realX,
    realY: formData.realY,
    realWidth: formData.realWidth,
    realHeight: formData.realHeight,
  })
  popoverVisible.value = false
}

function handleCancel() {
  formData.realX = Math.round(props.widget.realX)
  formData.realY = Math.round(props.widget.realY)
  formData.realWidth = Math.round(props.widget.realWidth)
  formData.realHeight = Math.round(props.widget.realHeight)
  popoverVisible.value = false
}

function handleUpdatePosition({ realX, realY, realWidth, realHeight }) {
  const widget = props.widget

  if (!widget) {
    return
  }

  widget.realX = realX
  widget.realY = realY
  widget.realWidth = realWidth
  widget.realHeight = realHeight

  const containerPos = props.scaleConverter({
    x: realX,
    y: realY,
    width: realWidth,
    height: realHeight,
  }, false)

  widget.x = containerPos.x
  widget.y = containerPos.y
  widget.width = containerPos.width
  widget.height = containerPos.height
}
</script>

<style lang="postcss" scoped>

</style>
