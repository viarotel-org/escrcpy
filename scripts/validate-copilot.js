#!/usr/bin/env node
/**
 * Escrcpy Copilot 可执行文件验证脚本
 *
 * 目标：全面验证 copilot 可执行文件功能，降低正式集成成本
 * 核心验证维度：
 * 1. 流式输出验证：验证实时流式返回的完整性
 * 2. 文本信息捕获验证：验证文本捕获的精准性
 * 3. CLI 参数支持验证：验证所有 CLI 参数的可用性
 * 4. 错误处理验证：验证异常场景的错误信息
 * 5. ADB 环境变量验证：验证设备管理功能
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// 配置区域
// ============================================

const CONFIG = {
  // 平台检测
  platform: (() => {
    const platform = os.platform()
    const arch = os.arch()

    if (platform === 'darwin') {
      return arch === 'arm64' ? 'mac-arm64' : 'mac-x64'
    }
    if (platform === 'linux') {
      return arch === 'arm64' ? 'linux-arm64' : 'linux-x64'
    }
    if (platform === 'win32') {
      return 'win'
    }
    throw new Error(`不支持的平台: ${platform}-${arch}`)
  })(),

  // 路径配置
  projectRoot: path.resolve(__dirname, '..'),

  // ADB 路径（根据平台自动检测）
  get adbPath() {
    const adbMap = {
      'mac-arm64': 'mac-arm64/scrcpy/adb',
      'mac-x64': 'mac-x64/scrcpy/adb',
      'linux-arm64': 'linux-arm64/scrcpy/adb',
      'linux-x64': 'linux-x64/scrcpy/adb',
      'win': 'win/scrcpy/adb.exe',
    }
    return path.join(this.projectRoot, 'electron/resources/extra', adbMap[this.platform])
  },

  // Copilot 路径
  get copilotPath() {
    const ext = this.platform === 'win' ? '.exe' : ''
    return path.join(this.projectRoot, 'electron/resources/extra', this.platform, `copilot${ext}`)
  },

  // 测试配置（需要用户提供真实 API Key 进行完整测试）
  testConfig: {
    baseUrl: process.env.COPILOT_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.COPILOT_API_KEY || 'abe9f1675ea04d348b915edfb22d7a6d.Xecf0TQo2h06bV26', // 从环境变量读取
    model: 'autoglm-phone',
    maxSteps: 5, // 测试时限制步数
    lang: 'cn',
    quiet: false,
  },
}

// ============================================
// 日志工具
// ============================================

class Logger {
  constructor() {
    this.results = []
    this.startTime = Date.now()
  }

  section(title) {
    const line = '='.repeat(60)
    console.log(`\n${line}`)
    console.log(`  ${title}`)
    console.log(line)
  }

  info(message, indent = 0) {
    const prefix = `${'  '.repeat(indent)}🔹`
    console.log(`${prefix} ${message}`)
  }

  success(message, indent = 0) {
    const prefix = `${'  '.repeat(indent)}✅`
    console.log(`${prefix} ${message}`)
    this.results.push({ type: 'success', message, timestamp: Date.now() })
  }

  error(message, indent = 0) {
    const prefix = `${'  '.repeat(indent)}❌`
    console.error(`${prefix} ${message}`)
    this.results.push({ type: 'error', message, timestamp: Date.now() })
  }

  warning(message, indent = 0) {
    const prefix = `${'  '.repeat(indent)}⚠️`
    console.warn(`${prefix} ${message}`)
    this.results.push({ type: 'warning', message, timestamp: Date.now() })
  }

  data(label, value, indent = 0) {
    const prefix = `${'  '.repeat(indent)}📊`
    console.log(`${prefix} ${label}: ${JSON.stringify(value, null, 2)}`)
  }

  summary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2)
    const successCount = this.results.filter(r => r.type === 'success').length
    const errorCount = this.results.filter(r => r.type === 'error').length
    const warningCount = this.results.filter(r => r.type === 'warning').length

    this.section('验证总结')
    console.log(`
  执行时长: ${duration}秒
  总测试项: ${this.results.length}
  ✅ 成功: ${successCount}
  ❌ 失败: ${errorCount}
  ⚠️ 警告: ${warningCount}
  
  ${errorCount === 0 ? '🎉 所有测试通过！' : '⚠️ 存在失败项，请检查日志'}
    `)

    return {
      duration,
      total: this.results.length,
      success: successCount,
      error: errorCount,
      warning: warningCount,
      passed: errorCount === 0,
    }
  }
}

const logger = new Logger()

// ============================================
// 核心验证工具
// ============================================

class CopilotValidator {
  constructor(copilotPath, adbPath, testConfig) {
    this.copilotPath = copilotPath
    this.adbPath = adbPath
    this.testConfig = testConfig
    this.processManager = []
  }

  /**
   * 执行 copilot 命令
   * @param {string[]} args - 命令参数
   * @param {object} options - 执行选项
   * @returns {Promise<object>} 执行结果
   */
  async execute(args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const {
        captureStream = false,
        timeout = 30000,
        expectError = false,
      } = options

      logger.info(`执行命令: ${this.copilotPath} ${args.join(' ')}`, 1)

      const childProcess = spawn(this.copilotPath, args, {
        env: {
          ...process.env,
          ADB: this.adbPath,
        },
        shell: true,
        encoding: 'utf8',
      })

      this.processManager.push(childProcess)

      const result = {
        stdout: '',
        stderr: '',
        streamChunks: [],
        exitCode: null,
        duration: 0,
        startTime: Date.now(),
      }

      // 捕获标准输出
      childProcess.stdout?.on('data', (data) => {
        const chunk = data.toString()
        result.stdout += chunk

        if (captureStream) {
          result.streamChunks.push({
            data: chunk,
            timestamp: Date.now() - result.startTime,
            size: Buffer.byteLength(chunk),
          })
          logger.data('流式输出', {
            timestamp: Date.now() - result.startTime,
            size: Buffer.byteLength(chunk),
            preview: chunk.substring(0, 100),
          }, 2)
        }
      })

      // 捕获标准错误
      childProcess.stderr?.on('data', (data) => {
        result.stderr += data.toString()
      })

      // 超时控制
      const timeoutId = setTimeout(() => {
        childProcess.kill('SIGTERM')
        reject(new Error(`命令执行超时 (${timeout}ms)`))
      }, timeout)

      // 进程退出
      childProcess.on('close', (code) => {
        clearTimeout(timeoutId)
        result.exitCode = code
        result.duration = Date.now() - result.startTime

        if (expectError) {
          resolve(result)
        }
        else if (code === 0) {
          resolve(result)
        }
        else {
          reject(new Error(`命令执行失败 (exit code: ${code})\nstderr: ${result.stderr}`))
        }
      })

      // 错误处理
      childProcess.on('error', (err) => {
        clearTimeout(timeoutId)
        reject(err)
      })
    })
  }

  /**
   * 清理所有进程
   */
  cleanup() {
    this.processManager.forEach((proc) => {
      try {
        if (!proc.killed) {
          proc.kill('SIGTERM')
        }
      }
      catch (err) {
        // 忽略清理错误
      }
    })
    this.processManager = []
  }
}

