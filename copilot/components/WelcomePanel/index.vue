<template>
  <div class="welcome-panel flex flex-col items-center justify-center h-full">
    <!-- Logo 和品牌区域 -->
    <div class="welcome-brand mb-8 text-center">
      <div class="relative inline-block">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <el-icon :size="40" class="text-white">
            <Cpu />
          </el-icon>
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <el-icon :size="12" class="text-white">
            <Check />
          </el-icon>
        </div>
      </div>

      <h1 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('copilot.welcome.title') }}
      </h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {{ $t('copilot.welcome.description') }}
      </p>
    </div>

    <!-- 功能特性卡片 -->
    <div class="features-grid grid grid-cols-3 gap-4 w-full max-w-2xl mb-8">
      <div
        v-for="feature in features"
        :key="feature.key"
        class="feature-card p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-center hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-default"
      >
        <el-icon :size="24" class="text-primary-500 mb-2">
          <component :is="feature.icon" />
        </el-icon>
        <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ feature.label }}
        </p>
      </div>
    </div>

    <!-- 快捷指令区域 -->
    <div class="quick-prompts w-full max-w-2xl">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
        {{ $t('copilot.welcome.tryPrompts') }}
      </p>

      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="(prompt, index) in displayPrompts"
          :key="index"
          class="prompt-chip px-4 py-2 rounded-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-all hover:shadow-sm"
          @click="handlePromptClick(prompt)"
        >
          {{ prompt }}
        </button>
      </div>

      <div v-if="prompts.length > maxDisplayCount" class="mt-3 text-center">
        <el-button
          size="small"
          text
          type="primary"
          @click="emit('showPromptManager')"
        >
          {{ $t('copilot.morePrompts') }}
          <el-icon class="ml-1">
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="mt-8 text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500">
        <el-icon class="mr-1 align-middle">
          <InfoFilled />
        </el-icon>
        {{ $t('copilot.welcome.hint') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowRight,
  Check,
  Cpu,
  InfoFilled,
  Iphone,
  Lightning,
  Pointer,
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  prompts: {
    type: Array,
    default: () => [],
  },
  maxDisplayCount: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits(['selectPrompt', 'showPromptManager'])

const { t } = useI18n()

// 功能特性
const features = computed(() => [
  {
    key: 'smart',
    icon: Lightning,
    label: t('copilot.welcome.featureSmart'),
  },
  {
    key: 'control',
    icon: Pointer,
    label: t('copilot.welcome.featureControl'),
  },
  {
    key: 'device',
    icon: Iphone,
    label: t('copilot.welcome.featureDevice'),
  },
])

// 显示的快捷指令
const displayPrompts = computed(() => {
  return props.prompts.slice(0, props.maxDisplayCount)
})

// 处理快捷指令点击
function handlePromptClick(prompt) {
  emit('selectPrompt', prompt)
}
</script>

<style scoped>
.welcome-panel {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.prompt-chip {
  transition: all 0.2s ease;
}

.prompt-chip:hover {
  transform: translateY(-1px);
}
</style>
