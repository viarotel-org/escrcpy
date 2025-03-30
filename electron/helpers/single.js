import { app, BrowserWindow } from 'electron'

/**
 * 确保 Electron 应用只运行一个实例的工具函数
 * @typedef {Object} SingleInstanceOptions
 * @property {Function} [onSecondInstance] - 当第二个实例启动时的回调函数
 * @property {boolean} [enableSandbox=false] - 是否启用沙箱模式
 * @property {Function} [onSuccess] - 成功获取单例锁后的回调函数
 * @property {Function} [onShowWindow] - 主窗口已展示回调
 * @property {boolean} [forceFocus=true] - 是否强制聚焦已存在的窗口
 * @property {boolean} [silentMode=false] - 静默模式，不显示任何提示
 * @property {Function} [onError] - 错误处理回调函数
 */

/**
 * 第二个实例启动时的回调函数类型
 * @callback OnSecondInstanceCallback
 * @param {Event} event - Electron 事件对象
 * @param {string[]} commandLine - 命令行参数数组
 * @param {string} workingDirectory - 工作目录
 * @param {BrowserWindow|null} mainWindow - 主窗口实例，如果存在的话
 */

/**
 * 确保应用程序只运行单个实例
 * @param {SingleInstanceOptions} options - 配置选项
 * @returns {boolean} 是否成功获取单例锁
 *
 * @example
 * // 基础使用
 * ensureSingleInstance({
 *     onSuccess: () => {
 *         app.whenReady().then(createWindow)
 *     }
 * });
 *
 * @example
 * // 高级使用
 * ensureSingleInstance({
 *     onSecondInstance: (event, commandLine, workingDirectory, mainWindow) => {
 *         if (mainWindow) {
 *             mainWindow.webContents.send('new-instance-launched', commandLine);
 *         }
 *     },
 *     onSuccess: () => {
 *         console.log('Successfully acquired lock');
 *         createWindow();
 *     },
 *     onError: (error) => {
 *         console.error('Error in single instance check:', error);
 *     },
 *     forceFocus: true,
 *     silentMode: false
 * });
 *
 * @throws {Error} 如果在非 Electron 环境中调用
 */
function ensureSingleInstance(options = {}) {
  // 参数解构与默认值设置
  const {
    onSecondInstance,
    enableSandbox = false,
    onSuccess,
    onShowWindow,
    onError,
    forceFocus = true,
    silentMode = false,
  } = options

  // 验证运行环境
  if (!app || !BrowserWindow) {
    const error = new Error('ensureSingleInstance must be called in Electron environment')
    if (onError) {
      onError(error)
      return false
    }
    throw error
  }

  try {
    // 沙箱模式检查
    if (enableSandbox) {
      !silentMode && console.log('Sandbox mode enabled, skipping single instance check')
      onSuccess?.()
      return true
    }

    // 请求单例锁
    const gotTheLock = app.requestSingleInstanceLock()

    // 如果无法获取锁，说明已有实例在运行
    if (!gotTheLock) {
      !silentMode && console.log('Application instance already running, quitting...')
      app.quit()
      return false
    }

    // 监听第二个实例的启动
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      try {
        // 获取所有窗口
        const windows = BrowserWindow.getAllWindows()

        const mainWindow = windows.find(item => item.customId === 'mainWindow')

        const showWindowNext = () => {
          if (mainWindow) {
            if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
              mainWindow.show()
            }
            if (forceFocus) {
              mainWindow.focus()
            }
          }
        }

        // 处理窗口焦点
        if (onShowWindow) {
          onShowWindow?.(mainWindow, commandLine, showWindowNext)
        }
        else {
          showWindowNext()
        }

        // 调用用户自定义的回调
        onSecondInstance?.(event, commandLine, workingDirectory, mainWindow)
      }
      catch (error) {
        !silentMode && console.error('Error handling second instance:', error)
        onError?.(error)
      }
    })

    // 调用成功回调
    onSuccess?.()
    return true
  }
  catch (error) {
    !silentMode && console.error('Error in ensureSingleInstance:', error)
    onError?.(error)
    return false
  }
}

/**
 * 检查当前是否为应用程序的主实例
 * @returns {boolean} 如果是主实例返回 true，否则返回 false
 */
function isMainInstance() {
  return app.requestSingleInstanceLock()
}

/**
 * 释放单例锁，允许其他实例启动
 * @returns {void}
 */
function releaseSingleInstanceLock() {
  app.releaseSingleInstanceLock()
}

export {
  ensureSingleInstance,
  isMainInstance,
  releaseSingleInstanceLock,
}
