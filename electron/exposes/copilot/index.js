import { spawn } from 'node:child_process'
import { electronAPI } from '@electron-toolkit/preload'

import { adbPath, copilotDefaultConfig, copilotPath } from '$electron/configs/index.js'
import appStore from '$electron/helpers/store.js'
import { ProcessManager } from '$electron/helpers/index.js'

import {
  buildCopilotArgs,
  formatError,
  getCopilotConfig,
  parseAppList,
  parseDeviceList,
  setCopilotConfig,
} from './helper.js'

const appDebug = appStore.get('common.debug') || false

const processManager = new ProcessManager()

// 应用退出时自动清理进程（避免僵尸进程）
electronAPI.ipcRenderer.on('quit-before', () => {
  processManager.kill()
})

/**
 * 执行 Copilot 命令
 * @param {string} command - 命令参数字符串
 * @param {object} options - 选项
 * @param {function} options.stdout - stdout 回调
 * @param {function} options.stderr - stderr 回调
 * @param {number} options.timeout - 超时时间（毫秒），默认 300000（5分钟）
 * @returns {Promise<{output: string, exitCode: number}>}
 */
async function shell(command, { stdout, stderr, timeout = 300000 } = {}) {
  const spawnPath = appStore.get('common.copilotPath') || copilotPath
  const ADB = appStore.get('common.adbPath') || adbPath

  if (!spawnPath) {
    throw new Error(
      'Failed to retrieve Copilot dependency path. Please ensure that the dependency is installed correctly.',
    )
  }

  const args = Array.isArray(command) ? command : command.split(' ')

  // 清理代理环境变量，避免 Copilot 内置 Python 环境因缺少 socksio 包导致请求失败
  const cleanEnv = { ...process.env }
  const proxyVars = [
    'ALL_PROXY',
    'all_proxy',
    'HTTP_PROXY',
    'http_proxy',
    'HTTPS_PROXY',
    'https_proxy',
    'NO_PROXY',
    'no_proxy',
  ]
  proxyVars.forEach((key) => {
    delete cleanEnv[key]
  })

  // 关键：注入 ADB 环境变量，处理路径引号（跨平台兼容）
  const copilotProcess = spawn(`"${spawnPath}"`, args, {
    env: { ...cleanEnv, ADB },
    shell: true,
    encoding: 'utf8',
  })

  processManager.add(copilotProcess)

  const outputChunks = []
  const stderrChunks = []

  // 流式输出处理，支持多数据块捕获，无信息丢失
  copilotProcess.stdout.on('data', (data) => {
    const stringData = data.toString('utf8') // 确保中文正确显示
    outputChunks.push(stringData)

    if (stdout) {
      stdout(stringData, copilotProcess)
    }

    if (appDebug) {
      console.log('copilot.stdout:', stringData)
    }
  })

  copilotProcess.stderr.on('data', (data) => {
    const stringData = data.toString('utf8')
    stderrChunks.push(stringData)

    if (stderr) {
      stderr(stringData, copilotProcess)
    }

    if (appDebug) {
      console.error('copilot.stderr:', stringData)
    }
  })

  return new Promise((resolve, reject) => {
    let timeoutId

    // 设置超时
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        processManager.kill(copilotProcess)
        reject(new Error(`Copilot process timed out after ${timeout / 1000} seconds`))
      }, timeout)
    }

    copilotProcess.on('close', (code) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (code === 0) {
        resolve({
          output: outputChunks.join(''),
          exitCode: code,
        })
      }
      else {
        const errorMessage = stderrChunks.join('') || `Process exited with code ${code}`
        reject(new Error(errorMessage))
      }
    })

    copilotProcess.on('error', (err) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      reject(err)
    })
  })
}

/**
 * 执行任务（支持单设备/批量设备）
 * @param {string} task - 任务指令
 * @param {object} options - 选项
 * @param {string|string[]} options.deviceId - 设备ID（批量时传入数组）
 * @param {string} options.mode - 模式：single/batch
 * @param {function} options.onOutput - 实时输出回调
 * @param {number} options.maxSteps - 最大步数
 * @param {boolean} options.quiet - 静默模式
 * @returns {Promise<{output: string, exitCode: number}>}
 */
async function execute(task, options = {}) {
  const args = buildCopilotArgs(task, options)

  return shell(args, {
    stdout: options.onOutput,
    stderr: options.onError,
    timeout: options.timeout,
  })
}

/**
 * 列出已连接设备
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
async function listDevices() {
  const result = await shell(['--list-devices'])
  return parseDeviceList(result.output)
}

/**
 * 连接远程设备
 * @param {string} address - 设备地址（格式：IP:端口）
 * @returns {Promise<{output: string, exitCode: number}>}
 */
async function connect(address) {
  return shell(['--connect', address])
}

/**
 * 断开设备连接
 * @param {string} address - 设备地址，传 'all' 断开所有设备
 * @returns {Promise<{output: string, exitCode: number}>}
 */
async function disconnect(address = 'all') {
  return shell(['--disconnect', address])
}

/**
 * 启用 TCP/IP 调试
 * @param {string} deviceId - 设备ID
 * @param {number} port - 端口号，默认 5555
 * @returns {Promise<{output: string, exitCode: number}>}
 */
async function enableTcpip(deviceId, port = 5555) {
  const args = ['--enable-tcpip', String(port)]
  if (deviceId) {
    args.unshift('--device-id', deviceId)
  }
  return shell(args)
}

/**
 * 列出支持的应用列表
 * @returns {Promise<string[]>}
 */
async function listApps() {
  const result = await shell(['--list-apps'])
  return parseAppList(result.output)
}

/**
 * 停止当前任务（终止所有进程）
 */
function stop() {
  processManager.kill()
}

/**
 * 获取帮助信息
 * @returns {Promise<string>}
 */
async function getHelp() {
  const result = await shell(['--help'])
  return result.output
}

export default {
  // 任务执行
  execute,
  stop,

  // 设备管理
  listDevices,
  connect,
  disconnect,
  enableTcpip,

  // 应用管理
  listApps,

  // 配置管理
  getConfig: getCopilotConfig,
  setConfig: setCopilotConfig,
  getDefaultConfig: () => copilotDefaultConfig,

  // 工具函数
  getHelp,
  formatError,

  // 底层 shell（高级用法）
  shell,
}
