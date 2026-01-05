import type { Emitter } from 'mitt'
import type { AgentConfigStore } from './config'
import type { EventType, MittEvents } from './event'
import type { AgentConfigType } from './types'
import dayjs from 'dayjs'
import { createAgentConfigStore } from './config'
import { createEmitter } from './event'

export { EventType } from './event'

export class AgentContext {
  private configStore: AgentConfigStore
  private emitter: Emitter<MittEvents>

  constructor(config: Partial<AgentConfigType>) {
    this.configStore = createAgentConfigStore(config)
    this.emitter = createEmitter()
  }

  public getConfig() {
    return this.configStore.getConfig()
  }

  public updateConfig(config: Partial<AgentConfigType>) {
    this.configStore.setConfig(config)
  }

  public emit(event: EventType, data: unknown) {
    this.emitter.emit(event, {
      message: data,
      time: dayjs().format('hh:mm:ss A'),
    })
  }

  public on(event: any, handler: any) {
    return this.emitter.on(event, handler)
  }

  public off(event: any, handler: any) {
    return this.emitter.off(event, handler)
  }
}