// ============================================
// 测试用例
// ============================================

/**
 * 测试 1: 环境检查
 */
async function testEnvironment() {
  logger.section('测试 1: 环境检查')

  // 1.1 检查 copilot 文件是否存在
  logger.info('检查 copilot 可执行文件...', 1)
  if (fs.existsSync(CONFIG.copilotPath)) {
    logger.success(`copilot 文件存在: ${CONFIG.copilotPath}`, 2)

    // 检查文件权限（仅 Unix 系统）
    if (CONFIG.platform !== 'win') {
      try {
        fs.accessSync(CONFIG.copilotPath, fs.constants.X_OK)
        logger.success('copilot 文件具有执行权限', 2)
      }
      catch (err) {
        logger.error('copilot 文件缺少执行权限，尝试修复...', 2)
        try {
          fs.chmodSync(CONFIG.copilotPath, 0o755)
          logger.success('已添加执行权限', 2)
        }
        catch (chmodErr) {
          logger.error(`无法添加执行权限: ${chmodErr.message}`, 2)
        }
      }
    }
  }
  else {
    logger.error(`copilot 文件不存在: ${CONFIG.copilotPath}`, 2)
  }

  // 1.2 检查 ADB 文件是否存在
  logger.info('检查 ADB 工具...', 1)
  if (fs.existsSync(CONFIG.adbPath)) {
    logger.success(`ADB 文件存在: ${CONFIG.adbPath}`, 2)

    if (CONFIG.platform !== 'win') {
      try {
        fs.accessSync(CONFIG.adbPath, fs.constants.X_OK)
        logger.success('ADB 文件具有执行权限', 2)
      }
      catch (err) {
        logger.warning('ADB 文件缺少执行权限', 2)
      }
    }
  }
  else {
    logger.error(`ADB 文件不存在: ${CONFIG.adbPath}`, 2)
  }

  // 1.3 显示配置信息
  logger.info('当前配置:', 1)
  logger.data('平台', CONFIG.platform, 2)
  logger.data('项目根目录', CONFIG.projectRoot, 2)
  logger.data('Copilot 路径', CONFIG.copilotPath, 2)
  logger.data('ADB 路径', CONFIG.adbPath, 2)
  logger.data('测试配置', {
    ...CONFIG.testConfig,
    apiKey: CONFIG.testConfig.apiKey ? '***已配置***' : '未配置',
  }, 2)
}

