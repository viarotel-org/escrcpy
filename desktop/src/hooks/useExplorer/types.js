/**
 * @fileoverview ADB file manager type definitions
 * Provides full JSDoc type support
 */

/**
 * File/Directory entry type
 * @typedef {'file' | 'directory'} FileEntryType
 */

/**
 * File entry information
 * @typedef {Object} FileEntry
 * @property {string} id - Full path (unique identifier)
 * @property {string} name - File or directory name
 * @property {FileEntryType} type - Type
 * @property {string} size - Formatted size
 * @property {number} rawSize - Raw byte size
 * @property {string} updateTime - Formatted update time
 * @property {Date} mtime - Raw modification time
 */

/**
 * Breadcrumb item
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Display label
 * @property {string} value - Path value
 * @property {string} [icon] - Optional icon
 * @property {string} [i18nKey] - I18n key
 */

/**
 * Path manager configuration
 * @typedef {Object} PathManagerOptions
 * @property {string} [initialPath='/sdcard'] - Initial path
 * @property {number} [historyLimit=50] - Maximum history entries
 * @property {Object.<string, BreadcrumbPreset>} [presets] - Preset path mappings
 */

/**
 * Breadcrumb preset
 * @typedef {Object} BreadcrumbPreset
 * @property {string} icon - Icon
 * @property {string} label - Label (supports i18n key)
 * @property {string} value - Path value
 */

/**
 * Operation status
 * @typedef {'idle' | 'loading' | 'success' | 'error' | 'cancelled'} OperationStatus
 */

/**
 * Generic operation result
 * @typedef {Object} OperationResult
 * @property {boolean} success - Whether the operation succeeded
 * @property {string} [error] - Error message
 * @property {*} [data] - Returned data
 */

/**
 * Progress information
 * @typedef {Object} ProgressInfo
 * @property {number} percent - Percentage (0-100)
 * @property {number} completed - Completed count
 * @property {number} total - Total count
 * @property {number} [bytes] - Transferred bytes
 * @property {number} [totalBytes] - Total bytes
 * @property {number} [elapsed] - Elapsed time (ms)
 * @property {string} [currentFile] - Currently processed file
 */

/**
 * Download options
 * @typedef {Object} DownloadOptions
 * @property {string} savePath - Local save path
 * @property {boolean} [preserveStructure=true] - Preserve directory structure
 * @property {number} [retries=3] - Retry count
 * @property {Function} [onProgress] - Progress callback
 * @property {Function} [onError] - Error callback
 * @property {Function} [onComplete] - Completion callback
 */

/**
 * Upload options
 * @typedef {Object} UploadOptions
 * @property {string} remotePath - Remote save path
 * @property {number} [retries=3] - Retry count
 * @property {Function} [filter] - File filter
 * @property {Function} [onProgress] - Progress callback
 * @property {Function} [onError] - Error callback
 * @property {Function} [onComplete] - Completion callback
 */

/**
 * File operation type
 * @typedef {'copy' | 'move' | 'rename' | 'delete' | 'create'} FileOperationType
 */

/**
 * File operation task
 * @typedef {Object} FileOperationTask
 * @property {string} id - Task ID
 * @property {FileOperationType} type - Operation type
 * @property {string} sourcePath - Source path
 * @property {string} [targetPath] - Target path
 * @property {OperationStatus} status - Status
 * @property {ProgressInfo} [progress] - Progress
 * @property {string} [error] - Error message
 */

/**
 * Device information
 * @typedef {Object} DeviceInfo
 * @property {string} id - Device ID
 * @property {string} [name] - Device name
 * @property {string} [model] - Device model
 */

/**
 * Explorer options
 * @typedef {Object} ExplorerOptions
 * @property {DeviceInfo} device - Device information
 * @property {PathManagerOptions} [pathOptions] - Path manager options
 * @property {boolean} [autoRefresh=false] - Auto refresh
 * @property {number} [refreshInterval=5000] - Auto refresh interval
 */

/**
 * Selection state
 * @typedef {Object} SelectionState
 * @property {FileEntry[]} items - Selected items
 * @property {boolean} hasFiles - Contains files
 * @property {boolean} hasDirectories - Contains directories
 * @property {number} count - Selection count
 * @property {boolean} isEmpty - Is empty
 * @property {FileEntry[]} files - Selected files
 * @property {FileEntry[]} directories - Selected directories
 */

