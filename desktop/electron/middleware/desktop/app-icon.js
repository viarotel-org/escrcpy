/**
 * Minimal, zero-dependency APK launcher-icon extractor.
 *
 * Supports:
 *  - Plain PNG launcher icons (any density, highest wins)
 *  - Adaptive icons (anydpi-v26 XML): background + foreground PNG layers are
 *    composited, center-cropped (the visible 2/3 of the 108dp grid) and given
 *    rounded corners, mirroring what modern launchers render.
 *
 * WebP-only icons are intentionally unsupported (returns null) to keep this
 * module free of native image dependencies; callers should fall back to the
 * default application icon in that case.
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'

const PKG_TYPE_TABLE = 0x0002
const PKG_TYPE_STRING_POOL = 0x0001
const PKG_TYPE_PACKAGE = 0x0200
const PKG_TYPE_TYPE = 0x0201

const XML_TYPE_STRING_POOL = 0x0001
const XML_TYPE_START_ELEMENT = 0x0102

const VALUE_TYPE_STRING = 0x03
const VALUE_TYPE_REFERENCE = 0x01

const UTF8_FLAG = 0x100

/* ------------------------------ ZIP reader ------------------------------ */

function findEOCD(buf) {
  const min = Math.max(0, buf.length - 65558)
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i
  }
  return -1
}

/**
 * Reads a single file out of a ZIP buffer (APK). Handles STORE and DEFLATE.
 */
export function readZipEntry(buf, entryName) {
  const eocd = findEOCD(buf)
  if (eocd < 0) throw new Error('ZIP: end of central directory not found')

  const entryCount = buf.readUInt16LE(eocd + 10)
  let offset = buf.readUInt32LE(eocd + 16)

  for (let i = 0; i < entryCount; i++) {
    if (buf.readUInt32LE(offset) !== 0x02014b50) return null

    const method = buf.readUInt16LE(offset + 10)
    const compressedSize = buf.readUInt32LE(offset + 20)
    const nameLength = buf.readUInt16LE(offset + 28)
    const extraLength = buf.readUInt16LE(offset + 30)
    const commentLength = buf.readUInt16LE(offset + 32)
    const localOffset = buf.readUInt32LE(offset + 42)
    const name = buf.slice(offset + 46, offset + 46 + nameLength).toString('utf8')

    if (name === entryName) {
      const localNameLength = buf.readUInt16LE(localOffset + 26)
      const localExtraLength = buf.readUInt16LE(localOffset + 28)
      const dataStart = localOffset + 30 + localNameLength + localExtraLength
      const data = buf.slice(dataStart, dataStart + compressedSize)

      if (method === 0) return data
      if (method === 8) return zlib.inflateRawSync(data)
      throw new Error(`ZIP: unsupported compression method ${method}`)
    }

    offset += 46 + nameLength + extraLength + commentLength
  }

  return null
}

/* ---------------------------- string pool ------------------------------ */

function parseStringPool(buf, offset) {
  const stringCount = buf.readUInt32LE(offset + 8)
  const flags = buf.readUInt32LE(offset + 16)
  const stringsStart = buf.readUInt32LE(offset + 20)
  const isUtf8 = (flags & UTF8_FLAG) !== 0

  const strings = []

  for (let i = 0; i < stringCount; i++) {
    let pos = offset + stringsStart + buf.readUInt32LE(offset + 28 + i * 4)
    let length = 0

    if (isUtf8) {
      // UTF-8 pool: two length prefixes (char count, byte count), each 1-2
      // bytes with the high bit marking a second byte, then the raw bytes
      let chars = buf[pos++]
      if (chars & 0x80) chars = ((chars & 0x7f) << 8) | buf[pos++] // consumed, only used as sanity check
      let lenBytes = buf[pos++]
      if (lenBytes & 0x80) lenBytes = ((lenBytes & 0x7f) << 8) | buf[pos++]
      strings.push(buf.slice(pos, pos + lenBytes).toString('utf8'))
    }
    else {
      let b = buf.readUInt16LE(pos)
      pos += 2
      if (b & 0x8000) length = ((b & 0x7fff) << 16) | buf.readUInt16LE(pos)
      else length = b
      strings.push(buf.slice(pos, pos + length * 2).toString('ucs2'))
    }
  }

  return strings
}

/* ------------------------------ AXML ----------------------------------- */

