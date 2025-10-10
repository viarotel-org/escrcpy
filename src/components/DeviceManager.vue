<template>
  <div class="device-manager" role="main" aria-labelledby="device-manager-title">
    <!-- Screen reader only title -->
    <h1 id="device-manager-title" class="sr-only">
      {{ $t('device.manager.title') }}
    </h1>
    
    <!-- Device list header -->
    <div class="device-header" role="banner">
      <h2 class="device-title">
        {{ $t('device.manager.devices') }}
      </h2>
      
      <div class="device-actions" role="toolbar" aria-label="Device actions">
        <el-button
          type="primary"
          :icon="Refresh"
          @click="refreshDevices"
          :loading="isRefreshing"
          :aria-label="$t('device.actions.refresh')"
          :title="$t('device.actions.refresh')"
        >
          {{ $t('device.actions.refresh') }}
        </el-button>
        
        <el-button
          type="success"
          :icon="Plus"
          @click="addDevice"
          :aria-label="$t('device.actions.add')"
          :title="$t('device.actions.add')"
        >
          {{ $t('device.actions.add') }}
        </el-button>
      </div>
    </div>
    
    <!-- Device list -->
    <div class="device-list" role="list" aria-label="Connected Android devices">
      <div
        v-for="(device, index) in devices"
        :key="device.id"
        class="device-item"
        role="listitem"
        :aria-label="`Device ${index + 1}: ${device.name || device.id}`"
        :class="{ 'device-item--connected': device.connected }"
      >
        <!-- Device info -->
        <div class="device-info">
          <div class="device-icon" :aria-hidden="true">
            <el-icon :size="24">
              <Phone />
            </el-icon>
          </div>
          
          <div class="device-details">
            <h3 class="device-name">
              {{ device.name || device.id }}
            </h3>
            <p class="device-id" :aria-label="$t('device.info.id')">
              {{ $t('device.info.id') }}: {{ device.id }}
            </p>
            <p class="device-status" :aria-label="$t('device.info.status')">
              {{ $t('device.info.status') }}: 
              <span :class="device.connected ? 'status-connected' : 'status-disconnected'">
                {{ device.connected ? $t('device.status.connected') : $t('device.status.disconnected') }}
              </span>
            </p>
          </div>
        </div>
        
        <!-- Device actions -->
        <div class="device-item-actions" role="group" :aria-label="`Actions for device ${device.name || device.id}`">
          <el-button
            v-if="!device.connected"
            type="primary"
            :icon="Connection"
            @click="connectDevice(device)"
            :loading="device.connecting"
            :aria-label="$t('device.actions.connect', { device: device.name || device.id })"
            :title="$t('device.actions.connect', { device: device.name || device.id })"
          >
            {{ $t('device.actions.connect') }}
          </el-button>
          
          <el-button
            v-else
            type="danger"
            :icon="Disconnect"
            @click="disconnectDevice(device)"
            :loading="device.disconnecting"
            :aria-label="$t('device.actions.disconnect', { device: device.name || device.id })"
            :title="$t('device.actions.disconnect', { device: device.name || device.id })"
          >
            {{ $t('device.actions.disconnect') }}
          </el-button>
          
          <el-button
            type="info"
            :icon="Setting"
            @click="configureDevice(device)"
            :aria-label="$t('device.actions.configure', { device: device.name || device.id })"
            :title="$t('device.actions.configure', { device: device.name || device.id })"
          >
            {{ $t('device.actions.configure') }}
          </el-button>
          
          <el-button
            type="warning"
            :icon="Delete"
            @click="removeDevice(device)"
            :aria-label="$t('device.actions.remove', { device: device.name || device.id })"
            :title="$t('device.actions.remove', { device: device.name || device.id })"
          >
            {{ $t('device.actions.remove') }}
          </el-button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-if="devices.length === 0" class="device-empty" role="status" aria-live="polite">
        <el-empty
          :description="$t('device.empty.description')"
          :image-size="120"
        >
          <el-button type="primary" @click="refreshDevices">
            {{ $t('device.empty.refresh') }}
          </el-button>
        </el-empty>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="device-loading" role="status" aria-live="polite">
      <el-loading
        :loading="true"
        :text="$t('device.loading')"
        background="rgba(0, 0, 0, 0.7)"
      />
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="device-error" role="alert" aria-live="assertive">
      <el-alert
        :title="$t('device.error.title')"
        :description="error"
        type="error"
        :closable="true"
        @close="clearError"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElButton, ElIcon, ElEmpty, ElLoading, ElAlert } from 'element-plus'
import { Refresh, Plus, Phone, Connection, Disconnect, Setting, Delete } from '@element-plus/icons-vue'
import { useErrorHandling } from '@/utils/error-handling.js'
import { useAccessibility } from '@/utils/accessibility.js'
import { usePerformance } from '@/utils/performance.js'

// Initialize utilities
const { handleError, handleAsyncError, retryAsync } = useErrorHandling()
const { announce, announceError, announceSuccess, handleKeyboardNavigation } = useAccessibility()
const { startTimer, endTimer, debounce } = usePerformance()

// Reactive state
const devices = ref([])
const isLoading = ref(false)
const isRefreshing = ref(false)
const error = ref(null)
const selectedDeviceIndex = ref(-1)

// Debounced refresh function
const debouncedRefresh = debounce(async () => {
  await refreshDevices()
}, 1000)

