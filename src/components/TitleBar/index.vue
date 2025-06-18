<template>
  <div 
    class="titlebar"
    :class="{ 'titlebar-focused': isFocused, 'titlebar-darwin': isDarwin }"
  >
    <!-- Left section with app icon and menu -->
    <div class="titlebar-section titlebar-drag">
      <div class="titlebar-icon">
        <img :src="appIcon" alt="escrcpy" class="w-4 h-4" />
      </div>
      <div v-if="!isDarwin" class="titlebar-app-name">escrcpy</div>
    </div>
    
    <!-- Middle section (draggable area) -->
    <div class="titlebar-section titlebar-drag flex-1"></div>
    
    <!-- Right section with window controls -->
    <div class="titlebar-section titlebar-controls">
      <!-- Window controls for Windows/Linux -->
      <template v-if="!isDarwin">
        <button 
          class="titlebar-button titlebar-button-minimize" 
          @click="minimizeWindow"
          title="Minimize"
        >
          <el-icon><i-minimize /></el-icon>
        </button>
        <button 
          class="titlebar-button titlebar-button-maximize" 
          @click="toggleMaximize"
          title="Maximize"
        >
          <el-icon v-if="!isMaximized"><i-maximize /></el-icon>
          <el-icon v-else><i-restore /></el-icon>
        </button>
        <button 
          class="titlebar-button titlebar-button-close" 
          @click="closeWindow"
          title="Close"
        >
          <el-icon><i-close /></el-icon>
        </button>
      </template>
      
      <!-- Window controls for macOS -->
      <template v-else>
        <button 
          class="titlebar-button titlebar-button-close mac" 
          @click="closeWindow"
          title="Close"
        ></button>
        <button 
          class="titlebar-button titlebar-button-minimize mac" 
          @click="minimizeWindow"
          title="Minimize"
        ></button>
        <button 
          class="titlebar-button titlebar-button-maximize mac" 
          @click="toggleMaximize"
          title="Zoom"
        ></button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Platform detection
const isDarwin = computed(() => {
  return process.platform === 'darwin';
});

// Window state tracking
const isFocused = ref(true);
const isMaximized = ref(false);

// App icon path (to be replaced with actual app icon path)
const appIcon = computed(() => {
  return '/logo.ico';
});

// Window control methods
const minimizeWindow = () => {
  window.electron.ipcRenderer.invoke('window:minimize');
};

const toggleMaximize = () => {
  window.electron.ipcRenderer.invoke('window:toggle-maximize');
};

const closeWindow = () => {
  window.electron.ipcRenderer.invoke('window:close');
};

// Event listeners for window state changes
onMounted(() => {
  window.electron.ipcRenderer.on('window:focus-change', (_, focused) => {
    isFocused.value = focused;
  });
  
  window.electron.ipcRenderer.on('window:maximize-change', (_, maximized) => {
    isMaximized.value = maximized;
  });
  
  // Get initial window state
  window.electron.ipcRenderer.invoke('window:is-maximized').then(maximized => {
    isMaximized.value = maximized;
  });
});

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('window:focus-change');
  window.electron.ipcRenderer.removeAllListeners('window:maximize-change');
});
</script>

<style lang="postcss" scoped>
.titlebar {
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-light);
  user-select: none;
}

.titlebar-darwin {
  height: 28px;
  padding-left: 80px; /* Space for macOS traffic lights */
}

.titlebar-section {
  display: flex;
  align-items: center;
}

.titlebar-drag {
  -webkit-app-region: drag;
}

.titlebar-icon {
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.titlebar-app-name {
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
}

.titlebar-controls {
  display: flex;
  -webkit-app-region: no-drag;
}

.titlebar-button {
  height: 32px;
  width: 46px;
  border: none;
  background: transparent;
  outline: none;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.titlebar-button:hover {
  background-color: var(--el-fill-color-light);
}

.titlebar-button-close:hover {
  background-color: #e81123;
  color: white;
}

/* macOS specific styles */
.titlebar-button.mac {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin: 0 4px;
  position: absolute;
}

.titlebar-button-close.mac {
  background-color: #ff5f57;
  left: 12px;
}

.titlebar-button-minimize.mac {
  background-color: #ffbd2e;
  left: 32px;
}

.titlebar-button-maximize.mac {
  background-color: #28c941;
  left: 52px;
}

.titlebar-button.mac:hover {
  filter: brightness(90%);
}

/* Light/dark mode adaptations */
:deep(.dark) .titlebar {
  background-color: var(--el-bg-color-overlay);
  border-color: var(--el-border-color-darker);
}

/* Focus/unfocus styling */
.titlebar:not(.titlebar-focused) {
  opacity: 0.9;
}
</style>
