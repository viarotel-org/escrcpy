/** 在主进程中获取关键信息存储到环境变量中，从而在预加载脚本中及渲染进程中使用 */
import { app } from 'electron'

/** 注意： app.isPackaged 可能被被某些方法改变所以请将该文件放到 main.js 必须位于非依赖项的顶部 */
import fixPath from 'fix-path'

if (process.platform === 'darwin') {
  fixPath()
}

process.env.IS_PACKAGED = String(app.isPackaged)

process.env.DESKTOP_PATH = app.getPath('desktop')

process.env.CWD = process.cwd()

export const isPackaged = ['true'].includes(process.env.IS_PACKAGED)
