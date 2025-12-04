/**
 * @fileoverview ADB 文件管理器类型定义
 * 提供完整的 JSDoc 类型支持
 */

/**
 * 文件/文件夹条目类型
 * @typedef {'file' | 'directory'} FileEntryType
 */

/**
 * 文件条目信息
 * @typedef {Object} FileEntry
 * @property {string} id - 完整路径（唯一标识）
 * @property {string} name - 文件/文件夹名称
 * @property {FileEntryType} type - 类型
 * @property {string} size - 格式化后的大小
 * @property {number} rawSize - 原始字节大小
 * @property {string} updateTime - 格式化后的更新时间
 * @property {Date} mtime - 原始修改时间
 */

/**
 * 面包屑条目
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - 显示标签
 * @property {string} value - 路径值
 * @property {string} [icon] - 可选图标
 * @property {string} [i18nKey] - 国际化 key
 */

/**
 * 路径管理器配置
 * @typedef {Object} PathManagerOptions
 * @property {string} [initialPath='/sdcard'] - 初始路径
 * @property {number} [historyLimit=50] - 历史记录最大数量
 * @property {Object.<string, BreadcrumbPreset>} [presets] - 预设路径映射
 */

/**
 * 面包屑预设
 * @typedef {Object} BreadcrumbPreset
 * @property {string} icon - 图标
 * @property {string} label - 标签（支持 i18n key）
 * @property {string} value - 路径值
 */

/**
 * 操作状态
 * @typedef {'idle' | 'loading' | 'success' | 'error' | 'cancelled'} OperationStatus
 */

/**
 * 通用操作结果
 * @typedef {Object} OperationResult
 * @property {boolean} success - 是否成功
 * @property {string} [error] - 错误信息
 * @property {*} [data] - 返回数据
 */

/**
 * 进度信息
 * @typedef {Object} ProgressInfo
 * @property {number} percent - 百分比 (0-100)
 * @property {number} completed - 已完成数量
 * @property {number} total - 总数量
 * @property {number} [bytes] - 已传输字节
 * @property {number} [totalBytes] - 总字节
 * @property {number} [elapsed] - 已用时间（毫秒）
 * @property {string} [currentFile] - 当前处理的文件
 */

/**
 * 下载选项
 * @typedef {Object} DownloadOptions
 * @property {string} savePath - 本地保存路径
 * @property {boolean} [preserveStructure=true] - 是否保持目录结构
 * @property {number} [retries=3] - 重试次数
 * @property {Function} [onProgress] - 进度回调
 * @property {Function} [onError] - 错误回调
 * @property {Function} [onComplete] - 完成回调
 */

/**
 * 上传选项
 * @typedef {Object} UploadOptions
 * @property {string} remotePath - 远程保存路径
 * @property {number} [retries=3] - 重试次数
 * @property {Function} [filter] - 文件过滤器
 * @property {Function} [onProgress] - 进度回调
 * @property {Function} [onError] - 错误回调
 * @property {Function} [onComplete] - 完成回调
 */

/**
 * 文件操作类型
 * @typedef {'copy' | 'move' | 'rename' | 'delete' | 'create'} FileOperationType
 */

/**
 * 文件操作任务
 * @typedef {Object} FileOperationTask
 * @property {string} id - 任务 ID
 * @property {FileOperationType} type - 操作类型
 * @property {string} sourcePath - 源路径
 * @property {string} [targetPath] - 目标路径
 * @property {OperationStatus} status - 状态
 * @property {ProgressInfo} [progress] - 进度
 * @property {string} [error] - 错误信息
 */

/**
 * 设备信息
 * @typedef {Object} DeviceInfo
 * @property {string} id - 设备 ID
 * @property {string} [name] - 设备名称
 * @property {string} [model] - 设备型号
 */

/**
 * 文件管理器选项
 * @typedef {Object} FileManagerOptions
 * @property {DeviceInfo} device - 设备信息
 * @property {PathManagerOptions} [pathOptions] - 路径管理器选项
 * @property {boolean} [autoRefresh=false] - 是否自动刷新
 * @property {number} [refreshInterval=5000] - 自动刷新间隔
 */

/**
 * 选择状态
 * @typedef {Object} SelectionState
 * @property {FileEntry[]} items - 已选择的条目
 * @property {boolean} hasFiles - 是否包含文件
 * @property {boolean} hasDirectories - 是否包含文件夹
 * @property {number} count - 选择数量
 * @property {boolean} isEmpty - 是否为空
 * @property {FileEntry[]} files - 选中的文件列表
 * @property {FileEntry[]} directories - 选中的文件夹列表
 */

