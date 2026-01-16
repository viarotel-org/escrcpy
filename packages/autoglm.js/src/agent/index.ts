import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import type { StepResult } from './types'
import type { AgentContext } from '@/context'
import { ActionHandler, finish } from '@/actions/handler'
import { parseAction } from '@/actions/parse'
import { getCurrentApp, getScreenshot } from '@/adb'
import { EventType } from '@/context'
import { MessageBuilder, ModelClient } from '@/model/client'
import { getFinishMessage } from '@/utils/finishMessage'

export class PhoneAgent {
  private ctx: AgentContext
  private modelClient: ModelClient
  private actionHandler: ActionHandler
  private context: ChatCompletionMessageParam[] = []
  private stepCount: number = 0
  private abortController: AbortController | null = null
  private externalSignal?: AbortSignal
  private isAborted: boolean = false

  constructor(
    context: AgentContext,
    confirmationCallback?: (message: string) => Promise<boolean>,
    takeoverCallback?: (message: string) => Promise<void>,
  ) {
    this.ctx = context
    this.modelClient = new ModelClient(context)
    this.actionHandler = new ActionHandler(
      context,
      {
        confirmationCallback,
        takeoverCallback,
      },
    )
  }

  private get agentConfig() {
    return this.ctx.getConfig()
  }

  abort(reason: string = 'User aborted'): void {
    if (!this.abortController) {
      return
    }
    this.abortController.abort(reason)
    this.isAborted = true
    this.ctx.emit(EventType.ABORTED, reason)
  }

  private checkAborted() {
    if (this.isAborted && this.abortController?.signal.aborted) {
      return false
    }
    return true
  }

  /**
   * Run the agent to complete a task.
   */
  async run(task: string, signal?: AbortSignal): Promise<string> {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }

    this.abortController = new AbortController()
    this.isAborted = false

    // Store external signal for use in _executeStep
    // Each request will create its own AbortController and combine signals using AbortSignal.any()
    this.externalSignal = signal

    try {
      // Reset state
      this.reset()

      // First step with user prompt
      let result = await this._executeStep(task, true)

      if (result.finished) {
        return result.message || 'Task completed'
      }

      // Continue until finished or max steps reached
      while (this.stepCount < this.agentConfig.maxSteps) {
        if (!this.checkAborted()) {
          return 'Agent aborted'
        }
        result = await this._executeStep(undefined, false)

        if (result.finished) {
          return result.message || 'Task completed'
        }
      }

      throw new Error('Max steps reached')
    }
    finally {
      this.abortController = null
      this.externalSignal = undefined
    }
  }

  /**
   * Execute a single step of the agent.
   * Useful for manual control or debugging.
   */
  async step(task?: string): Promise<StepResult> {
    const isFirst = this.context.length === 0

    if (isFirst && !task) {
      throw new Error('Task is required for the first step')
    }

    return this._executeStep(task, isFirst)
  }

  /**
   * Reset the agent state for a new task.
   */
  reset(): void {
    this.context = []
    this.stepCount = 0
  }

  /**
   * Get the current conversation context.
   */
  getContext(): ChatCompletionMessageParam[] {
    return [...this.context]
  }

  /**
   * Get the current step count.
   */
  getStepCount(): number {
    return this.stepCount
  }

  /**
   * Execute a single step of the agent loop.
   */
  private async _executeStep(task?: string, isFirst: boolean = false): Promise<StepResult> {
    this.stepCount++

    // Capture current screen state
    const screenshot = await getScreenshot(
      this.agentConfig.deviceId,
      10,
      this.agentConfig.screenshotQuality,
    )
    const currentApp = await getCurrentApp(this.agentConfig.deviceId, this.agentConfig.customApps)

    // Build messages
    if (isFirst) {
      // Add system message
      this.context.push(MessageBuilder.createSystemMessage(this.agentConfig.systemPrompt!))

      // Add user message with task and screen info
      const screenInfo = MessageBuilder.buildScreenInfo(currentApp)
      const textContent = `${task!}\n\n${screenInfo}`

      this.context.push(
        MessageBuilder.createUserMessage(textContent, screenshot.base64Data),
      )
    }
    else {
      // Add screen update message
      const screenInfo = MessageBuilder.buildScreenInfo(currentApp)
      const textContent = `** Screen Info **\n\n${screenInfo}`

      this.context.push(
        MessageBuilder.createUserMessage(textContent, screenshot.base64Data),
      )
    }

    // Get model response
    try {
      // Create a new AbortController for this specific request
      const requestController = new AbortController()

      // Combine signals: abort this request if either main controller or external signal aborts
      const signals = [requestController.signal]
      if (this.abortController) {
        signals.push(this.abortController.signal)
      }
      if (this.externalSignal) {
        signals.push(this.externalSignal)
      }
      const combinedSignal = AbortSignal.any(signals)

      const response = await this.modelClient.request(this.context, {
        signal: combinedSignal,
      })

      // Parse action from response
      let action
      try {
        // Import dynamically to avoid circular dependency
        action = parseAction(response.action)
      }
      catch {
        // If parsing fails, use finish action
        action = finish(response.action)
      }

      this.ctx.emit(EventType.ACTION, action)

      // Remove image from context to save space
      this.context[this.context.length - 1] = MessageBuilder.removeImagesFromMessage(
        this.context[this.context.length - 1],
      )

      // Execute action
      const result = await this.actionHandler.execute(
        action,
        screenshot.width,
        screenshot.height,
      )

      // Add assistant response to context
      this.context.push(
        MessageBuilder.createAssistantMessage(
          `<think>${response.thinking}</think><answer>${response.action}</answer>`,
        ),
      )

      // Check if finished
      const finished = action._metadata === 'finish' || result.should_finish
      const message = getFinishMessage(result)
      if (finished) {
        this.ctx.emit(EventType.TASK_COMPLETE, message)
      }

      return {
        success: result.success,
        finished,
        action,
        thinking: response.thinking,
        message,
      }
    }
    catch (error) {
      return {
        success: false,
        finished: true,
        action: null,
        thinking: '',
        message: `Model error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }
}