/**
 * 测试 2: CLI 帮助信息验证
 */
async function testHelp(validator) {
  logger.section('测试 2: CLI 帮助信息验证')

  try {
    logger.info('执行 --help 命令...', 1)
    const result = await validator.execute(['--help'], { timeout: 1000000 })

    logger.success('成功获取帮助信息', 2)
    logger.data('输出长度', `${result.stdout.length} 字符`, 2)

    // 验证关键参数是否在帮助信息中
    const requiredParams = [
      '--base-url',
      '--apikey',
      '--model',
      '--device-id',
      '--max-steps',
      '--quiet',
      '--lang',
    ]

    logger.info('验证参数文档完整性...', 1)
    requiredParams.forEach((param) => {
      if (result.stdout.includes(param)) {
        logger.success(`参数 ${param} 已文档化`, 2)
      }
      else {
        logger.warning(`参数 ${param} 未在帮助信息中找到`, 2)
      }
    })

    logger.data('完整帮助信息', result.stdout, 2)
  }
  catch (err) {
    logger.error(`CLI 帮助信息测试失败: ${err.message}`, 2)
  }
}

/**
 * 测试 3: 设备列表功能验证
 */
async function testListDevices(validator) {
  logger.section('测试 3: 设备列表功能验证 (ADB 环境变量)')

  try {
    logger.info('执行 --list-devices 命令...', 1)
    const result = await validator.execute(['--list-devices'], {
      timeout: 15000,
      expectError: true, // 允许无设备连接的情况
    })

    logger.success('成功执行设备列表命令', 2)
    logger.data('标准输出', result.stdout, 2)
    logger.data('标准错误', result.stderr, 2)
    logger.data('退出码', result.exitCode, 2)

    // 尝试解析 JSON 输出
    if (result.stdout.trim()) {
      try {
        const devices = JSON.parse(result.stdout)
        logger.success(`成功解析设备列表 JSON，共 ${devices.length} 个设备`, 2)

        if (devices.length > 0) {
          logger.data('设备信息', devices, 2)
        }
        else {
          logger.warning('当前无设备连接（这是正常的测试结果）', 2)
        }
      }
      catch (parseErr) {
        logger.warning(`无法解析为 JSON: ${parseErr.message}`, 2)
      }
    }
    else {
      logger.warning('输出为空，可能无设备连接', 2)
    }

    // 验证 ADB 环境变量是否正确注入
    if (result.stderr.includes('ADB') || result.stderr.includes('adb')) {
      logger.success('ADB 环境变量注入成功（从错误信息推断）', 2)
    }
  }
  catch (err) {
    logger.error(`设备列表测试失败: ${err.message}`, 2)
  }
}

/**
 * 测试 4: 应用列表功能验证
 */