// Device management functions
const refreshDevices = handleAsyncError(async () => {
  try {
    isRefreshing.value = true
    startTimer('device-refresh')
    
    // Simulate device refresh (replace with actual implementation)
    const newDevices = await window.electron?.deviceManager?.getDevices() || []
    
    devices.value = newDevices.map(device => ({
      ...device,
      connecting: false,
      disconnecting: false,
    }))
    
    endTimer('device-refresh')
    announceSuccess(`Found ${devices.value.length} devices`)
    
  } catch (err) {
    announceError('Failed to refresh devices')
    handleError(err, 'Device Refresh', 'error')
    error.value = err.message
  } finally {
    isRefreshing.value = false
  }
}, 'Device Refresh')

const connectDevice = handleAsyncError(async (device) => {
  try {
    device.connecting = true
    startTimer(`device-connect-${device.id}`)
    
    // Simulate device connection (replace with actual implementation)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    device.connected = true
    endTimer(`device-connect-${device.id}`)
    announceSuccess(`Connected to device ${device.name || device.id}`)
    
  } catch (err) {
    announceError(`Failed to connect to device ${device.name || device.id}`)
    handleError(err, 'Device Connection', 'error')
  } finally {
    device.connecting = false
  }
}, 'Device Connection')

const disconnectDevice = handleAsyncError(async (device) => {
  try {
    device.disconnecting = true
    startTimer(`device-disconnect-${device.id}`)
    
    // Simulate device disconnection (replace with actual implementation)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    device.connected = false
    endTimer(`device-disconnect-${device.id}`)
    announceSuccess(`Disconnected from device ${device.name || device.id}`)
    
  } catch (err) {
    announceError(`Failed to disconnect from device ${device.name || device.id}`)
    handleError(err, 'Device Disconnection', 'error')
  } finally {
    device.disconnecting = false
  }
}, 'Device Disconnection')

const addDevice = handleAsyncError(async () => {
  try {
    // Simulate adding a new device (replace with actual implementation)
    const newDevice = {
      id: `device-${Date.now()}`,
      name: `Device ${devices.value.length + 1}`,
      connected: false,
      connecting: false,
      disconnecting: false,
    }
    
    devices.value.push(newDevice)
    announceSuccess(`Added new device ${newDevice.name}`)
    
  } catch (err) {
    announceError('Failed to add new device')
    handleError(err, 'Add Device', 'error')
  }
}, 'Add Device')

const configureDevice = handleAsyncError(async (device) => {
  try {
    // Simulate device configuration (replace with actual implementation)
    announce(`Opening configuration for device ${device.name || device.id}`)
    
  } catch (err) {
    announceError(`Failed to configure device ${device.name || device.id}`)
    handleError(err, 'Device Configuration', 'error')
  }
}, 'Device Configuration')

const removeDevice = handleAsyncError(async (device) => {
  try {
    // Simulate device removal (replace with actual implementation)
    const index = devices.value.findIndex(d => d.id === device.id)
    if (index > -1) {
      devices.value.splice(index, 1)
      announceSuccess(`Removed device ${device.name || device.id}`)
    }
    
  } catch (err) {
    announceError(`Failed to remove device ${device.name || device.id}`)
    handleError(err, 'Remove Device', 'error')
  }
}, 'Remove Device')

const clearError = () => {
  error.value = null
}

// Keyboard navigation
const handleKeyDown = (event) => {
  if (devices.value.length === 0) return
  
  const newIndex = handleKeyboardNavigation(event, devices.value, selectedDeviceIndex.value)
  if (newIndex !== selectedDeviceIndex.value) {
    selectedDeviceIndex.value = newIndex
    // Focus the device item
    const deviceElement = document.querySelector(`[data-device-index="${newIndex}"]`)
    if (deviceElement) {
      deviceElement.focus()
    }
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    isLoading.value = true
    await refreshDevices()
  } catch (err) {
    handleError(err, 'Device Manager Initialization', 'error')
  } finally {
    isLoading.value = false
  }
  
  // Set up keyboard navigation
  document.addEventListener('keydown', handleKeyDown)
  
  // Set up periodic refresh
  const refreshInterval = setInterval(debouncedRefresh, 30000) // Refresh every 30 seconds
  
  // Store interval for cleanup
  onUnmounted(() => {
    clearInterval(refreshInterval)
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style lang="postcss" scoped>
.device-manager {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--el-border-color);
}

.device-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.device-actions {
  display: flex;
  gap: 0.5rem;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.device-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.device-item:focus {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

.device-item--connected {
  border-color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.device-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.device-icon {
  color: var(--el-color-primary);
}

.device-details {
  flex: 1;
}

.device-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--el-text-color-primary);
}

.device-id,
.device-status {
  font-size: 0.9rem;
  margin: 0.25rem 0;
  color: var(--el-text-color-regular);
}

.status-connected {
  color: var(--el-color-success);
  font-weight: 600;
}

.status-disconnected {
  color: var(--el-color-warning);
  font-weight: 600;
}

.device-item-actions {
  display: flex;
  gap: 0.5rem;
}

.device-empty {
  text-align: center;
  padding: 3rem 1rem;
}

.device-loading {
  position: relative;
  min-height: 200px;
}

.device-error {
  margin-bottom: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .device-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .device-actions {
    justify-content: center;
  }
  
  .device-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .device-item-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .device-item {
    border-width: 2px;
  }
  
  .device-item--connected {
    border-width: 3px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .device-item {
    transition: none;
  }
}
</style>
