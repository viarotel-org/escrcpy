import type { AgentConfigType, EventData } from './context/types'
import { ADBManager } from './adb/manager'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { AgentContext, EventType } from './context'

export class AutoGLM {
  private phoneAgent: PhoneAgent
  private ctx: AgentContext
  private adbManager: ADBManager

  constructor(config: Partial<AgentConfigType>) {
    this.ctx = new AgentContext(config)
    this.phoneAgent = new PhoneAgent(this.ctx)
    this.adbManager = new ADBManager(this.ctx)
  }

  public get adb() {
    return this.adbManager
  }

  public abort(reason?: string) {
    this.phoneAgent.abort(reason)
  }

  public checkSystemRequirements() {
    return checkSystemRequirements(this.ctx)
  }

  public checkModelApi() {
    return checkModelApi(this.ctx)
  }

  public run(task: string) {
    this.ctx.emit(EventType.START, task)
    return this.phoneAgent.run(task)
  }

  public on(type: '*', handler: (type: EventType, data: EventData) => void): this
  public on(type: EventType, handler: (data: EventData) => void): this
  public on(type: any, handler: any) {
    this.ctx.on(type, handler)
    return this
  }

  public off(type: '*', handler: (type: EventType, data: EventData) => void): this
  public off(type: EventType, handler: (data: EventData) => void): this
  public off(type: any, handler: any) {
    this.ctx.off(type, handler)
    return this
  }
}

export * from './adb/types'
export type { EventData }
export {
  EventType,
}
