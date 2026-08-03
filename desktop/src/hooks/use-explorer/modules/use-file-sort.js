/**
 * @fileoverview File list sorting utilities
 * Provides configurable, stable sorting for file entries with Chinese pinyin support
 */

import { pinyin } from 'pinyin-pro'

/** @type {Map<string, string>} Pinyin cache — keyed by original file name */
const pinyinCache = new Map()

/**
 * Get normalized pinyin key for a file name
 * Results are cached per session to avoid repeated conversion
 * @param {string} name - File or directory name
 * @returns {string} Normalized sort key (lowercase, tone-free pinyin for CJK; lowercase for ASCII)
 */
function getPinyinKey(name) {
  if (pinyinCache.has(name)) {
    return pinyinCache.get(name)
  }

  const key = pinyin(name, { toneType: 'none' })
    .replaceAll(' ', '')
    .toLowerCase()

  pinyinCache.set(name, key)
  return key
}

/**
 * Compare two file entries
 * @param {import('../types.js').FileEntry & { __originalIndex?: number }} a
 * @param {import('../types.js').FileEntry & { __originalIndex?: number }} b
 * @param {import('../types.js').SortOptions} options
 * @returns {number}
 */
export function compareFileItems(a, b, options = {}) {
  const {
    sortBy = 'name',
    directoryFirst = true,
    direction = 'asc',
  } = options

  const dirMul = direction === 'asc' ? 1 : -1

  // 1. Directory-first grouping
  if (directoryFirst) {
    if (a.type === 'directory' && b.type !== 'directory') {
      return -1
    }
    if (a.type !== 'directory' && b.type === 'directory') {
      return 1
    }
  }

  // 2. Primary sort by chosen field
  let result = 0

  switch (sortBy) {
    case 'name': {
      const keyA = getPinyinKey(a.name)
      const keyB = getPinyinKey(b.name)
      result = keyA.localeCompare(keyB, undefined, { sensitivity: 'base' })
      break
    }
    case 'size': {
      result = (a.rawSize ?? 0) - (b.rawSize ?? 0)
      break
    }
    case 'updateTime': {
      const timeA = a.mtime
        ? new Date(a.mtime).getTime()
        : 0
      const timeB = b.mtime
        ? new Date(b.mtime).getTime()
        : 0
      result = timeA - timeB
      break
    }
    default: {
      const keyA = getPinyinKey(a.name)
      const keyB = getPinyinKey(b.name)
      result = keyA.localeCompare(keyB, undefined, { sensitivity: 'base' })
    }
  }

  // 3. Stable fallback — preserve original ADB order when sort keys are equal
  if (result === 0) {
    result = (a.__originalIndex ?? 0) - (b.__originalIndex ?? 0)
  }

  return result * dirMul
}

/**
 * Sort a file list according to the given options
 * Returns a new array — does not mutate the input
 * @param {import('../types.js').FileEntry[]} files - File entries from ADB
 * @param {import('../types.js').SortOptions} [options] - Sort configuration
 * @returns {import('../types.js').FileEntry[]} Sorted copy
 */
export function sortFileList(files, options = {}) {
  if (!files || files.length <= 1) {
    return files ? [...files] : []
  }

  // Tag original indices for stability
  const tagged = files.map((item, index) => ({ ...item, __originalIndex: index }))

  tagged.sort((a, b) => compareFileItems(a, b, options))

  // Strip helper property before returning
  for (const item of tagged) {
    delete item.__originalIndex
  }

  return tagged
}

/**
 * Create a pre-configured sorter function
 * Useful for reactive sort options that change over time
 * @param {import('../types.js').SortOptions} defaultOptions - Default sort options
 * @returns {(files: import('../types.js').FileEntry[], overrides?: import('../types.js').SortOptions) => import('../types.js').FileEntry[]}
 */
export function createFileSorter(defaultOptions = {}) {
  return (files, overrides = {}) => sortFileList(files, { ...defaultOptions, ...overrides })
}
