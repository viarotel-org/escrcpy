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

  kill(process) {
    if (!process) {
      this.processList.forEach(item => fkill(item.pid, { tree: true }))
      this.processList = []
      return this
    }

    const pid = process?.pid || process
    fkill(pid, { tree: true })
    this.processList = this.processList.filter(item => item.pid !== pid)
    return this
  }
}
