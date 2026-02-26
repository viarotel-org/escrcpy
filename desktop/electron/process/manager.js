import treeKill from '@magda/tree-kill'

/**
 * Process Manager
 */
export class ProcessManager {
  processList = []

  constructor() {
    this.processList = []
  }

  add(process) {
    this.processList.push(process)
  }

  async kill(process) {
    if (!process) {
      for (const item of this.processList) {
        await treeKill(item.pid)
      }

      this.processList = []
      return this
    }

    const pid = process?.pid || process
    await treeKill(pid)
    this.processList = this.processList.filter(item => item.pid !== pid)
    return this
  }
}
