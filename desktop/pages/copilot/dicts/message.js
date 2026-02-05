import { Enum } from 'enum-plus'
/**
 * Message role enumeration
 */
export const MessageRoleEnum = Enum({
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
})

/**
 * Message status enumeration
 */
export const MessageStatusEnum = Enum({
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  STOPPED: 'stopped',
})

export const TaskStatusEnum = Enum({
  START: {
    value: 'start',
    messageStatus: MessageStatusEnum.RUNNING,
  },
  THINKING: {
    value: 'thinking',
    messageStatus: MessageStatusEnum.RUNNING,
  },
  ACTION: {
    value: 'action',
    messageStatus: MessageStatusEnum.RUNNING,
  },
  TASK_COMPLETE: {
    value: 'task_complete',
    messageStatus: MessageStatusEnum.COMPLETED,
  },
  ERROR: {
    value: 'error',
    messageStatus: MessageStatusEnum.FAILED,
  },
  ABORTED: {
    value: 'aborted',
    messageStatus: MessageStatusEnum.STOPPED,
  },
})
