import FileIcon from './components/FileIcon.vue'
import { addIconType, addIconTypes, getFileExtension, getFileIconInfo } from './utils/iconMap.js'

/**
 * FileIcon plugin
 * Provides file icon rendering utilities
 *
 * @example
 * // Install in main.js
 * import FileIconPlugin from '@/plugins/FileIcon'
 * app.use(FileIconPlugin)
 *
 * // Usage in components
 * <FileIcon :file="fileObject" size="lg" />
 * <FileIcon file="test.jpg" />
 * <FileIcon file="directory" />
 *
 * // Using utility functions
 * import { getFileIconInfo } from '@/plugins/FileIcon'
 * const iconInfo = getFileIconInfo('test.jpg')
 * // { icon: 'i-mdi-file-image', color: 'text-green-500', type: 'image' }
 */

export default {
  install(app) {
    // Register global component
    app.component('FileIcon', FileIcon)

    // Provide global properties (optional)
    app.config.globalProperties.$fileIcon = {
      getIconInfo: getFileIconInfo,
      getExtension: getFileExtension,
      addType: addIconType,
      addTypes: addIconTypes,
    }
  },
}

// Export utility functions for direct use
export {
  addIconType,
  addIconTypes,
  FileIcon,
  getFileExtension,
  getFileIconInfo,
}
