import { createProxy } from '$electron/helpers/index'
import { shell } from 'electron'
import log from 'electron-log/main.js'

log.transports.console.level = false

const levels = Object.keys(log.functions)

const getFilePath = () => log.transports.file.getFile()?.path

// Keep track of open file streams for cleanup
let fileStreams = []

// Safely execute file operations with error handling
const safeFileOperation = (operation) => {
  try {
    return operation()
  } catch (error) {
    // Handle EIO and other write errors gracefully
    console.error(`Log file operation error: ${error.message || error}`)
    return null
  }
}

// Cleanup function to properly close file streams
const cleanup = () => {
  if (fileStreams.length > 0) {
    for (const stream of fileStreams) {
      try {
        if (stream && typeof stream.end === 'function') {
          stream.end()
        }
      } catch (error) {
        console.error(`Error closing log stream: ${error.message || error}`)
      }
    }
    fileStreams = []
  }
}

// Wrap the original log functions to add error handling
const wrapLogFunction = (fn) => {
  return (...args) => {
    return safeFileOperation(() => fn(...args))
  }
}

// Intercept file transport creation to track streams
const originalFileTransport = log.transports.file.getFile
log.transports.file.getFile = function(...args) {
  const file = originalFileTransport.apply(log.transports.file, args)
  
  // Track any created file streams for cleanup
  if (file && file.stream && !fileStreams.includes(file.stream)) {
    fileStreams.push(file.stream)
  }
  
  return file
}

// Safe version of getFilePath
const safeGetFilePath = () => safeFileOperation(getFilePath)

// Create wrapped log functions
const wrappedFunctions = {}
levels.forEach(level => {
  wrappedFunctions[level] = wrapLogFunction(log.functions[level])
})

export default {
  ...createProxy(log, ['initialize', ...levels]),
  levels,
  functions: { ...wrappedFunctions },
  getFilePath: safeGetFilePath,
  openInEditor: () => safeFileOperation(() => shell.openPath(safeGetFilePath())),
  cleanup
}