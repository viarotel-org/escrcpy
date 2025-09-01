<template>
  <el-select
    :placeholder="$t('preferences.scope.placeholder')"
    :no-data-text="$t('common.empty')"
    filterable
    class="!w-72"
  >
    <template #prefix>
      <el-tooltip class="" effect="dark" placement="bottom-start">
        <el-icon class="text-primary-300 hover:text-primary-500">
          <QuestionFilled />
        </el-icon>
        <template #content>
          <div class="space-y-1">
            <div class="pb-1">
              {{ $t('preferences.scope.details[0]') }}
            </div>
            <div class="">
              {{ $t('preferences.scope.details[1]') }}
            </div>
            <div class="">
              {{ $t('preferences.scope.details[2]') }}
            </div>
          </div>
        </template>
      </el-tooltip>
    </template>
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script setup>
const emit = defineEmits(['device-change'])

const deviceStore = useDeviceStore()

const options = computed(() => {
  const value = deviceStore.list.map(item => ({
    ...item,
    label: `${item.id}（${item.name}${
      item.remark ? `，${item.remark}` : ''
    }）`,
    value: item.id,
  }))

  value.unshift({
    label: `Global（${window.t('preferences.scope.global')}）`,
    value: 'global',
  })

  return value
})

watch(
  () => deviceStore.list.length,
  () => {
    emit('device-change', options.value)
  },
)
</script>

<style></style>
