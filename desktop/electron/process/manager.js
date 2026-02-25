import fkill from 'fkill'

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
        await fkill(item.pid, { force: true, tree: true, silent: true })
      }

      this.processList = []
      return this
    }

    const pid = process?.pid || process
    await fkill(pid, { force: true, tree: true, silent: true })
    this.processList = this.processList.filter(item => item.pid !== pid)
    return this
  }
}
