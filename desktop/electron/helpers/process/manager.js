import treeKill from 'tree-kill'

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
      this.processList.forEach(item => treeKill(item.pid))
      this.processList = []
      return this
    }

    const pid = process?.pid || process
    treeKill(pid)
    this.processList = this.processList.filter(item => item.pid !== pid)
    return this
  }
}
