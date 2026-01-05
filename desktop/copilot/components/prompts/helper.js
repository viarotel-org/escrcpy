import { useEventBus } from '@vueuse/core'

export const copilotPromptBus = useEventBus('copilot:prompt')
