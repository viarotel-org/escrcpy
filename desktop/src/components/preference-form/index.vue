<template>
  <div
    class="flex  h-full"
    :class="[
      reverse ? 'flex-col-reverse' : 'flex-col',
    ]"
  >
    <div class="flex-1 min-h-0 overflow-auto pr-2 relative">
      <el-form ref="elForm" :model="preferenceData" :label-width="$grid.lg ? '240px' : '140px'" class="">
        <el-collapse
          v-model="collapseValue"
          v-bind="{
            accordion: false,
            ...collapseProps,
          }"
          class="space-y-4 el-collapse--beautify"
        >
          <el-collapse-item
            v-for="(item, name) of preferenceModel"
            :key="name"
            :name="name"
            class="overflow-hidden"
          >
            <template #title>
              <div
                :id="`preference-${name}`"
                v-intersection-observer="[onIntersectionObserver, { rootMargin: '0px 0px 0px 0px', threshold: 1 }]"
                class="flex items-center w-full text-left -mr-10 overflow-hidden"
              >
                <div class="flex-1 w-0 truncate pl-4 text-base">
                  {{ $t(item.label) }}
                </div>
                <div class="flex-none pl-4" @click.stop>
                  <el-button type="primary" text @click="handleReset(name)">
                    {{ $t('preferences.reset') }}
                  </el-button>
                </div>
              </div>
            </template>
            <div class="pr-8 pt-4">
              <el-row :gutter="20">
                <el-col
                  v-for="(item_1, name_1) of subModel(item)"
                  :key="name_1"
                  :span="item_1.span || 12"
                  :lg="item_1.span || 8"
                  :offset="item_1.offset || 0"
                >
                  <el-form-item :label="$t(item_1.label)" :prop="item_1.field">
                    <template #label>
                      <div class="flex items-center">
                        <el-tooltip
                          v-if="item_1.tips"
                          popper-class="max-w-96"
                          effect="light"
                          :content="$t(item_1.tips)"
                          placement="bottom"
                        >
                          <el-link
                            class="mr-1 !text-base"
                            icon="InfoFilled"
                            type="warning"
                            underline="never"
                          >
                          </el-link>
                        </el-tooltip>
                        <div class="truncate max-w-[100px] lg:max-w-[200px]" :title="$t(item_1.label)">
                          {{ $t(item_1.label) }}
                        </div>
                      </div>
                    </template>

                    <component
                      :is="inputModel[item_1.type]"
                      v-model="preferenceData[item_1.field]"
                      v-bind="{
                        preferenceData,
                        deviceScope,
                        title: $t(item_1.placeholder),
                        placeholder: $t(item_1.placeholder),
                        data: item_1,
                      }"
                    ></component>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>

    <div class="flex-none flex justify-center py-2">
      <el-segmented v-model="activeTab" class="el-segmented--child" :options="tabsModel" @change="onTabChange">
        <template #default="{ item }">
          <div class="text-sm lg:text-base">
            {{ $t(item.label) }}
          </div>
        </template>
      </el-segmented>
    </div>
  </div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components'

import { omit } from 'lodash-es'

import { inputModel } from './components/index.js'

const props = defineProps({
  deviceScope: {
    type: String,
    default: '',
  },
  collapseProps: {
    type: Object,
    default: () => ({}),
  },
  excludes: {
    type: Array,
    default: () => [],
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})

const preferenceData = defineModel('modelValue', {
  type: Object,
  default: () => ({}),
})

const preferenceStore = usePreferenceStore()

const activeTab = ref('common')

const tabsModel = computed(() => {
  const value = Object.entries(preferenceStore.model).map(([key, item]) => {
    return {
      label: item.label,
      value: key,
    }
  })

  return value
})

const collapseValue = ref([])

const preferenceModel = computed(() =>
  omit(preferenceStore.model, props.excludes),
)

const preferenceModelKeys = Object.keys(preferenceModel.value ?? {})

if (preferenceModelKeys.length) {
  collapseValue.value = preferenceModelKeys
}

function onTabChange(val) {
  document.querySelector(`#preference-${val}`).scrollIntoView({
    block: 'start',
  })
}

function subModel(item) {
  const children = item?.children || {}

  const value = {}

  Object.entries(children).forEach(([key, data]) => {
    if (!data.hidden) {
      value[key] = data
    }
  })

  return value
}

function handleReset(type) {
  preferenceData.value = {
    ...preferenceData.value,
    ...preferenceStore.getDefaultData(type),
  }
}

async function generateCommand() {
  const value = await preferenceStore.scrcpyParameter(preferenceData.value, {
    isRecord: true,
    isCamera: true,
    isOtg: true,
  })

  return value
}

function onIntersectionObserver([entry]) {
  if (!entry.isIntersecting) {
    return false
  }

  const currentId = entry.target.id.replace('preference-', '')

  activeTab.value = currentId
}

defineExpose({
  generateCommand,
})
</script>

<style scoped lang="postcss">
:deep(.el-collapse-item__header) {
  @apply h-10 leading-10 md:h-12 md:leading-12;
}

:deep(.el-collapse-item__arrow) {
  @apply w-2em;
}
</style>