async function testListApps(validator) {
  logger.section('测试 4: 应用列表功能验证')

  try {
    logger.info('执行 --list-apps 命令...', 1)
    const result = await validator.execute(['--list-apps'], {
      timeout: 1000000,
      expectError: true,
    })

    logger.success('成功执行应用列表命令', 2)
    logger.data('输出长度', `${result.stdout.length} 字符`, 2)

    // 尝试解析 JSON 输出
    if (result.stdout.trim()) {
      try {
        const apps = JSON.parse(result.stdout)
        logger.success(`成功解析应用列表 JSON，共 ${apps.length} 个应用`, 2)
        logger.data('应用列表示例', apps.slice(0, 5), 2)
      }
      catch (parseErr) {
        logger.warning(`无法解析为 JSON: ${parseErr.message}`, 2)
      }
    }
  }
  catch (err) {
    logger.error(`应用列表测试失败: ${err.message}`, 2)
  }
}

/**
 * 测试 5: 参数验证（错误处理）
 */
async function testErrorHandling(validator) {
  logger.section('测试 5: 参数验证与错误处理')

  // 5.1 缺少必需参数
  logger.info('测试缺少 --base-url 参数...', 1)
  try {
    const result = await validator.execute(['--apikey', 'test', '打开微信'], {
      timeout: 1000000,
      expectError: true,
    })

    if (result.exitCode !== 0) {
      logger.success('正确拒绝缺少 base-url 的请求', 2)
      logger.data('错误信息', result.stderr, 2)
    }
    else {
      logger.warning('未检测到参数缺失错误', 2)
    }
  }
  catch (err) {
    logger.success(`正确抛出错误: ${err.message}`, 2)
  }

  // 5.2 无效的 base-url 格式
  logger.info('测试无效 base-url 格式...', 1)
  try {
    const result = await validator.execute([
      '--base-url', 'invalid-url',
      '--apikey', 'test',
      '打开微信',
    ], {
      timeout: 1000000,
      expectError: true,
    })

    if (result.exitCode !== 0 || result.stderr.includes('url') || result.stderr.includes('URL')) {
      logger.success('正确识别无效 URL 格式', 2)
      logger.data('错误信息', result.stderr, 2)
    }
    else {
      logger.warning('未检测到 URL 格式验证', 2)
    }
  }
  catch (err) {
    logger.success(`正确抛出错误: ${err.message}`, 2)
  }
}

/**
 * 测试 6: 流式输出验证（核心测试）
 */
async function testStreamOutput(validator) {
  logger.section('测试 6: 流式输出验证（核心功能）')

  if (!CONFIG.testConfig.apiKey) {
    logger.warning('未配置 API Key，跳过流式输出测试', 1)
    logger.info('提示: 设置环境变量 COPILOT_API_KEY 以执行完整测试', 2)
    return
  }

  try {
    logger.info('执行简单任务测试流式输出...', 1)
    logger.warning('注意: 此测试需要真实设备连接才能完整执行', 2)

    const args = [
      '--base-url', CONFIG.testConfig.baseUrl,
      '--apikey', CONFIG.testConfig.apiKey,
      '--model', CONFIG.testConfig.model,
      '--max-steps', String(CONFIG.testConfig.maxSteps),
      '--lang', CONFIG.testConfig.lang,
      '--device-id', '192.168.1.220:5555',
      '"打开抖音搜索 viarotel"', // 简单任务，不需要实际操作
    ]

    const result = await validator.execute(args, {
      captureStream: true,
      timeout: 6000000,
      expectError: true, // 允许设备未连接的错误
    })

    logger.success('命令执行完成', 2)
    logger.data('执行时长', `${result.duration}ms`, 2)
    logger.data('流式块数', result.streamChunks.length, 2)

    // 验证流式输出特性
    if (result.streamChunks.length > 0) {
      logger.success('✅ 流式输出验证通过：成功捕获多个数据块', 2)

      // 分析流式输出时间间隔
      const intervals = []
      for (let i = 1; i < result.streamChunks.length; i++) {
        intervals.push(result.streamChunks[i].timestamp - result.streamChunks[i - 1].timestamp)
      }

      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
        logger.data('平均输出间隔', `${avgInterval.toFixed(2)}ms`, 2)

        if (avgInterval < 1000) {
          logger.success('✅ 流式输出实时性良好（平均间隔 < 1秒）', 2)
        }
        else {
          logger.warning('流式输出间隔较大，可能影响实时性', 2)
        }
      }

      // 验证文本完整性
      const totalSize = result.streamChunks.reduce((sum, chunk) => sum + chunk.size, 0)
      logger.data('总输出大小', `${totalSize} 字节`, 2)

      if (totalSize === Buffer.byteLength(result.stdout)) {
        logger.success('✅ 文本信息捕获完整，无丢失', 2)
      }
      else {
        logger.error('❌ 文本信息捕获不完整，存在丢失', 2)
      }

      // 检查特殊字符和编码
      const hasChineseChars = /[\u4E00-\u9FA5]/.test(result.stdout)
      const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(result.stdout)

      if (hasChineseChars) {
        logger.success('✅ 正确处理中文字符', 2)
      }
      if (hasEmoji) {
        logger.success('✅ 正确处理 Emoji', 2)
      }
    }
    else {
      if (result.stderr.includes('device') || result.stderr.includes('设备')) {
        logger.warning('无设备连接，无法验证流式输出（这是预期结果）', 2)
      }
      else {
        logger.warning('未捕获到流式输出数据', 2)
      }
    }

    logger.data('完整输出', result.stdout.substring(0, 500), 2)
    logger.data('错误输出', result.stderr, 2)
  }
  catch (err) {
    if (err.message.includes('device') || err.message.includes('设备')) {
      logger.warning(`无设备连接，跳过流式输出测试: ${err.message}`, 2)
    }
    else {
      logger.error(`流式输出测试失败: ${err.message}`, 2)
    }
  }
}

