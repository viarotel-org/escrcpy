/**
 * File icon mapping configuration
 * Uses the @iconify-json/mdi icon set
 */

/**
 * File type icon mapping table
 * @type {Object<string, {icon: string, color: string, extensions?: string[]}>}
 */
export const FILE_ICON_MAP = {
  // Directory
  directory: {
    icon: 'i-mdi-folder',
    color: 'text-yellow-500',
  },

  // Image files
  image: {
    icon: 'i-mdi-file-image',
    color: 'text-green-500',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.heic', '.heif'],
  },

  // Video files
  video: {
    icon: 'i-mdi-file-video',
    color: 'text-purple-500',
    extensions: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.mpeg', '.mpg'],
  },

  // Audio files
  audio: {
    icon: 'i-mdi-file-music',
    color: 'text-pink-500',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus', '.ape'],
  },

  // Document files
  document: {
    icon: 'i-mdi-file-document',
    color: 'text-blue-500',
    extensions: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp'],
  },

  // Archives
  archive: {
    icon: 'i-mdi-folder-zip',
    color: 'text-orange-500',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tgz', '.tbz2', '.iso'],
  },

  // Code files
  code: {
    icon: 'i-mdi-file-code',
    color: 'text-cyan-500',
    extensions: [
      '.js', '.ts', '.jsx', '.tsx', '.vue', '.py', '.java', '.c', '.cpp', '.h', '.hpp',
      '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.cs', '.scala', '.r', '.m', '.mm',
    ],
  },

  // Text files
  text: {
    icon: 'i-mdi-file-document-outline',
    color: 'text-gray-500',
    extensions: ['.txt', '.md', '.log', '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg', '.toml'],
  },

  // APK files
  apk: {
    icon: 'i-mdi-android',
    color: 'text-green-600',
    extensions: ['.apk'],
  },

  // Executable files
  executable: {
    icon: 'i-mdi-application',
    color: 'text-red-500',
    extensions: ['.exe', '.msi', '.app', '.dmg', '.deb', '.rpm', '.sh', '.bat', '.cmd'],
  },

  // PDF files (handled separately to use a dedicated icon)
  pdf: {
    icon: 'i-mdi-file-pdf-box',
    color: 'text-red-600',
    extensions: ['.pdf'],
  },

  // Excel files
  excel: {
    icon: 'i-mdi-file-excel',
    color: 'text-green-600',
    extensions: ['.xls', '.xlsx', '.csv'],
  },

  // Word files
  word: {
    icon: 'i-mdi-file-word',
    color: 'text-blue-600',
    extensions: ['.doc', '.docx'],
  },

  // PowerPoint files
  powerpoint: {
    icon: 'i-mdi-file-powerpoint',
    color: 'text-orange-600',
    extensions: ['.ppt', '.pptx'],
  },

  // Font files
  font: {
    icon: 'i-mdi-format-font',
    color: 'text-purple-600',
    extensions: ['.ttf', '.otf', '.woff', '.woff2', '.eot'],
  },

  // Database files
  database: {
    icon: 'i-mdi-database',
    color: 'text-teal-600',
    extensions: ['.db', '.sqlite', '.sql', '.mdb'],
  },

  // Default icon
  default: {
    icon: 'i-mdi-file',
    color: 'text-gray-400',
  },
}

/**
 * Cached mapping from extension to icon type
 * Used to improve lookup performance
 */
let extensionCache = null

/**
 * Build extension cache
 * @returns {Map<string, string>}
 */
function buildExtensionCache() {
  if (extensionCache)
    return extensionCache

  extensionCache = new Map()

  // Iterate icon types and build extension -> type mapping
  for (const [type, config] of Object.entries(FILE_ICON_MAP)) {
    if (config.extensions) {
      for (const ext of config.extensions) {
        // Priority: later-defined types override earlier ones (e.g., pdf overrides document)
        extensionCache.set(ext.toLowerCase(), type)
      }
    }
  }

  return extensionCache
}

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} Lowercased extension (including dot)
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
 * Get icon information based on file type or filename
 * @param {string|Object} fileOrType - File object or type string
 * @param {string} [fileOrType.type] - File type ('directory' or 'file')
 * @param {string} [fileOrType.name] - Filename
 * @param {boolean} [fileOrType.isDirectory] - Whether it's a directory
 * @returns {{icon: string, color: string, type: string}} Icon information
 */
export function getFileIconInfo(fileOrType) {
  // Handle directory
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

  // Get filename
  let filename = ''
  if (typeof fileOrType === 'string') {
    filename = fileOrType
  }
  else if (fileOrType?.name) {
    filename = fileOrType.name
  }

  // If no filename, return default icon
  if (!filename) {
    return {
      ...FILE_ICON_MAP.default,
      type: 'default',
    }
  }

  // Get extension
  const ext = getFileExtension(filename)
  if (!ext) {
    return {
      ...FILE_ICON_MAP.default,
      type: 'default',
    }
  }

  // Use cache to lookup icon type
  const cache = buildExtensionCache()
  const iconType = cache.get(ext)

  if (iconType && FILE_ICON_MAP[iconType]) {
    return {
      ...FILE_ICON_MAP[iconType],
      type: iconType,
    }
  }

  // Return default icon
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
