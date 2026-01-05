export interface AgentConfigType {
  maxSteps: number
  lang: 'cn' | 'en'
  deviceId?: string
  adbPath?: string
  adbKeyboardApkPath?: string
  systemPrompt?: string
  // ModelConfigType
  baseUrl: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
}

export interface EventData {
  message: any
  time: string
}