function collectXmlElementAttributes(buf) {
  // Returns: Map<elementName, Array<{ name, dataType, data }>>
  const chunkSize = buf.readUInt32LE(4)
  let offset = buf.readUInt16LE(2) // header size of RES_XML_TYPE

  let stringPool = []

  const elements = new Map()

  while (offset < chunkSize) {
    const type = buf.readUInt16LE(offset)
    const headerSize = buf.readUInt16LE(offset + 2)
    const size = buf.readUInt32LE(offset + 4)

    if (type === XML_TYPE_STRING_POOL) {
      stringPool = parseStringPool(buf, offset)
    }
    else if (type === XML_TYPE_START_ELEMENT) {
      const nameIndex = buf.readUInt32LE(offset + 20)
      const attributeStart = buf.readUInt16LE(offset + 24)
      const attributeSize = buf.readUInt16LE(offset + 26)
      const attributeCount = buf.readUInt16LE(offset + 28)

      const elementName = stringPool[nameIndex] ?? ''
      const attributes = []

      for (let i = 0; i < attributeCount; i++) {
        // layout: ns(4) name(4) rawValue(4) typedSize(2) res0(1) dataType(1) data(4)
        const base = offset + headerSize + attributeStart + i * attributeSize
        const attrNameIndex = buf.readUInt32LE(base + 4)
        const dataType = buf[base + 15]
        const data = buf.readUInt32LE(base + 16)
        attributes.push({
          name: stringPool[attrNameIndex] ?? '',
          dataType,
          data,
        })
      }

      if (!elements.has(elementName)) elements.set(elementName, [])
      elements.get(elementName).push(attributes)
    }

    offset += size
    if (size <= 0) break
  }

  return { elements, stringPool }
}

/**
 * Extracts the resource id of the launcher icon from AndroidManifest.xml.
 */
export function findManifestIconResId(manifestBuf) {
  const { elements } = collectXmlElementAttributes(manifestBuf)
  const application = elements.get('application')
  if (!application) return null

  for (const attributes of application) {
    for (const attr of attributes) {
      if (attr.name === 'icon' && attr.dataType === VALUE_TYPE_REFERENCE) {
        return attr.data
      }
    }
  }

  return null
}

/**
 * Extracts background/foreground resource ids from an adaptive-icon XML,
 * where they appear as child elements of <adaptive-icon>.
 */
export function findAdaptiveLayerResIds(xmlBuf) {
  const { elements } = collectXmlElementAttributes(xmlBuf)

  const result = { background: null, foreground: null }

  for (const layer of ['background', 'foreground']) {
    for (const attributes of elements.get(layer) || []) {
      for (const attr of attributes) {
        if (attr.dataType !== VALUE_TYPE_REFERENCE) continue
        if (attr.name === layer) result[layer] = attr.data
      }
    }
  }

  if (!result.background && !result.foreground) return null
  return result
}

/* ------------------------------ ARSC ----------------------------------- */

function parseArsc(arscBuf) {
  const globalStrings = []

  const packages = [] // { id, types: Map<typeId, Map<entryIndex, Array<{ density, dataType, data }>>> }

  let offset = 12 // skip RES_TABLE_TYPE header (8) + packageCount (4)

  while (offset < arscBuf.length - 4) {
    const type = arscBuf.readUInt16LE(offset)
    const headerSize = arscBuf.readUInt16LE(offset + 2)
    const size = arscBuf.readUInt32LE(offset + 4)

    if (type === PKG_TYPE_STRING_POOL) {
      globalStrings.push(...parseStringPool(arscBuf, offset))
    }
    else if (type === PKG_TYPE_PACKAGE) {
      const packageId = arscBuf.readUInt32LE(offset + 8)
      const types = new Map()

      let inner = offset + headerSize

      while (inner < offset + size - 4) {
        const innerType = arscBuf.readUInt16LE(inner)
        const innerHeaderSize = arscBuf.readUInt16LE(inner + 2)
        const innerSize = arscBuf.readUInt32LE(inner + 4)

        if (innerType === PKG_TYPE_TYPE) {
          const typeId = arscBuf[inner + 8]
          const entryCount = arscBuf.readUInt32LE(inner + 12)
          const entriesStart = arscBuf.readUInt32LE(inner + 16)
          const configSize = arscBuf.readUInt32LE(inner + 20)

          // ResTable_config density: u16 at config+14
          let density = 0
          if (configSize >= 16) density = arscBuf.readUInt16LE(inner + 20 + 14)

          if (!types.has(typeId)) types.set(typeId, new Map())
          const entries = types.get(typeId)

          for (let i = 0; i < entryCount; i++) {
            const entryOffset = arscBuf.readUInt32LE(inner + innerHeaderSize + i * 4)
            if (entryOffset === 0xffffffff) continue

            const entryPos = inner + entriesStart + entryOffset
            if (entryPos + 8 > arscBuf.length) continue

            const flags = arscBuf.readUInt16LE(entryPos + 2)
            if (flags & 0x0001) continue // COMPLEX (bag) values are not file paths

            const valuePos = entryPos + 8
            const dataType = arscBuf[valuePos + 3]
            const data = arscBuf.readUInt32LE(valuePos + 4)

            const list = entries.get(i) || []
            list.push({ density, dataType, data })
            entries.set(i, list)
          }
        }

        if (innerSize <= 0) break
        inner += innerSize
      }

      packages.push({ id: packageId, types })
    }

    if (size <= 0) break
    offset += size
  }

  return { globalStrings, packages }
}

