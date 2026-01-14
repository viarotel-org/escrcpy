<template>
  <div class="welcome-panel flex flex-col items-center justify-center h-full">
    <div class="welcome-brand mb-8 text-center">
      <div class="relative inline-block">
        <div class="w-20 h-20 flex items-center justify-center">
          <img src="$electron/resources/build/logo.png" alt="" class="w-full h-full drop-shadow drop-shadow-color-gray-300">
        </div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <i class="i-carbon-chat-bot text-white"></i>
        </div>
      </div>

      <div class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('copilot.welcome.title', { name: 'Escrcpy Copilot' }) }}
      </div>
      <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md space-y-2">
        <div class="">
          <a href="https://github.com/FliPPeDround/autoglm.js" class="hover:underline hover:text-primary-500" target="_blank">
            {{ $t('copilot.welcome.poweredBy', { name: 'Autoglm.js' }) }}
          </a>
        </div>

        <div class="">
          {{ $t('copilot.welcome.description') }}
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
const props = defineProps({
})

const emit = defineEmits([])

// Feature highlights
const features = computed(() => [
  {
    key: 'smart',
    icon: 'Lightning',
    label: window.t('copilot.welcome.featureSmart'),
  },
  {
    key: 'control',
    icon: 'Pointer',
    label: window.t('copilot.welcome.featureControl'),
  },
  {
    key: 'device',
    icon: 'Iphone',
    label: window.t('copilot.welcome.featureDevice'),
  },
])
</script>

<style lang="postcss" scoped>
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
