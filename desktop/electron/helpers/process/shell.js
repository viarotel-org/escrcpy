import { spawn } from 'node:child_process'
import treeKill from 'tree-kill'
import iconv from 'iconv-lite'
import { platform } from '@electron-toolkit/utils'

/**
 * Output encoding conversion
 * @param {string} encoding - Target encoding
 * @param {Buffer|string} data - Data
 * @returns {string} Converted string
 */
function convertOutputEncoding(encoding, data) {
  if (!data) {
    return ''
  }

  if (encoding === 'utf8') {
    return data.toString()
  }

  try {
    // 检测编码
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)
    return iconv.decode(buffer, encoding)
  }
  catch (error) {
    console.warn('[Terminal] Encoding conversion failed:', error.message)
    return data.toString()
  }
}

/**
 * Create process controller
 * @param {object} options - Options
 * @param {ChildProcess} options.process - Child process instance
 * @param {string} options.encoding - Output encoding
 * @param {Function} options.onStdout - stdout callback
 * @param {Function} options.onStderr - stderr callback
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onExit - Exit callback
 * @returns {object} Process controller
 */
function createProcessController({
  process,
  encoding = 'utf8',
  onStdout,
  onStderr,
  onSuccess,
  onError,
  onExit,
}) {
  let isEnded = false
  let isSuccess = false
  let exitCode = -1
  const stdoutList = []
  const stderrList = []

  // Handle standard output
  if (process.stdout) {
    process.stdout.on('data', (data) => {
      const text = convertOutputEncoding(encoding, data)
      stdoutList.push(text)
      onStdout?.(text, process)
    })
  }

  // Handle standard error
  if (process.stderr) {
    process.stderr.on('data', (data) => {
      const text = convertOutputEncoding(encoding, data)
      stderrList.push(text)
      onStderr?.(text, process)
    })
  }

  // Handle exit event
  process.on('exit', (code, signal) => {
    exitCode = code ?? -1
    isEnded = true

    // Windows: 0 or 1 indicates success
    // Unix: null or 0 indicates success
    if (platform.isWindows) {
      isSuccess = code === 0 || code === 1
    }
    else {
      isSuccess = code === null || code === 0
    }

    onExit?.(code, signal, process)

    if (isSuccess) {
      onSuccess?.(process)
    }
    else {
      onError?.(`Process exited with code ${code}`, exitCode, process)
    }
  })

  // Handle error event
  process.on('error', (err) => {
    isEnded = true
    onError?.(err.message, -1, process)
  })

  return {
    /**
     * Stop the process
     */
    stop() {
      treeKill(process.pid)
    },

    /**
     * Send data to process stdin
     * @param {string} data - Data
     */
    send(data) {
      if (!process.stdin) {
        console.warn('[Terminal] Process stdin is not available')
        return
      }
      process.stdin.write(data)
    },

    /**
     * Get complete output (asynchronously wait for process to end)
     * @returns {Promise<string>} Complete output
     */
    async result() {
      if (isEnded) {
        return stdoutList.join('') + stderrList.join('')
      }

      return new Promise((resolve, reject) => {
        const checkEnd = () => {
          if (!isEnded) {
            setTimeout(checkEnd, 10)
            return
          }

          if (isSuccess) {
            resolve(stdoutList.join('') + stderrList.join(''))
          }
          else {
            reject(new Error(`Process failed with code ${exitCode}`))
          }
        }
        checkEnd()
      })
    },

    /**
     *  Get raw process instance
     */
    get raw() {
      return process
    },

    /**
     * Check if the process has ended
     */
    get isEnded() {
      return isEnded
    },

    /**
     * Check if the process was successful
     */
    get isSuccess() {
      return isSuccess
    },
  }
}

/**
 * Execute shell command and wait for completion
 * @param {string|string[]} command - Command or command array
 * @param {object} options - Options
 * @param {string} options.cwd - Working directory
 * @param {string} options.encoding - Output encoding (utf8|cp936)
 * @param {object} options.env - Environment variables
 * @param {boolean} options.shell - Whether to use shell
 * @returns {Promise<{stdout: string, stderr: string}>} Execution result
 */
export async function executeShell(command, options = {}) {
  const {
    cwd = process.cwd(),
    encoding = platform.isWindows ? 'cp936' : 'utf8',
    env = {},
    shell = true,
  } = options

  const [cmd, ...args] = Array.isArray(command) ? command : command.split(' ')

  return new Promise((resolve, reject) => {
    const spawnProcess = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...env },
      shell,
      encoding: 'binary',
    })

    const stdoutList = []
    const stderrList = []

    spawnProcess.stdout?.on('data', (data) => {
      stdoutList.push(convertOutputEncoding(encoding, data))
    })

    spawnProcess.stderr?.on('data', (data) => {
      stderrList.push(convertOutputEncoding(encoding, data))
    })

    spawnProcess.on('exit', (code) => {
      const result = {
        stdout: stdoutList.join(''),
        stderr: stderrList.join(''),
      }

      if (code === 0 || (platform.isWindows && code === 1)) {
        resolve(result)
      }
      else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    spawnProcess.on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * Execute streaming shell command
 * @param {string|string[]} command - Command or command array
 * @param {object} options - Options
 * @param {Function} options.stdout - stdout callback
 * @param {Function} options.stderr - stderr callback
 * @param {Function} options.success - success callback
 * @param {Function} options.error - error callback
 * @param {Function} options.exit - exit callback
 * @param {string} options.cwd - Working directory
 * @param {string} options.encoding - Output encoding
 * @param {object} options.env - Environment variables
 * @param {boolean} options.shell - Whether to use shell
 * @returns {Promise<object>} Process controller
 */
export async function spawnShell(command, options = {}) {
  const {
    stdout: onStdout,
    stderr: onStderr,
    success: onSuccess,
    error: onError,
    exit: onExit,
    cwd = process.cwd(),
    encoding = platform.isWindows ? 'cp936' : 'utf8',
    env = {},
    shell = true,
  } = options

  const [cmd, ...args] = Array.isArray(command) ? command : command.split(' ')

  const spawnProcess = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    shell,
    encoding: 'binary',
  })

  return createProcessController({
    process: spawnProcess,
    encoding,
    onStdout,
    onStderr,
    onSuccess,
    onError,
    onExit,
  })
}
