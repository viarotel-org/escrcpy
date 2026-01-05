import { Enum } from 'enum-plus'
/**
 * 消息角色枚举
 */
export const MessageRoleEnum = Enum({
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
})

/**
 * 消息状态枚举
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