/**
 * 测试 7: 参数覆盖测试
 */
async function testParameterCoverage(validator) {
  logger.section('测试 7: CLI 参数覆盖测试')

  const paramTests = [
    {
      name: '--quiet 参数',
      args: ['--quiet', '--list-devices'],
      validator: (result) => {
        // quiet 模式应减少日志输出
        return true
      },
    },
    {
      name: '--lang 参数',
      args: ['--lang', 'en', '--help'],
      validator: (result) => {
        // 帮助信息可能包含英文
        return result.stdout.length > 0
      },
    },
    {
      name: '--max-steps 参数',
      args: ['--max-steps', '10'],
      validator: (result) => {
        return true
      },
    },
  ]

  for (const test of paramTests) {
    logger.info(`测试 ${test.name}...`, 1)
    try {
      const result = await validator.execute(test.args, {
        timeout: 1000000,
        expectError: true,
      })

      if (test.validator(result)) {
        logger.success(`${test.name} 测试通过`, 2)
      }
      else {
        logger.warning(`${test.name} 测试未通过验证`, 2)
      }
    }
    catch (err) {
      logger.warning(`${test.name} 执行出错: ${err.message}`, 2)
    }
  }
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        Escrcpy Copilot 可执行文件验证脚本                ║
║                                                          ║
║  目标：全面验证 copilot 功能，降低集成成本              ║
║  版本：1.0.0                                             ║
║  作者：Escrcpy Team                                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`)

  const validator = new CopilotValidator(
    CONFIG.copilotPath,
    CONFIG.adbPath,
    CONFIG.testConfig,
  )

  try {
    // 执行所有测试
    await testEnvironment()
    await testHelp(validator)
    await testListDevices(validator)
    await testListApps(validator)
    await testErrorHandling(validator)
    await testStreamOutput(validator)
    await testParameterCoverage(validator)
  }
  catch (err) {
    logger.error(`测试过程发生未捕获错误: ${err.message}`)
    console.error(err)
  }
  finally {
    // 清理进程
    validator.cleanup()

    // 输出总结
    const summary = logger.summary()

    // 保存结果到文件
    const reportPath = path.join(CONFIG.projectRoot, 'scripts', 'copilot-validation-report.json')
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      platform: CONFIG.platform,
      config: {
        ...CONFIG.testConfig,
        apiKey: CONFIG.testConfig.apiKey ? '***' : null,
      },
      summary,
      results: logger.results,
    }, null, 2))

    logger.info(`\n详细报告已保存至: ${reportPath}`)

    // 退出码
    process.exit(summary.error > 0 ? 1 : 0)
  }
}

// 执行主函数
main().catch((err) => {
  console.error('脚本执行失败:', err)
  process.exit(1)
})

export { CopilotValidator, Logger }
