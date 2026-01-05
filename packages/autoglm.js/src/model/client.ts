import type { ModelResponse } from './types'
import type { AgentContext } from '@/context'
import OpenAI from 'openai'
import { EventType } from '@/context'
/**
 * Helper class for building conversation messages.
 */
export class MessageBuilder {
  /**
   * Create a system message.
   */
  static createSystemMessage(content: string): OpenAI.Chat.ChatCompletionMessageParam {
    return {
      role: 'system',
      content,
    }
  }

  /**
   * Create a user message with optional image.
   */
  static createUserMessage(
    text: string,
    imageBase64?: string,
  ): OpenAI.Chat.ChatCompletionMessageParam {
    const content: Array<{ type: 'text', text: string } | { type: 'image_url', image_url: { url: string } }> = []

    if (imageBase64) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${imageBase64}`,
        },
      })
    }

    content.push({
      type: 'text',
      text,
    })

    return {
      role: 'user',
      content,
    }
  }

  /**
   * Create an assistant message.
   */
  static createAssistantMessage(content: string): OpenAI.Chat.ChatCompletionMessageParam {
    return {
      role: 'assistant',
      content,
    }
  }

  /**
   * Remove image content from a message to save context space.
   */
  static removeImagesFromMessage(message: OpenAI.Chat.ChatCompletionMessageParam): OpenAI.Chat.ChatCompletionMessageParam {
    if (Array.isArray(message.content)) {
      message.content = message.content.filter(
        item => 'type' in item && item.type === 'text',
      )
    }
    return message
  }

  /**
   * Build screen info string for the model.
   */
  static buildScreenInfo(currentApp: string, extraInfo?: Record<string, any>): string {
    const info = {
      current_app: currentApp,
      ...extraInfo,
    }
    return JSON.stringify(info, null, 2)
  }
}

/**
 * Client for interacting with OpenAI-compatible vision-language models.
 */
export class ModelClient {
  private ctx: AgentContext
  private client: OpenAI

  constructor(ctx: AgentContext) {
    this.ctx = ctx
    this.client = new OpenAI({
      baseURL: ctx.getConfig().baseUrl,
      apiKey: ctx.getConfig().apiKey,
    })
  }

  private get config() {
    return this.ctx.getConfig()
  }

  /**
   * Send a request to the model.
   */
  async request(messages: OpenAI.Chat.ChatCompletionMessageParam[], options?: { signal?: AbortSignal }): Promise<ModelResponse> {
    const data = await this.client.chat.completions.create(
      {
        messages,
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        top_p: this.config.topP,
        frequency_penalty: this.config.frequencyPenalty,
        stream: false,
      },
      { signal: options?.signal },
    )
    const rawContent = data.choices[0].message.content
    if (!rawContent) {
      throw new Error('Empty response from model')
    }
    const [thinking, action] = this._parseResponse(rawContent)

    this.ctx.emit(EventType.THINKING, thinking)
    return { thinking, action, rawContent }
  }

  /**
   * Parse the model response into thinking and action parts.
   */
  private _parseResponse(content: string): [string, string] {
    // Rule 1: Check for finish(message=
    if (content.includes('finish(message=')) {
      const parts = content.split('finish(message=')
      return [parts[0].trim(), `finish(message=${parts[1]}`]
    }

    // Rule 2: Check for do(action=
    if (content.includes('do(action=')) {
      const parts = content.split('do(action=')
      return [parts[0].trim(), `do(action=${parts[1]}`]
    }

    // Rule 3: Fallback to legacy XML tag parsing
    if (content.includes('<answer>')) {
      const parts = content.split('<answer>')
      const thinking = parts[0].replace('<think>', '').replace('</think>', '').trim()
      const action = parts[1].replace('</answer>', '').trim()
      return [thinking, action]
    }

    // Rule 4: No markers found, return content as action
    return ['', content]
  }
}