function rankDensity(density) {
  // 0 (default) and DENSITY_NONE/ANY rank lowest; real densities rank by value
  if (!density || density >= 0xfffe) return 0
  return density
}

function resolveResourcePath(arsc, resId, { preferExt = '.png' } = {}) {
  const packageId = (resId >>> 24) & 0xff
  const typeId = (resId >>> 16) & 0xff
  const entryIndex = resId & 0xffff

  const pkg = arsc.packages.find(p => p.id === packageId)
  if (!pkg) return null

  const entries = pkg.types.get(typeId)
  if (!entries || !entries.has(entryIndex)) return null

  const candidates = entries.get(entryIndex)
    .filter(item => item.dataType === VALUE_TYPE_STRING)
    .map(item => ({
      path: arsc.globalStrings[item.data] ?? '',
      density: rankDensity(item.density),
    }))
    .filter(item => !!item.path)

  if (!candidates.length) return null

  // 1) prefer preferred extension, 2) prefer highest density
  candidates.sort((a, b) => {
    const extA = path.extname(a.path).toLowerCase() === preferExt ? 1 : 0
    const extB = path.extname(b.path).toLowerCase() === preferExt ? 1 : 0
    if (extA !== extB) return extB - extA
    return b.density - a.density
  })

  return candidates[0].path
}

/* ------------------------------ PNG codec ------------------------------ */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
  }
  let crc = -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

/**
 * Decodes a non-interlaced 8-bit PNG (color type 6 = RGBA, 2 = RGB) into RGBA.
 */
export function decodePng(buf) {
  if (!buf.slice(0, 8).equals(PNG_SIGNATURE)) return null

  let offset = 8
  let width = 0
  let height = 0
  let colorType = 0
  const idat = []

  while (offset + 8 <= buf.length) {
    const length = buf.readUInt32BE(offset)
    const type = buf.toString('ascii', offset + 4, offset + 8)

    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8)
      height = buf.readUInt32BE(offset + 12)
      const bitDepth = buf[offset + 16]
      colorType = buf[offset + 17]
      const interlace = buf[offset + 20]
      if (bitDepth !== 8 || interlace !== 0) return null
      if (colorType !== 6 && colorType !== 2) return null
    }
    else if (type === 'IDAT') {
      idat.push(buf.slice(offset + 8, offset + 8 + length))
    }
    else if (type === 'IEND') {
      break
    }

    offset += 12 + length
  }

  if (!width || !height) return null
  const channels = colorType === 6 ? 4 : 3
  const bpp = channels

  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = width * bpp
  const out = Buffer.alloc(width * height * 4)

  let prev = Buffer.alloc(stride)

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1)
    const filter = raw[rowStart]
    const row = raw.slice(rowStart + 1, rowStart + 1 + stride)

    const decoded = Buffer.alloc(stride)

    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? decoded[x - bpp] : 0
      const b = prev[x]
      const c = x >= bpp ? prev[x - bpp] : 0

      let value = row[x]
      if (filter === 1) value = (value + a) & 0xff
      else if (filter === 2) value = (value + b) & 0xff
      else if (filter === 3) value = (value + ((a + b) >> 1)) & 0xff
      else if (filter === 4) value = (value + paeth(a, b, c)) & 0xff

      decoded[x] = value
    }

    for (let x = 0; x < width; x++) {
      const src = x * bpp
      const dst = (y * width + x) * 4
      out[dst] = decoded[src]
      out[dst + 1] = decoded[src + 1]
      out[dst + 2] = decoded[src + 2]
      out[dst + 3] = bpp === 4 ? decoded[src + 3] : 0xff
    }

    prev = decoded
  }

  return { width, height, rgba: out }
}

/**
 * Encodes RGBA pixels into a PNG buffer (filter 0 rows).
 */
