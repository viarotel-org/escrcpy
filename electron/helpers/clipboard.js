import { clipboard, nativeImage } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

/**
 * 将文件复制到系统剪切板
 * 支持 macOS、Windows、Linux 平台，能够复制任意类型的文件
 *
 * @param {string} filePath - 要复制的文件路径
 * @returns {Promise<boolean>} - 操作是否成功
 */
export async function copyFileToClipboard(filePath) {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`)
    }

    // 获取文件信息
    const stats = fs.statSync(filePath)
    if (!stats.isFile()) {
      throw new Error('Path is not a file')
    }

    const ext = path.extname(filePath).toLowerCase()
    const absolutePath = path.resolve(filePath)
    const platform = process.platform

    // 检查是否为图片文件
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico', '.tiff', '.tif']
    const isImageFile = imageExtensions.includes(ext)

    // 对于图片文件，同时复制图片内容和文件路径
    if (isImageFile) {
      await copyImageFile(absolutePath, platform)
    }
    else {
      // 对于非图片文件，只复制文件路径
      await copyFilePath(absolutePath, platform)
    }

    console.log(`Successfully copied file to clipboard: ${filePath}`)
    return true
  }
  catch (error) {
    console.error('Failed to copy file to clipboard:', error.message)
    return false
  }
}

/**
 * 复制图片文件到剪切板（同时包含图片内容和文件路径）
 * @param {string} absolutePath - 文件的绝对路径
 * @param {string} platform - 操作系统平台
 */
export async function copyImageFile(absolutePath, platform) {
  try {
    // 读取文件内容并创建图片对象
    const imageBuffer = fs.readFileSync(absolutePath)
    const image = nativeImage.createFromBuffer(imageBuffer)

    if (image.isEmpty()) {
      throw new Error('Failed to create image from file buffer')
    }

    // 复制图片内容
    clipboard.writeImage(image)
    console.log('Image content copied to clipboard')
  }
  catch (error) {
    console.warn('Failed to copy image content, falling back to file path only:', error.message)
    // 如果图片复制失败，至少复制文件路径
    await copyFilePath(absolutePath, platform)
  }
}

/**
 * 复制文件路径到剪切板
 * @param {string} absolutePath - 文件的绝对路径
 * @param {string} platform - 操作系统平台
 */
export async function copyFilePath(absolutePath, platform) {
  switch (platform) {
    case 'darwin': // macOS
      await copyFilePathMacOS(absolutePath)
      break

    case 'win32': // Windows
      await copyFilePathWindows(absolutePath)
      break

    case 'linux': // Linux
      await copyFilePathLinux(absolutePath)
      break

    default:
      console.warn(`Platform ${platform} may not be fully supported for file clipboard operations`)
      // 尝试使用 Linux 格式作为后备
      await copyFilePathLinux(absolutePath)
      break
  }
}

/**
 * macOS 平台文件路径复制
 * 使用 NSFilenamesPboardType 格式（plist 格式）并提供备选格式
 */
export async function copyFilePathMacOS(absolutePath) {
// 验证路径格式
  if (!absolutePath) {
    throw new Error('Invalid macOS path format: null or undefined')
  }

  // 规范化路径（解析符号链接等）
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // 如果无法解析真实路径，使用原路径
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // public.file-url (文件 URL 格式)
  const fileUrl = `file://${encodeURI(normalizedPath)}`
  const urlBuffer = Buffer.from(fileUrl, 'utf8')
  clipboard.writeBuffer('public.file-url', urlBuffer)

  if (verifyClipboardWrite('public.file-url')) {
    console.log('File path copied to clipboard (macOS public.file-url format)')
    return
  }
  console.warn('public.file-url format not supported, trying plain text')

  // NSFilenamesPboardType (plist 格式)
  const escapedPath = escapeXml(normalizedPath)
  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
  <string>${escapedPath}</string>
</array>
</plist>`

  const plistBuffer = Buffer.from(plistContent, 'utf8')
  clipboard.writeBuffer('NSFilenamesPboardType', plistBuffer)

  // 验证格式是否被系统支持
  if (verifyClipboardWrite('NSFilenamesPboardType')) {
    console.log('File path copied to clipboard (macOS NSFilenamesPboardType format)')
    return
  }
  console.warn('NSFilenamesPboardType format not supported, trying alternatives')

  // 普通文本格式（最后的回退选项）
  clipboard.writeText(normalizedPath)
  console.log('File path copied to clipboard (macOS plain text format)')
}

/**
 * Windows 平台文件路径复制
 * 使用多种格式提高兼容性：FileNameW、CF_HDROP 等
 */
export async function copyFilePathWindows(absolutePath) {
  // 验证路径格式
  if (!absolutePath) {
    throw new Error('Invalid Windows path format: null or undefined')
  }

  // 规范化路径
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // 如果无法解析真实路径，使用原路径
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // 处理长路径（添加 \\?\ 前缀）
  let processedPath = normalizedPath
  if (normalizedPath.length > 260 && !normalizedPath.startsWith('\\\\?\\')) {
    if (normalizedPath.startsWith('\\\\')) {
      // UNC 路径：\\server\share -> \\?\UNC\server\share
      processedPath = `\\\\?\\UNC\\${normalizedPath.slice(2)}`
    }
    else {
      // 普通路径：C:\path -> \\?\C:\path
      processedPath = `\\\\?\\${normalizedPath}`
    }
  }

  // FileNameW (UTF-16 编码)
  const pathWithNull = `${processedPath}\0`
  const fileNameWBuffer = Buffer.from(pathWithNull, 'utf16le')
  clipboard.writeBuffer('FileNameW', fileNameWBuffer)

  if (verifyClipboardWrite('FileNameW')) {
    console.log('File path copied to clipboard (Windows FileNameW format)')
    return
  }
  console.warn('FileNameW format not supported, trying alternatives')

  // CF_HDROP 格式（拖放格式）
  const hdropBuffer = createCFHDROPBuffer(processedPath)
  clipboard.writeBuffer('CF_HDROP', hdropBuffer)

  if (verifyClipboardWrite('CF_HDROP')) {
    console.log('File path copied to clipboard (Windows CF_HDROP format)')
    return
  }
  console.warn('CF_HDROP format not supported, trying FileName')

  // FileName (ANSI 编码，用于兼容旧应用)
  const fileNameBuffer = Buffer.from(pathWithNull, 'latin1')
  clipboard.writeBuffer('FileName', fileNameBuffer)

  if (verifyClipboardWrite('FileName')) {
    console.log('File path copied to clipboard (Windows FileName format)')
    return
  }
  console.warn('FileName format not supported, using plain text')

  // 备选格式：普通文本格式（最后的回退选项）
  clipboard.writeText(processedPath)
  console.log('File path copied to clipboard (Windows plain text format)')
}

/**
 * Linux 平台文件路径复制
 * 使用多种格式提高兼容性：text/uri-list、application/x-kde-cutselection 等
 */
export async function copyFilePathLinux(absolutePath) {
  // 验证路径格式
  if (!absolutePath) {
    throw new Error('Invalid Linux path format: null or undefined')
  }

  // 规范化路径（解析符号链接等）
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // 如果无法解析真实路径，使用原路径
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // 尝试主要格式：text/uri-list (标准 URI 列表格式)
  const fileUri = `file://${encodeURI(normalizedPath)}\n`
  const uriListBuffer = Buffer.from(fileUri, 'utf8')
  clipboard.writeBuffer('text/uri-list', uriListBuffer)

  if (verifyClipboardWrite('text/uri-list')) {
    console.log('File path copied to clipboard (Linux text/uri-list format)')
    return
  }
  console.warn('text/uri-list format not supported, trying KDE format')

  // 备选格式：application/x-kde-cutselection (KDE 桌面环境支持)
  // KDE 格式包含操作类型和文件列表
  const kdeContent = `0\n${normalizedPath}\n`
  const kdeBuffer = Buffer.from(kdeContent, 'utf8')
  clipboard.writeBuffer('application/x-kde-cutselection', kdeBuffer)

  if (verifyClipboardWrite('application/x-kde-cutselection')) {
    console.log('File path copied to clipboard (Linux KDE format)')
    return
  }
  console.warn('application/x-kde-cutselection format not supported, trying GNOME format')

  // 备选格式：x-special/gnome-copied-files (GNOME 文件管理器格式)
  const gnomeContent = `copy\n${fileUri.trim()}`
  const gnomeBuffer = Buffer.from(gnomeContent, 'utf8')
  clipboard.writeBuffer('x-special/gnome-copied-files', gnomeBuffer)

  if (verifyClipboardWrite('x-special/gnome-copied-files')) {
    console.log('File path copied to clipboard (Linux GNOME format)')
    return
  }
  console.warn('x-special/gnome-copied-files format not supported, trying alternatives')

  // 备选格式：text/x-moz-url (Mozilla 应用支持的 URL 格式)
  const mozUrlContent = `${fileUri.trim()}\n${path.basename(normalizedPath)}`
  const mozUrlBuffer = Buffer.from(mozUrlContent, 'utf16le')
  clipboard.writeBuffer('text/x-moz-url', mozUrlBuffer)

  if (verifyClipboardWrite('text/x-moz-url')) {
    console.log('File path copied to clipboard (Linux Mozilla URL format)')
    return
  }
  console.warn('text/x-moz-url format not supported, using plain text')

  // 备选格式：普通文本格式（最后的回退选项）
  clipboard.writeText(normalizedPath)
  console.log('File path copied to clipboard (Linux plain text format)')
}

