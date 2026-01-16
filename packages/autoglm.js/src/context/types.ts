export interface AgentConfigType {
  maxSteps: number
  lang: 'cn' | 'en'
  deviceId?: string
  systemPrompt?: string
  /**
   * Custom app name to package name mapping.
   * These will override the built-in APP_PACKAGES.
   * @example { '自定义应用': 'com.example.app' }
   */
  customApps?: Record<string, string>
  // ModelConfigType
  baseUrl: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  screenshotQuality?: number
}

export interface EventData {
  message: any
  time: string
}
