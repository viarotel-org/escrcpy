import { clipboard, nativeImage } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Resolve the real path of a file, falling back to the original path on error.
 */
function normalizePath(filePath: string): string {
  try {
    return fs.realpathSync(filePath)
  }
  catch {
    return filePath
  }
}

/**
 * XML escape function used for special characters in plist content.
 */
export function escapeXml(str: string): string {
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
 * Verify that a clipboard write actually landed by reading the buffer back.
 */
export function verifyClipboardWrite(format: string): boolean {
  try {
    const data = clipboard.readBuffer(format)
    return data != null && data.length > 0
  }
  catch {
    return false
  }
}

type ClipboardWithFileWriter = typeof clipboard & {
  _writeFilesForTesting?: (filePaths: string[]) => void
}

function writeFilesWithElectronWriter(filePaths: string[]): boolean {
  const writer = clipboard as ClipboardWithFileWriter

  if (typeof writer._writeFilesForTesting !== 'function') {
    return false
  }

  try {
    writer._writeFilesForTesting(filePaths)
    return true
  }
  catch (error: any) {
    console.warn('Electron filenames writer failed:', error.message)
    return false
  }
}

function getLastFilePath(filePaths: string[]): string {
  return filePaths[filePaths.length - 1]
}

function formatUriList(fileUris: string[]): string {
  return fileUris.join('\r\n')
}

// ---------------------------------------------------------------------------
// CF_HDROP helpers (Windows)
// ---------------------------------------------------------------------------

/**
 * Build a CF_HDROP buffer for one or more file paths.
 * The DROPFILES header is 20 bytes, followed by null-terminated UTF-16LE
 * path strings, and a final double-null terminator.
 */
export function createCFHDROPBufferMultiple(filePaths: string[]): Buffer {
  const pathBuffers = filePaths.map(p => Buffer.from(`${p}\0`, 'utf16le'))
  const header = Buffer.alloc(20)
  header.writeUInt32LE(20, 0) // pFiles offset
  header.writeUInt32LE(0, 4) // pt.x
  header.writeUInt32LE(0, 8) // pt.y
  header.writeUInt32LE(0, 12) // fNC
  header.writeUInt32LE(1, 16) // fWide = true (Unicode)
  const doubleNull = Buffer.from('\0\0', 'utf16le')
  return Buffer.concat([header, ...pathBuffers, doubleNull])
}

/** Convenience wrapper for a single file path. */
export function createCFHDROPBuffer(filePath: string): Buffer {
  return createCFHDROPBufferMultiple([filePath])
}

// ---------------------------------------------------------------------------
// Image-specific clipboard write (single file only)
// ---------------------------------------------------------------------------

/**
 * Write the pixel content of a single image file to the clipboard.
 * Falls through to the macOS file-path write if the image cannot be decoded.
 */
export async function copyImageFile(absolutePath: string): Promise<void> {
  try {
    const image = nativeImage.createFromBuffer(fs.readFileSync(absolutePath))
    if (image.isEmpty()) {
      throw new Error('Failed to create image from buffer')
    }
    clipboard.writeImage(image)
    console.log('Image content copied to clipboard')
  }
  catch (error: any) {
    console.warn('Failed to copy image content, falling back to file path:', error.message)
    await copyFilesMacOS([absolutePath])
  }
}

// ---------------------------------------------------------------------------
// Unified per-platform clipboard writers (single AND multiple files)
// ---------------------------------------------------------------------------

/**
 * macOS: write one or more file paths to the clipboard.
 *
 * - Single file  – tries `public.file-url` first (most compatible for one path),
 *                  then `NSFilenamesPboardType`, then plain text.
 * - Multiple files – `NSFilenamesPboardType` plist array, then plain text.
 */
export async function copyFilesMacOS(absolutePaths: string[]): Promise<void> {
  const normalized = absolutePaths.map(normalizePath)

  if (normalized.length === 1) {
    clipboard.writeBuffer('public.file-url', Buffer.from(`file://${encodeURI(normalized[0])}`, 'utf8'))
    if (verifyClipboardWrite('public.file-url')) {
      console.log('File path copied to clipboard (macOS public.file-url)')
      return
    }
    console.warn('public.file-url not supported, trying NSFilenamesPboardType')
  }

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
${normalized.map(p => `  <string>${escapeXml(p)}</string>`).join('\n')}
</array>
</plist>`

  clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist, 'utf8'))
  if (verifyClipboardWrite('NSFilenamesPboardType')) {
    console.log('File(s) copied to clipboard (macOS NSFilenamesPboardType)')
    return
  }

  clipboard.writeText(normalized.join('\n'))
  console.log('File(s) copied to clipboard (macOS plain text fallback)')
}

/**
 * Windows: write one or more file paths to the clipboard.
 *
 * - Single file  – tries `FileNameW`, then `CF_HDROP`, then `FileName`, then plain text.
 * - Multiple files – `CF_HDROP` (natively supports multiple entries), then plain text.
 */
export async function copyFilesWindows(absolutePaths: string[]): Promise<void> {
  const normalized = absolutePaths.map((p) => {
    let n = normalizePath(p)
    if (n.length > 260 && !n.startsWith('\\\\?\\')) {
      n = n.startsWith('\\\\') ? `\\\\?\\UNC\\${n.slice(2)}` : `\\\\?\\${n}`
    }
    return n
  })

  if (writeFilesWithElectronWriter(normalized)) {
    console.log('File(s) copied to clipboard (Windows Chromium filenames writer)')
    return
  }

  if (normalized.length === 1) {
    clipboard.writeBuffer('FileNameW', Buffer.from(`${normalized[0]}\0`, 'utf16le'))
    if (verifyClipboardWrite('FileNameW')) {
      console.log('File path copied to clipboard (Windows FileNameW)')
      return
    }
    console.warn('FileNameW not supported, trying CF_HDROP')
  }

  if (normalized.length > 1) {
    const fallbackPath = getLastFilePath(normalized)
    clipboard.writeBuffer('FileNameW', Buffer.from(`${fallbackPath}\0`, 'utf16le'))
    if (verifyClipboardWrite('FileNameW')) {
      console.warn('Windows multi-file paste is unavailable, downgraded to the last file via FileNameW')
      return
    }
  }

  clipboard.writeBuffer('CF_HDROP', createCFHDROPBufferMultiple(normalized))
  if (verifyClipboardWrite('CF_HDROP')) {
    console.warn('Windows multi-file clipboard fell back to raw CF_HDROP, browser/Electron paste compatibility is not guaranteed')
    return
  }

  if (normalized.length === 1) {
    clipboard.writeBuffer('FileName', Buffer.from(`${normalized[0]}\0`, 'latin1'))
    if (verifyClipboardWrite('FileName')) {
      console.log('File path copied to clipboard (Windows FileName)')
      return
    }
    console.warn('FileName not supported, using plain text')
  }
  else {
    const fallbackPath = getLastFilePath(normalized)
    clipboard.writeText(fallbackPath)
    console.warn('Windows multi-file paste fell back to plain text of the last file path')
    return
  }

  clipboard.writeText(normalized.join('\r\n'))
  console.log('File(s) copied to clipboard (Windows plain text fallback)')
}

/**
 * Linux: write one or more file paths to the clipboard.
 *
 * Tries `text/uri-list`, then GNOME, then KDE, then Mozilla URL (single only),
 * and falls back to plain text.
 */
export async function copyFilesLinux(absolutePaths: string[]): Promise<void> {
  const normalized = absolutePaths.map(normalizePath)
  const fileUris = normalized.map(p => `file://${encodeURI(p)}`)

  if (writeFilesWithElectronWriter(normalized)) {
    console.log('File(s) copied to clipboard (Linux Chromium filenames writer)')
    return
  }

  clipboard.writeBuffer('text/uri-list', Buffer.from(formatUriList(fileUris), 'utf8'))
  if (verifyClipboardWrite('text/uri-list')) {
    console.log('File(s) copied to clipboard (Linux text/uri-list)')
    return
  }

  clipboard.writeBuffer('x-special/gnome-copied-files', Buffer.from(`copy\n${fileUris.join('\n')}`, 'utf8'))
  if (verifyClipboardWrite('x-special/gnome-copied-files')) {
    console.log('File(s) copied to clipboard (Linux GNOME format)')
    return
  }

  clipboard.writeBuffer('application/x-kde-cutselection', Buffer.from(`0\n${normalized.join('\n')}\n`, 'utf8'))
  if (verifyClipboardWrite('application/x-kde-cutselection')) {
    console.log('File(s) copied to clipboard (Linux KDE format)')
    return
  }

  if (normalized.length === 1) {
    clipboard.writeBuffer('text/x-moz-url', Buffer.from(`${fileUris[0]}\n${path.basename(normalized[0])}`, 'utf16le'))
    if (verifyClipboardWrite('text/x-moz-url')) {
      console.log('File path copied to clipboard (Linux Mozilla URL format)')
      return
    }
  }

  if (normalized.length > 1) {
    const fallbackPath = getLastFilePath(normalized)
    const fallbackUri = `file://${encodeURI(fallbackPath)}`

    clipboard.writeBuffer('text/uri-list', Buffer.from(fallbackUri, 'utf8'))
    if (verifyClipboardWrite('text/uri-list')) {
      console.warn('Linux multi-file paste is unavailable, downgraded to the last file via text/uri-list')
      return
    }

    clipboard.writeText(fallbackPath)
    console.warn('Linux multi-file paste fell back to plain text of the last file path')
    return
  }

  clipboard.writeText(normalized.join('\n'))
  console.log('File(s) copied to clipboard (Linux plain text fallback)')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico', '.tiff', '.tif'])

/**
 * Copy one or more files to the system clipboard.
 *
 * A single image file has its pixel content written directly (allowing direct
 * paste in image editors). Everything else is written as a native file
 * selection using the appropriate platform format.
 *
 * @param filePaths - Absolute paths to the files
 * @returns Whether the operation succeeded
 */
export async function copyFilesToClipboard(filePaths: string[]): Promise<boolean> {
  try {
    if (filePaths.length === 0) {
      throw new Error('No file paths provided')
    }

    const absolutePaths = filePaths.map((p) => {
      if (!fs.existsSync(p)) {
        throw new Error(`File does not exist: ${p}`)
      }
      return path.resolve(p)
    })

    // Single image → write pixel data to clipboard
    if (absolutePaths.length === 1 && IMAGE_EXTENSIONS.has(path.extname(absolutePaths[0]).toLowerCase())) {
      await copyImageFile(absolutePaths[0])
    }
    else {
      const platform = process.platform
      if (platform === 'darwin') {
        await copyFilesMacOS(absolutePaths)
      }
      else if (platform === 'win32') {
        await copyFilesWindows(absolutePaths)
      }
      else {
        await copyFilesLinux(absolutePaths)
      }
    }

    console.log(`Successfully copied ${absolutePaths.length} file(s) to clipboard`)
    return true
  }
  catch (error: any) {
    console.error('Failed to copy file(s) to clipboard:', error.message)
    return false
  }
}

/**
 * Convenience wrapper — copy a single file to the system clipboard.
 *
 * Delegates to {@link copyFilesToClipboard}.
 */
export function copyFileToClipboard(filePath: string): Promise<boolean> {
  return copyFilesToClipboard([filePath])
}