/**
 * 创建 CF_HDROP 格式的数据
 * @param {string} filePath - 文件路径
 * @returns {Buffer} - CF_HDROP 格式的 buffer
 */
export function createCFHDROPBuffer(filePath) {
  // CF_HDROP 结构：
  // DROPFILES 结构 (20 bytes) + 文件路径列表 + 双 null 终止符

  const pathWithNull = `${filePath}\0`
  const pathBuffer = Buffer.from(pathWithNull, 'utf16le')

  // DROPFILES 结构
  const dropFilesHeader = Buffer.alloc(20)
  dropFilesHeader.writeUInt32LE(20, 0) // pFiles: 文件列表偏移量
  dropFilesHeader.writeUInt32LE(0, 4) // pt.x
  dropFilesHeader.writeUInt32LE(0, 8) // pt.y
  dropFilesHeader.writeUInt32LE(0, 12) // fNC (not used)
  dropFilesHeader.writeUInt32LE(1, 16) // fWide: 1 表示 Unicode

  // 双 null 终止符
  const doubleNull = Buffer.from('\0\0', 'utf16le')

  return Buffer.concat([dropFilesHeader, pathBuffer, doubleNull])
}

/**
 * XML 转义函数，用于处理 plist 中的特殊字符
 * @param {string} str - 需要转义的字符串
 * @returns {string} - 转义后的字符串
 */
export function escapeXml(str) {
  if (typeof str !== 'string') {
    return String(str)
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 检查剪切板格式是否被系统真正支持
 * @param {string} format - 剪切板格式
 * @returns {boolean} - 格式是否被系统支持
 */
export function verifyClipboardWrite(format) {
  try {
    // 尝试读取刚写入的数据进行验证
    const readData = clipboard.readBuffer(format)

    if (readData && readData.length > 0) {
      return true
    }
  }
  catch (error) {
    return false
  }

  return false
}
