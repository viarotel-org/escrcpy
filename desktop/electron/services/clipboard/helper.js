import { clipboard, nativeImage } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

/**
 * Copy a file to the system clipboard
 * Supports macOS, Windows, and Linux; can copy arbitrary file types
 *
 * @param {string} filePath - Path to the file to copy
 * @returns {Promise<boolean>} - Whether the operation succeeded
 */
export async function copyFileToClipboard(filePath) {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`)
    }

    // Get file stats
    const stats = fs.statSync(filePath)
    if (!stats.isFile()) {
      throw new Error('Path is not a file')
    }

    const ext = path.extname(filePath).toLowerCase()
    const absolutePath = path.resolve(filePath)
    const platform = process.platform

    // Check if it's an image file
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico', '.tiff', '.tif']
    const isImageFile = imageExtensions.includes(ext)

    // For image files, copy both image content and file path
    if (isImageFile) {
      await copyImageFile(absolutePath, platform)
    }
    else {
      // For non-image files, copy just the file path
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
 * Copy an image file to the clipboard (writes both image content and file path)
 * @param {string} absolutePath - Absolute path to the image file
 * @param {string} platform - Operating system platform
 */
export async function copyImageFile(absolutePath, platform) {
  try {
    // Read file buffer and create a native image object
    const imageBuffer = fs.readFileSync(absolutePath)
    const image = nativeImage.createFromBuffer(imageBuffer)

    if (image.isEmpty()) {
      throw new Error('Failed to create image from file buffer')
    }

    // Write image content to clipboard
    clipboard.writeImage(image)
    console.log('Image content copied to clipboard')
  }
  catch (error) {
    console.warn('Failed to copy image content, falling back to file path only:', error.message)
    // If image copy fails, fall back to copying the file path only
    await copyFilePath(absolutePath, platform)
  }
}

/**
 * Copy file path to clipboard
 * @param {string} absolutePath - Absolute path to the file
 * @param {string} platform - Operating system platform
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
      // Attempt Linux format as a fallback
      await copyFilePathLinux(absolutePath)
      break
  }
}

/**
 * macOS file path copy
 * Uses public.file-url and NSFilenamesPboardType (plist) formats with fallbacks
 */
export async function copyFilePathMacOS(absolutePath) {
// Validate path format
  if (!absolutePath) {
    throw new Error('Invalid macOS path format: null or undefined')
  }

  // Normalize path (resolve symlinks, etc.)
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // If real path can't be resolved, use original path
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // public.file-url (file URL format)
  const fileUrl = `file://${encodeURI(normalizedPath)}`
  const urlBuffer = Buffer.from(fileUrl, 'utf8')
  clipboard.writeBuffer('public.file-url', urlBuffer)

  if (verifyClipboardWrite('public.file-url')) {
    console.log('File path copied to clipboard (macOS public.file-url format)')
    return
  }
  console.warn('public.file-url format not supported, trying plain text')

  // NSFilenamesPboardType (plist format)
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

  // Verify whether the format is supported by the system
  if (verifyClipboardWrite('NSFilenamesPboardType')) {
    console.log('File path copied to clipboard (macOS NSFilenamesPboardType format)')
    return
  }
  console.warn('NSFilenamesPboardType format not supported, trying alternatives')

  // Plain text format (final fallback)
  clipboard.writeText(normalizedPath)
  console.log('File path copied to clipboard (macOS plain text format)')
}

/**
 * Windows file path copy
 * Uses multiple formats for compatibility: FileNameW, CF_HDROP, etc.
 */
export async function copyFilePathWindows(absolutePath) {
  // Validate path
  if (!absolutePath) {
    throw new Error('Invalid Windows path format: null or undefined')
  }

  // Normalize path
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // If real path can't be resolved, use original path
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // Handle long paths (add \\?\\ prefix)
  let processedPath = normalizedPath
  if (normalizedPath.length > 260 && !normalizedPath.startsWith('\\\\?\\')) {
    if (normalizedPath.startsWith('\\\\')) {
      // UNC paths: \\server\share -> \\?\\UNC\\server\\share
      processedPath = `\\\\?\\UNC\\${normalizedPath.slice(2)}`
    }
    else {
      // Normal path: C:\\path -> \\?\\C:\\path
      processedPath = `\\\\?\\${normalizedPath}`
    }
  }

  // FileNameW (UTF-16 encoding)
  const pathWithNull = `${processedPath}\0`
  const fileNameWBuffer = Buffer.from(pathWithNull, 'utf16le')
  clipboard.writeBuffer('FileNameW', fileNameWBuffer)

  if (verifyClipboardWrite('FileNameW')) {
    console.log('File path copied to clipboard (Windows FileNameW format)')
    return
  }
  console.warn('FileNameW format not supported, trying alternatives')

  // CF_HDROP format (drag-and-drop format)
  const hdropBuffer = createCFHDROPBuffer(processedPath)
  clipboard.writeBuffer('CF_HDROP', hdropBuffer)

  if (verifyClipboardWrite('CF_HDROP')) {
    console.log('File path copied to clipboard (Windows CF_HDROP format)')
    return
  }
  console.warn('CF_HDROP format not supported, trying FileName')

  // FileName (ANSI encoding, for legacy applications)
  const fileNameBuffer = Buffer.from(pathWithNull, 'latin1')
  clipboard.writeBuffer('FileName', fileNameBuffer)

  if (verifyClipboardWrite('FileName')) {
    console.log('File path copied to clipboard (Windows FileName format)')
    return
  }
  console.warn('FileName format not supported, using plain text')

  // Fallback: plain text format (final fallback)
  clipboard.writeText(processedPath)
  console.log('File path copied to clipboard (Windows plain text format)')
}

