/**
 * 文件图标映射配置
 * 使用 @iconify-json/mdi 图标库
 */

/**
 * 文件类型图标映射表
 * @type {Object<string, {icon: string, color: string, extensions?: string[]}>}
 */
export const FILE_ICON_MAP = {
  // 目录
  directory: {
    icon: 'i-mdi-folder',
    color: 'text-yellow-500',
  },

  // 图片文件
  image: {
    icon: 'i-mdi-file-image',
    color: 'text-green-500',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.heic', '.heif'],
  },

  // 视频文件
  video: {
    icon: 'i-mdi-file-video',
    color: 'text-purple-500',
    extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.mpeg', '.mpg'],
  },

  // 音频文件
  audio: {
    icon: 'i-mdi-file-music',
    color: 'text-pink-500',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.ape'],
  },

  // 文档文件
  document: {
    icon: 'i-mdi-file-document',
    color: 'text-blue-500',
    extensions: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp'],
  },

  // 压缩包
  archive: {
    icon: 'i-mdi-folder-zip',
    color: 'text-orange-500',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tgz', '.tbz2', '.iso'],
  },

  // 代码文件
  code: {
    icon: 'i-mdi-file-code',
    color: 'text-cyan-500',
    extensions: [
      '.js', '.ts', '.jsx', '.tsx', '.vue', '.py', '.java', '.c', '.cpp', '.h', '.hpp',
      '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.cs', '.scala', '.r', '.m', '.mm',
    ],
  },

  // 文本文件
  text: {
    icon: 'i-mdi-file-document-outline',
    color: 'text-gray-500',
    extensions: ['.txt', '.md', '.log', '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg', '.toml'],
  },

  // APK 文件
  apk: {
    icon: 'i-mdi-android',
    color: 'text-green-600',
    extensions: ['.apk'],
  },

  // 可执行文件
  executable: {
    icon: 'i-mdi-application',
    color: 'text-red-500',
    extensions: ['.exe', '.msi', '.app', '.dmg', '.deb', '.rpm', '.sh', '.bat', '.cmd'],
  },

  // PDF 文件（单独处理以使用专用图标）
  pdf: {
    icon: 'i-mdi-file-pdf-box',
    color: 'text-red-600',
    extensions: ['.pdf'],
  },

  // Excel 文件
  excel: {
    icon: 'i-mdi-file-excel',
    color: 'text-green-600',
    extensions: ['.xls', '.xlsx', '.csv'],
  },

  // Word 文件
  word: {
    icon: 'i-mdi-file-word',
    color: 'text-blue-600',
    extensions: ['.doc', '.docx'],
  },

  // PowerPoint 文件
  powerpoint: {
    icon: 'i-mdi-file-powerpoint',
    color: 'text-orange-600',
    extensions: ['.ppt', '.pptx'],
  },

  // 字体文件
  font: {
    icon: 'i-mdi-format-font',
    color: 'text-purple-600',
    extensions: ['.ttf', '.otf', '.woff', '.woff2', '.eot'],
  },

  // 数据库文件
  database: {
    icon: 'i-mdi-database',
    color: 'text-teal-600',
    extensions: ['.db', '.sqlite', '.sql', '.mdb'],
  },

  // 默认图标
  default: {
    icon: 'i-mdi-file',
    color: 'text-gray-400',
  },
}

/**
 * 扩展名到图标类型的缓存映射
 * 用于提高查询性能
 */
let extensionCache = null

/**
 * 构建扩展名缓存
 * @returns {Map<string, string>}
 */
function buildExtensionCache() {
  if (extensionCache)
    return extensionCache

  extensionCache = new Map()

  // 遍历所有图标类型，建立扩展名到类型的映射
  for (const [type, config] of Object.entries(FILE_ICON_MAP)) {
    if (config.extensions) {
      for (const ext of config.extensions) {
        // 优先级：后定义的类型会覆盖先定义的（如 pdf 覆盖 document）
        extensionCache.set(ext.toLowerCase(), type)
      }
    }
  }

  return extensionCache
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 小写的扩展名（包含点号）
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string')
    return ''

  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1)
    return ''

  return filename.substring(lastDotIndex).toLowerCase()
}

/**
 * 根据文件类型或文件名获取图标信息
 * @param {string|Object} fileOrType - 文件对象或文件类型字符串
 * @param {string} [fileOrType.type] - 文件类型（'directory' 或 'file'）
 * @param {string} [fileOrType.name] - 文件名
 * @param {boolean} [fileOrType.isDirectory] - 是否为目录
 * @returns {{icon: string, color: string, type: string}} 图标信息
 */
export function getFileIconInfo(fileOrType) {
  // 处理目录
  if (
    fileOrType === 'directory'
    || fileOrType?.type === 'directory'
    || fileOrType?.isDirectory
  ) {
    return {
      ...FILE_ICON_MAP.directory,
      type: 'directory',
    }
  }

  // 获取文件名
  let filename = ''
  if (typeof fileOrType === 'string') {
    filename = fileOrType
  }
  else if (fileOrType?.name) {
    filename = fileOrType.name
  }

  // 如果没有文件名，返回默认图标
  if (!filename) {
    return {
      ...FILE_ICON_MAP.default,
      type: 'default',
    }
  }

  // 获取扩展名
  const ext = getFileExtension(filename)
  if (!ext) {
    return {
      ...FILE_ICON_MAP.default,
      type: 'default',
    }
  }

  // 使用缓存查找图标类型
  const cache = buildExtensionCache()
  const iconType = cache.get(ext)

  if (iconType && FILE_ICON_MAP[iconType]) {
    return {
      ...FILE_ICON_MAP[iconType],
      type: iconType,
    }
  }

  // 返回默认图标
  return {
    ...FILE_ICON_MAP.default,
    type: 'default',
  }
}

/**
 * 添加自定义图标类型
 * @param {string} type - 图标类型名称
 * @param {Object} config - 图标配置
 * @param {string} config.icon - UnoCSS 图标类名
 * @param {string} config.color - Tailwind 颜色类名
 * @param {string[]} [config.extensions] - 文件扩展名数组
 */
export function addIconType(type, config) {
  if (!type || !config || !config.icon || !config.color) {
    console.warn('[FileIcon] Invalid icon type configuration:', { type, config })
    return
  }

  FILE_ICON_MAP[type] = config

  // 清除缓存以便重新构建
  extensionCache = null
}

/**
 * 批量添加自定义图标类型
 * @param {Object<string, Object>} types - 图标类型配置对象
 */
export function addIconTypes(types) {
  if (!types || typeof types !== 'object')
    return

  for (const [type, config] of Object.entries(types)) {
    addIconType(type, config)
  }
}
