import simpleGit from 'simple-git'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execPromise = promisify(exec)

/**
 * 在临时目录中克隆GitHub仓库,安装依赖,构建项目,并将构建输出复制到指定目录。
 *
 * @param {Object} options - 函数的配置选项。
 * @param {string} options.repoUrl - 要克隆的GitHub仓库URL。
 * @param {string} options.buildOutputDir - 构建输出所在的目录(相对于项目根目录)。
 * @param {string} options.destinationDir - 构建输出应该被复制到的目录。
 * @param {string} [options.branch] - 要克隆的分支(默认为'main')。
 * @param {string} [options.installCommand] - 安装依赖的命令。
 * @param {string} [options.buildCommand] - 构建项目的命令。
 * @returns {Promise<void>}
 *
 * @example
 * gitResolve({
 *   repoUrl: 'https://github.com/user/project.git',
 *   buildOutputDir: 'dist',
 *   destinationDir: './public',
 *   branch: 'main',
 *   installCommand: 'npm install',
 *   buildCommand: 'npm run build'
 * });
 */
export async function gitResolve(options) {
  const {
    repoUrl,
    buildOutputDir,
    destinationDir,
    branch = 'main',
    installCommand = 'npm install',
    buildCommand = 'npm run build',
  } = options

  const repoName = path.basename(repoUrl, path.extname(repoUrl))

  let tempDir

  try {
    // 创建临时目录
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `${repoName}-`))
    console.log(`创建临时目录: ${tempDir}`)

    // 克隆仓库
    console.log(`正在克隆仓库: ${repoUrl}`)
    const git = simpleGit()
    await git.clone(repoUrl, tempDir, ['--depth', '1', '--branch', branch])

    // 切换到临时目录
    process.chdir(tempDir)

    // 安装依赖
    console.log('正在安装依赖...')
    await execPromise(installCommand)

    // 构建项目
    console.log('正在构建项目...')
    await execPromise(buildCommand)

    // 复制构建输出到目标目录
    const sourcePath = path.join(tempDir, buildOutputDir)
    const finallyDestinationDir = path.join(destinationDir, repoName)

    console.log(
      `正在将构建输出从 ${sourcePath} 复制到 ${finallyDestinationDir}`,
    )
    await fs.cp(sourcePath, finallyDestinationDir, { recursive: true })

    console.log('流程成功完成。')
  }
  catch (error) {
    console.error('发生错误:', error)
    throw error
  }
  finally {
    if (tempDir) {
      if (['win32'].includes(process.platform)) {
        console.log(
          `注意，在 Windows 中由于文件锁的原因 你需要手动清除缓存目录:\npnpm cleanup ${tempDir}`,
        )
      }
      else {
        fs.rm(tempDir).catch(e => console.log(e.message))
      }
    }
  }
}
