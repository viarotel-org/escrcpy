import FileIcon from './components/FileIcon.vue'
import { addIconType, addIconTypes, getFileExtension, getFileIconInfo } from './utils/iconMap.js'

/**
 * FileIcon 插件
 * 提供文件图标显示功能
 *
 * @example
 * // 在 main.js 中安装
 * import FileIconPlugin from '@/plugins/FileIcon'
 * app.use(FileIconPlugin)
 *
 * // 在组件中使用
 * <FileIcon :file="fileObject" size="lg" />
 * <FileIcon file="test.jpg" />
 * <FileIcon file="directory" />
 *
 * // 使用工具函数
 * import { getFileIconInfo } from '@/plugins/FileIcon'
 * const iconInfo = getFileIconInfo('test.jpg')
 * // { icon: 'i-mdi-file-image', color: 'text-green-500', type: 'image' }
 */

export default {
  install(app) {
    // 注册全局组件
    app.component('FileIcon', FileIcon)

    // 提供全局属性（可选）
    app.config.globalProperties.$fileIcon = {
      getIconInfo: getFileIconInfo,
      getExtension: getFileExtension,
      addType: addIconType,
      addTypes: addIconTypes,
    }
  },
}

// 导出工具函数供直接使用
export {
  addIconType,
  addIconTypes,
  FileIcon,
  getFileExtension,
  getFileIconInfo,
}