/**
 * 文件管理器状态摘要
 * @typedef {Object} FileManagerStatus
 * @property {DeviceInfo|null} device - 当前设备
 * @property {string} path - 当前路径
 * @property {number} filesCount - 文件数量
 * @property {number} selectedCount - 选中数量
 * @property {boolean} isLoading - 是否加载中
 * @property {boolean} isUploading - 是否上传中
 * @property {boolean} isDownloading - 是否下载中
 * @property {boolean} hasError - 是否有错误
 */

/**
 * 下载状态摘要
 * @typedef {Object} DownloadStatusSummary
 * @property {boolean} isActive - 是否活跃
 * @property {boolean} isScanning - 是否扫描中
 * @property {boolean} isDownloading - 是否下载中
 * @property {boolean} hasError - 是否有错误
 * @property {ProgressInfo|null} progress - 进度信息
 * @property {Object|null} result - 结果信息
 */

/**
 * 下载结果
 * @typedef {Object} DownloadResult
 * @property {boolean} success - 是否成功
 * @property {string} [error] - 错误信息
 * @property {boolean} cancelled - 是否已取消
 * @property {Object} stats - 统计信息
 * @property {number} stats.totalFiles - 总文件数
 * @property {number} stats.completedFiles - 已完成文件数
 * @property {number} stats.failedFiles - 失败文件数
 * @property {number} stats.totalBytes - 总字节数
 * @property {number} stats.downloadedBytes - 已下载字节数
 * @property {number} stats.duration - 耗时（毫秒）
 * @property {Array} failedTasks - 失败的任务列表
 */

/**
 * 上传结果
 * @typedef {Object} UploadResult
 * @property {boolean} success - 是否成功
 * @property {string} [error] - 错误信息
 * @property {Array} results - 各文件的上传结果
 * @property {Object} stats - 统计信息
 * @property {number} stats.totalBytes - 总字节数
 * @property {number} stats.uploadedBytes - 已上传字节数
 * @property {number} stats.duration - 耗时（毫秒）
 */

/**
 * 批量操作结果
 * @typedef {Object} BatchOperationResult
 * @property {boolean} success - 是否全部成功
 * @property {Object} data - 结果数据
 * @property {Array} data.success - 成功的项
 * @property {Array} data.failed - 失败的项
 * @property {string} [error] - 错误信息
 */

/**
 * useAdbFileManager Hook 返回类型
 * @typedef {Object} AdbFileManagerInstance
 *
 * @property {import('vue').Ref<string>} deviceId - 设备 ID
 * @property {import('vue').Ref<DeviceInfo|null>} deviceInfo - 设备信息
 * @property {Function} setDevice - 设置设备
 *
 * @property {import('vue').ComputedRef<string>} currentPath - 当前路径
 * @property {import('vue').ComputedRef<BreadcrumbItem[]>} breadcrumbs - 面包屑
 * @property {import('vue').ComputedRef<string[]>} pathSegments - 路径段
 * @property {import('vue').ComputedRef<string>} parentPath - 父路径
 * @property {import('vue').ComputedRef<boolean>} isRoot - 是否根目录
 * @property {import('vue').ComputedRef<boolean>} canGoBack - 是否可后退
 * @property {import('vue').ComputedRef<boolean>} canGoForward - 是否可前进
 *
 * @property {Function} goBack - 后退
 * @property {Function} goForward - 前进
 * @property {Function} navigateTo - 导航到路径
 * @property {Function} navigateByBreadcrumb - 通过面包屑导航
 * @property {Function} enterDirectory - 进入目录
 * @property {Function} goUp - 返回上级
 *
 * @property {import('vue').Ref<FileEntry[]>} files - 文件列表
 * @property {import('vue').Ref<boolean>} loading - 加载状态
 * @property {import('vue').Ref<string|null>} error - 错误信息
 * @property {import('vue').Ref<number>} lastRefreshTime - 最后刷新时间
 * @property {Function} refresh - 刷新目录
 *
 * @property {Object} operations - 文件操作
 * @property {Object} upload - 上传相关
 * @property {Object} download - 下载相关
 * @property {Object} selection - 选择管理
 *
 * @property {Function} startAutoRefresh - 开始自动刷新
 * @property {Function} stopAutoRefresh - 停止自动刷新
 *
 * @property {Object} path - 路径工具方法
 *
 * @property {Function} getStatus - 获取状态摘要
 * @property {Function} reset - 重置所有状态
 * @property {Function} init - 初始化
 *
 * @property {Object} _modules - 原始模块（高级用法）
 */

export default {}