/**
 * Copy file path to clipboard on Linux
 * Uses multiple formats for compatibility: text/uri-list, application/x-kde-cutselection, etc.
 */
export async function copyFilePathLinux(absolutePath) {
  // Validate path format
  if (!absolutePath) {
    throw new Error('Invalid Linux path format: null or undefined')
  }

  // Normalize path (resolve symlinks etc.)
  let normalizedPath
  try {
    normalizedPath = fs.realpathSync(absolutePath)
  }
  catch (error) {
    // If real path can't be resolved, use original path
    normalizedPath = absolutePath
    console.warn(`Could not resolve real path for ${absolutePath}, using original path`)
  }

  // Try primary format: text/uri-list (standard URI list format)
  const fileUri = `file://${encodeURI(normalizedPath)}\n`
  const uriListBuffer = Buffer.from(fileUri, 'utf8')
  clipboard.writeBuffer('text/uri-list', uriListBuffer)

  if (verifyClipboardWrite('text/uri-list')) {
    console.log('File path copied to clipboard (Linux text/uri-list format)')
    return
  }
  console.warn('text/uri-list format not supported, trying KDE format')

  // Alternative: application/x-kde-cutselection (KDE desktop support)
  // KDE format contains operation type and file list
  const kdeContent = `0\n${normalizedPath}\n`
  const kdeBuffer = Buffer.from(kdeContent, 'utf8')
  clipboard.writeBuffer('application/x-kde-cutselection', kdeBuffer)

  if (verifyClipboardWrite('application/x-kde-cutselection')) {
    console.log('File path copied to clipboard (Linux KDE format)')
    return
  }
  console.warn('application/x-kde-cutselection format not supported, trying GNOME format')

  // Alternative: x-special/gnome-copied-files (GNOME file manager format)
  const gnomeContent = `copy\n${fileUri.trim()}`
  const gnomeBuffer = Buffer.from(gnomeContent, 'utf8')
  clipboard.writeBuffer('x-special/gnome-copied-files', gnomeBuffer)

  if (verifyClipboardWrite('x-special/gnome-copied-files')) {
    console.log('File path copied to clipboard (Linux GNOME format)')
    return
  }
  console.warn('x-special/gnome-copied-files format not supported, trying alternatives')

  // Alternative: text/x-moz-url (Mozilla URL format)
  const mozUrlContent = `${fileUri.trim()}\n${path.basename(normalizedPath)}`
  const mozUrlBuffer = Buffer.from(mozUrlContent, 'utf16le')
  clipboard.writeBuffer('text/x-moz-url', mozUrlBuffer)

  if (verifyClipboardWrite('text/x-moz-url')) {
    console.log('File path copied to clipboard (Linux Mozilla URL format)')
    return
  }
  console.warn('text/x-moz-url format not supported, using plain text')

  // Fallback: plain text format (final fallback)
  clipboard.writeText(normalizedPath)
  console.log('File path copied to clipboard (Linux plain text format)')
}

/**
 * Create data for CF_HDROP format
 * @param {string} filePath - File path
 * @returns {Buffer} - Buffer in CF_HDROP format
 */
export function createCFHDROPBuffer(filePath) {
  // CF_HDROP structure:
  // DROPFILES structure (20 bytes) + file path list + double null terminator

  const pathWithNull = `${filePath}\0`
  const pathBuffer = Buffer.from(pathWithNull, 'utf16le')

  // DROPFILES structure
  const dropFilesHeader = Buffer.alloc(20)
  dropFilesHeader.writeUInt32LE(20, 0) // pFiles: offset to file list
  dropFilesHeader.writeUInt32LE(0, 4) // pt.x
  dropFilesHeader.writeUInt32LE(0, 8) // pt.y
  dropFilesHeader.writeUInt32LE(0, 12) // fNC (not used)
  dropFilesHeader.writeUInt32LE(1, 16) // fWide: 1 indicates Unicode (wide chars)

  // Double null terminator
  const doubleNull = Buffer.from('\0\0', 'utf16le')

  return Buffer.concat([dropFilesHeader, pathBuffer, doubleNull])
}

/**
 * XML escape function used for handling special characters in plist content
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
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
 * Check if the clipboard format is actually supported by the system
 * @param {string} format - Clipboard format
 * @returns {boolean} - Whether the format is supported by the system
 */
export function verifyClipboardWrite(format) {
  try {
    // Try reading the just-written data to verify
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