/**
 * Explorer status summary
 * @typedef {Object} ExplorerStatus
 * @property {DeviceInfo|null} device - Current device
 * @property {string} path - Current path
 * @property {number} filesCount - Number of files
 * @property {number} selectedCount - Number selected
 * @property {boolean} isLoading - Is loading
 * @property {boolean} isUploading - Is uploading
 * @property {boolean} isDownloading - Is downloading
 * @property {boolean} hasError - Has error
 */

/**
 * Download status summary
 * @typedef {Object} DownloadStatusSummary
 * @property {boolean} isActive - Is active
 * @property {boolean} isScanning - Is scanning
 * @property {boolean} isDownloading - Is downloading
 * @property {boolean} hasError - Has error
 * @property {ProgressInfo|null} progress - Progress information
 * @property {Object|null} result - Result information
 */

/**
 * Download result
 * @typedef {Object} DownloadResult
 * @property {boolean} success - Whether succeeded
 * @property {string} [error] - Error message
 * @property {boolean} cancelled - Whether cancelled
 * @property {Object} stats - Statistics
 * @property {number} stats.totalFiles - Total files
 * @property {number} stats.completedFiles - Completed files
 * @property {number} stats.failedFiles - Failed files
 * @property {number} stats.totalBytes - Total bytes
 * @property {number} stats.downloadedBytes - Downloaded bytes
 * @property {number} stats.duration - Duration (ms)
 * @property {Array} failedTasks - Failed task list
 */

/**
 * Upload result
 * @typedef {Object} UploadResult
 * @property {boolean} success - Whether succeeded
 * @property {string} [error] - Error message
 * @property {Array} results - Per-file upload results
 * @property {Object} stats - Statistics
 * @property {number} stats.totalBytes - Total bytes
 * @property {number} stats.uploadedBytes - Uploaded bytes
 * @property {number} stats.duration - Duration (ms)
 */

/**
 * Batch operation result
 * @typedef {Object} BatchOperationResult
 * @property {boolean} success - Whether all succeeded
 * @property {Object} data - Result data
 * @property {Array} data.success - Successful items
 * @property {Array} data.failed - Failed items
 * @property {string} [error] - Error message
 */

/**
 * useExplorer Hook return type
 * @typedef {Object} ExplorerInstance
 *
 * @property {import('vue').Ref<string>} deviceId - Device ID
 * @property {import('vue').Ref<DeviceInfo|null>} deviceInfo - Device information
 * @property {Function} setDevice - Set device
 *
 * @property {import('vue').ComputedRef<string>} currentPath - Current path
 * @property {import('vue').ComputedRef<BreadcrumbItem[]>} breadcrumbs - Breadcrumbs
 * @property {import('vue').ComputedRef<string[]>} pathSegments - Path segments
 * @property {import('vue').ComputedRef<string>} parentPath - Parent path
 * @property {import('vue').ComputedRef<boolean>} isRoot - Is root directory
 * @property {import('vue').ComputedRef<boolean>} canGoBack - Can go back
 * @property {import('vue').ComputedRef<boolean>} canGoForward - Can go forward
 *
 * @property {Function} goBack - Go back
 * @property {Function} goForward - Go forward
 * @property {Function} navigateTo - Navigate to path
 * @property {Function} navigateByBreadcrumb - Navigate via breadcrumb
 * @property {Function} enterDirectory - Enter directory
 * @property {Function} goUp - Go up
 *
 * @property {import('vue').Ref<FileEntry[]>} files - File list
 * @property {import('vue').Ref<boolean>} loading - Loading state
 * @property {import('vue').Ref<string|null>} error - Error message
 * @property {import('vue').Ref<number>} lastRefreshTime - Last refresh time
 * @property {Function} refresh - Refresh directory
 *
 * @property {Object} operations - File operations
 * @property {Object} upload - Upload related
 * @property {Object} download - Download related
 * @property {Object} selection - Selection management
 *
 * @property {Function} startAutoRefresh - Start auto-refresh
 * @property {Function} stopAutoRefresh - Stop auto-refresh
 *
 * @property {Object} path - Path utilities
 *
 * @property {Function} getStatus - Get status summary
 * @property {Function} reset - Reset all state
 * @property {Function} init - Initialize
 *
 * @property {Object} _modules - Raw modules (advanced use)
 */

export default {}
