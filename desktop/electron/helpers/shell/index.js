import { spawn } from 'node:child_process'
import quote from 'shell-quote'
import fkill from 'fkill'

/**
 * Executes a shell command or array of arguments as a child process, with
 * optional streaming of stdout and stderr, and returns a promise-like object
 * that resolves with the command result.
 *
 * @param {string|string[]} command - The command to run. Can be a string
 * @param {Object} [options] - Options to customize command execution.
 * @param {string} [options.cwd] - Current working directory for the child process.
 * @param {Object} [options.env] - Environment variables to merge with process.env.
 * @param {boolean} [options.shell] - Whether to execute the command inside a shell.
 * @param {(chunk: string|Buffer, child: import('child_process').ChildProcess) => void} [options.stdout] - Callback for stdout data chunks.
 * @param {(chunk: string|Buffer, child: import('child_process').ChildProcess) => void} [options.stderr] - Callback for stderr data chunks.
 * @param {string|null} [options.encoding] - Encoding to apply to stdout and stderr (e.g., 'utf8'). If null, returns Buffers.
 * @param {Object} [options.restOptions] - Additional options passed to Node's `spawn` function.
 *
 * @returns {ChildProcess & Promise<{ stdout: string|Buffer, stderr: string|Buffer, exitCode: number|null, signal: string|null, failed: boolean, command: string|string[] }>}
 *   Returns the spawned child process object augmented with `then`, `catch`, `finally` (promise methods)
 *   and a `kill()` method to terminate the process.
 *
 * @throws {Error} If the process exits with a non-zero code (except exit code 1 on Windows), the returned promise rejects with an error containing `stdout`, `stderr`, `exitCode`, `signal`, and `command`.
 *
 */
export function sheller(command, options = {}) {
  const {
    cwd = process.cwd(),
    env = {},
    shell = false,
    stdout: onStdout,
    stderr: onStderr,
    encoding = null,
    ...restOptions
  } = options

  const args = Array.isArray(command) ? command : quote.parse(command)
  console.log('args', args)
  const [cmd, ...cmdArgs] = args

  const child = spawn(cmd, cmdArgs, {
    cwd,
    env: { ...process.env, ...env },
    shell,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...restOptions,
  })

  const stdoutChunks = []
  const stderrChunks = []

  if (encoding) {
    child.stdout?.setEncoding?.(encoding)
    child.stderr?.setEncoding?.(encoding)
  }

  child.stdout?.on('data', (chunk) => {
    stdoutChunks.push(chunk)
    onStdout?.(chunk, child)
  })

  child.stderr?.on('data', (chunk) => {
    stderrChunks.push(chunk)
    onStderr?.(chunk, child)
  })

  const promise = new Promise((resolve, reject) => {
    let spawnError = null

    child.once('error', (err) => {
      spawnError = err
    })

    child.once('close', (code, signal) => {
      if (spawnError) {
        return reject(spawnError)
      }

      const concatChunks = val => encoding ? val.join('') : Buffer.concat(val)
      const stdout = concatChunks(stdoutChunks)
      const stderr = concatChunks(stderrChunks)

      const exitCode = code
      const isSuccess = exitCode === 0

      const result = { stdout, stderr, exitCode, signal, failed: !isSuccess, command }

      if (isSuccess) {
        resolve(result)
      }
      else {
        const error = new Error(
          `Command failed with exit code ${exitCode}${signal ? ` (signal: ${signal})` : ''}`,
        )
        Object.assign(error, result)
        reject(error)
      }
    })
  })

  const kill = async () => {
    if (!child.pid) {
      return false
    }

    try {
      await fkill(child.pid, { force: true, tree: true })
    }
    catch (err) {
      console.warn(`Failed to kill process ${child.pid}:`, err)
    }
  }

  const assignedChild = Object.assign(child, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
    kill,
  })

  return assignedChild
}
