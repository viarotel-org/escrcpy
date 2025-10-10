<template>
  <div id="app" role="application" :aria-label="$t('app.title')">
    <!-- Screen reader announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="announcements"></div>
    
    <!-- Skip to main content link -->
    <a href="#main-content" class="skip-link sr-only-focusable">
      {{ $t('accessibility.skipToMain') }}
    </a>
    
    <el-config-provider :locale :size="getSize($grid)">
      <Layouts />
    </el-config-provider>
    
    <!-- Error boundary -->
    <div v-if="hasError" class="error-boundary" role="alert">
      <h2>{{ $t('error.boundary.title') }}</h2>
      <p>{{ $t('error.boundary.message') }}</p>
      <button @click="reloadApp" class="reload-button">
        {{ $t('error.boundary.reload') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { i18n } from '$/locales/index.js'
import localeModel from '$/plugins/element-plus/locale.js'
import { useErrorHandling } from '@/utils/error-handling.js'
import { useAccessibility } from '@/utils/accessibility.js'
import { usePerformance } from '@/utils/performance.js'

import Layouts from './layouts/index.vue'

// Initialize utilities
const { handleError, handleAsyncError } = useErrorHandling()
const { announce, announceError, announceSuccess } = useAccessibility()
const { startTimer, endTimer, startMemoryMonitoring } = usePerformance()

// Error boundary state
const hasError = ref(false)
const errorMessage = ref('')

// Performance monitoring
startTimer('app-initialization')
startMemoryMonitoring(30000) // Monitor memory every 30 seconds

// Enhanced error handling for IPC events
const handleIpcError = handleAsyncError(async (event, params) => {
  try {
    await startApp.open(params)
    announceSuccess('Application opened successfully')
  } catch (error) {
    announceError('Failed to open application')
    handleError(error, 'IPC execute-arguments-change', 'error')
  }
}, 'IPC execute-arguments-change')

const handleQuitError = handleAsyncError(async () => {
  try {
    ElLoading.service({
      lock: true,
      text: window.t('appClose.quit.loading'),
    })
    announce('Application is closing')
  } catch (error) {
    handleError(error, 'IPC quit-before', 'error')
  }
}, 'IPC quit-before')

// Set up IPC listeners with error handling
window.electron.ipcRenderer.on('quit-before', handleQuitError)
window.electron.ipcRenderer.on('execute-arguments-change', handleIpcError)

// Global error handler
const handleGlobalError = (error) => {
  hasError.value = true
  errorMessage.value = error.message
  announceError('Application error occurred')
  handleError(error, 'Global Error', 'critical')
}

// Set up global error handlers
window.addEventListener('error', (event) => {
  handleGlobalError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  handleGlobalError(event.reason)
})

const startApp = useStartApp()

onMounted(async () => {
  try {
    await startApp.open()
    endTimer('app-initialization')
    announceSuccess('Application started successfully')
  } catch (error) {
    handleGlobalError(error)
  }
})

const locale = computed(() => {
  const i18nLocale = i18n.global.locale.value
  const value = localeModel[i18nLocale]
  return value
})

// Enhanced showTips with error handling
const showTips = handleAsyncError(async () => {
  try {
    const { scrcpyPath } = window.electron?.configs || {}
    
    if (scrcpyPath) {
      return false
    }
    
    await ElMessageBox.alert(
      `<div>
        ${window.t('dependencies.lack.content', {
          name: '<a class="hover:underline text-primary-500" href="https://github.com/Genymobile/scrcpy" target="_blank" aria-label="Open scrcpy repository in new tab">scrcpy</a>',
        })}
      </div>`,
      window.t('dependencies.lack.title'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: window.t('common.ok'),
        type: 'warning',
      }
    )
    
    announce('Dependencies information displayed')
  } catch (error) {
    handleError(error, 'Show Tips', 'warning')
  }
}, 'Show Tips')

// Reload application
const reloadApp = () => {
  try {
    window.location.reload()
  } catch (error) {
    handleError(error, 'Reload App', 'error')
  }
}

function getSize(grid) {
  const value = ['sm', 'md'].includes(grid.breakpoint) ? 'small' : 'default'
  return value
}

// Initialize tips
showTips()

// Cleanup on unmount
onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('quit-before')
  window.electron.ipcRenderer.removeAllListeners('execute-arguments-change')
  window.removeEventListener('error', handleGlobalError)
  window.removeEventListener('unhandledrejection', handleGlobalError)
})
</script>

<style lang="postcss" scoped>
/* Accessibility styles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

/* Error boundary styles */
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  text-align: center;
}

.error-boundary h2 {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-boundary p {
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
}

.reload-button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reload-button:hover {
  background: #45b7b8;
}

.reload-button:focus {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .error-boundary {
    background: #000;
    border: 2px solid #fff;
  }
  
  .reload-button {
    background: #fff;
    color: #000;
    border: 2px solid #000;
  }
  
  .reload-button:hover {
    background: #ccc;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
  
  .reload-button {
    transition: none;
  }
}

/* Focus management */
#app:focus-within {
  outline: none;
}

/* Print styles */
@media print {
  .skip-link,
  .error-boundary {
    display: none;
  }
}
</style>