export function encodePng(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)

  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  const chunks = []

  function pushChunk(type, data) {
    const header = Buffer.alloc(8)
    header.writeUInt32BE(data.length, 0)
    header.write(type, 4, 'ascii')
    const body = Buffer.concat([header.slice(4), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body), 0)
    chunks.push(header, data, crc)
  }

  chunks.push(PNG_SIGNATURE)

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  pushChunk('IHDR', ihdr)

  pushChunk('IDAT', zlib.deflateSync(raw, { level: 9 }))
  pushChunk('IEND', Buffer.alloc(0))

  return Buffer.concat(chunks)
}

/* --------------------------- pixel utilities --------------------------- */

function resizeRgba(image, targetSize) {
  const { width, height, rgba } = image
  if (width === targetSize && height === targetSize) return image

  const out = Buffer.alloc(targetSize * targetSize * 4)

  for (let y = 0; y < targetSize; y++) {
    const sy0 = Math.floor((y * height) / targetSize)
    const sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * height) / targetSize))

    for (let x = 0; x < targetSize; x++) {
      const sx0 = Math.floor((x * width) / targetSize)
      const sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * width) / targetSize))

      let r = 0
      let g = 0
      let b = 0
      let a = 0
      let count = 0

      for (let sy = sy0; sy < sy1 && sy < height; sy++) {
        for (let sx = sx0; sx < sx1 && sx < width; sx++) {
          const src = (sy * width + sx) * 4
          r += rgba[src]
          g += rgba[src + 1]
          b += rgba[src + 2]
          a += rgba[src + 3]
          count++
        }
      }

      if (!count) count = 1
      const dst = (y * targetSize + x) * 4
      out[dst] = r / count
      out[dst + 1] = g / count
      out[dst + 2] = b / count
      out[dst + 3] = a / count
    }
  }

  return { width: targetSize, height: targetSize, rgba: out }
}

/**
 * Composites background and foreground layers the way a launcher renders an
 * adaptive icon: both layers are full-bleed 108dp images of which only the
 * center 72dp (2/3) is visible; the visible area gets rounded corners.
 */
function compositeAdaptiveIcon(background, foreground) {
  const size = Math.min(background.width, background.height)
  const visible = Math.floor(size * (72 / 108))

  const canvas = Buffer.alloc(visible * visible * 4)

  const offsetX = Math.floor((background.width - visible) / 2)
  const offsetY = Math.floor((background.height - visible) / 2)

  for (let y = 0; y < visible; y++) {
    for (let x = 0; x < visible; x++) {
      const dst = (y * visible + x) * 4

      // background (opaque expected)
      const bs = ((y + offsetY) * background.width + (x + offsetX)) * 4
      canvas[dst] = background.rgba[bs]
      canvas[dst + 1] = background.rgba[bs + 1]
      canvas[dst + 2] = background.rgba[bs + 2]
      canvas[dst + 3] = background.rgba[bs + 3]

      // foreground (alpha-over)
      const fs = ((y + offsetY) * foreground.width + (x + offsetX)) * 4
      const fa = foreground.rgba[fs + 3] / 255
      if (fa > 0) {
        canvas[dst] = foreground.rgba[fs] * fa + canvas[dst] * (1 - fa)
        canvas[dst + 1] = foreground.rgba[fs + 1] * fa + canvas[dst + 1] * (1 - fa)
        canvas[dst + 2] = foreground.rgba[fs + 2] * fa + canvas[dst + 2] * (1 - fa)
        canvas[dst + 3] = Math.max(canvas[dst + 3], foreground.rgba[fs + 3])
      }
    }
  }

  // rounded corners
  const radius = Math.floor(visible * 0.22)
  const r2 = radius * radius
  const inner = visible - radius

  for (let y = 0; y < visible; y++) {
    for (let x = 0; x < visible; x++) {
      const inCornerX = x < radius || x >= inner
      const inCornerY = y < radius || y >= inner
      if (!inCornerX || !inCornerY) continue

      // distance to the circle center of this corner; squared so signs cancel
      const cx = x < radius ? radius : inner
      const cy = y < radius ? radius : inner
      const dx = x - cx
      const dy = y - cy
      const dist = dx * dx + dy * dy

      if (dist > r2) {
        canvas[(y * visible + x) * 4 + 3] = 0
      }
    }
  }

  return { width: visible, height: visible, rgba: canvas }
}

/* -------------------------------- ICO ---------------------------------- */

/**
 * Wraps a square PNG (<= 256px) into a single-entry .ico container
 * (PNG-compressed entry, supported since Windows Vista).
 */
export function pngToIco(pngBuf) {
  const image = decodePng(pngBuf)
  if (!image) return null

  const size = Math.min(image.width, image.height, 256)
  const normalized = resizeRgba(image, size)
  const png = encodePng(normalized.width, normalized.height, normalized.rgba)

  const ico = Buffer.alloc(6 + 16 + png.length)
  ico.writeUInt16LE(0, 0) // reserved
  ico.writeUInt16LE(1, 2) // type: icon
  ico.writeUInt16LE(1, 4) // count

  const entry = 6
  ico[entry] = size % 256 // width
  ico[entry + 1] = size % 256 // height
  ico[entry + 2] = 0 // palette
  ico[entry + 3] = 0 // reserved
  ico.writeUInt16LE(1, entry + 4) // planes
  ico.writeUInt16LE(32, entry + 6) // bpp
  ico.writeUInt32LE(png.length, entry + 8)
  ico.writeUInt32LE(22, entry + 12) // data offset

  png.copy(ico, 22)

  return ico
}

/* ------------------------------ extractor ------------------------------ */

/**
 * Extracts the launcher icon of an APK buffer as an ICO buffer (or null).
 */
export function extractIconIcoFromApkBuffer(apkBuf) {
  const manifest = readZipEntry(apkBuf, 'AndroidManifest.xml')
  if (!manifest) return null

  const arscBuf = readZipEntry(apkBuf, 'resources.arsc')
  if (!arscBuf) return null

  const iconResId = findManifestIconResId(manifest)
  if (!iconResId) return null

  const arsc = parseArsc(arscBuf)

  const decodeBestPng = (resId) => {
    const resPath = resolveResourcePath(arsc, resId)
    if (!resPath || !resPath.toLowerCase().endsWith('.png')) return null
    const fileBuf = readZipEntry(apkBuf, resPath)
    if (!fileBuf) return null
    return decodePng(fileBuf)
  }

  let png = null

  const iconPath = resolveResourcePath(arsc, iconResId)

  if (iconPath && iconPath.toLowerCase().endsWith('.xml')) {
    // adaptive icon
    const xmlBuf = readZipEntry(apkBuf, iconPath)
    const layers = xmlBuf && findAdaptiveLayerResIds(xmlBuf)
    if (!layers) return null

    const background = layers.background && decodeBestPng(layers.background)
    const foreground = layers.foreground && decodeBestPng(layers.foreground)
    if (!background || !foreground) return null

    png = compositeAdaptiveIcon(background, foreground)
  }
  else if (iconPath && iconPath.toLowerCase().endsWith('.png')) {
    const fileBuf = readZipEntry(apkBuf, iconPath)
    if (!fileBuf) return null
    png = decodePng(fileBuf)
  }

  if (!png) return null

  return pngToIco(encodePng(png.width, png.height, png.rgba))
}

/**
 * Pulls an APK from a device via the adb middleware, extracts its launcher
 * icon and caches it as .ico.
 *
 * @param {{ adb: object, id: string, packageName: string, cacheDir?: string }} options
 * @returns {Promise<string|null>} absolute .ico path, or null when unavailable
 */
export async function createAppIcon(options = {}) {
  const { adb, id, packageName, cacheDir = path.join(os.tmpdir(), 'escrcpy', 'app-icons') } = options
  if (!adb || !id || !packageName) return null

  try {
    fs.mkdirSync(cacheDir, { recursive: true })

    const iconPath = path.join(cacheDir, `${packageName}.ico`)
    if (fs.existsSync(iconPath)) return iconPath

    const { stdout } = await adb.shell(`-s ${id} shell pm path ${packageName}`)
    const line = String(stdout || '')
      .split('\n')
      .map(l => l.trim())
      .find(l => l.startsWith('package:') && l.includes('base.apk'))
      || String(stdout || '')
        .split('\n')
        .map(l => l.trim())
        .find(l => l.startsWith('package:'))

    if (!line) return null
    const deviceApkPath = line.slice('package:'.length)
    if (!deviceApkPath) return null

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'escrcpy-icon-'))

    try {
      const apkPath = await adb.pull(id, deviceApkPath, { saveDir: tmpDir })
      const apkBuf = fs.readFileSync(apkPath)
      const icoBuf = extractIconIcoFromApkBuffer(apkBuf)
      if (!icoBuf) return null

      fs.writeFileSync(iconPath, icoBuf)
      return iconPath
    }
    finally {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  }
  catch (error) {
    console.warn('[escrcpy] app icon extraction failed:', error?.message)
    return null
  }
}
