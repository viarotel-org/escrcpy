import dayjs from 'dayjs'
import { MessageRoleEnum, MessageStatusEnum } from '$copilot/dicts/index.js'

/**
 * 头像配置
 */
const AVATAR_CONFIG = {
  [MessageRoleEnum.USER]: null,
  [MessageRoleEnum.ASSISTANT]: null,
  [MessageRoleEnum.SYSTEM]: null,
}

/**
 * 获取角色对应的头像
 * @param {string} role - 消息角色
 * @returns {string|null} 头像URL
 */
export function getAvatarByRole(role) {
  return AVATAR_CONFIG[role] || null
}

/**
 * 获取角色对应的名称
 * @param {string} role - 消息角色
 * @param {Function} t - i18n 翻译函数
 * @returns {string} 角色名称
 */
export function getNameByRole(role) {
  const nameMap = {
    [MessageRoleEnum.USER]: 'copilot.role.user',
    [MessageRoleEnum.ASSISTANT]: 'copilot.role.assistant',
    [MessageRoleEnum.SYSTEM]: 'copilot.role.system',
  }

  return nameMap[role] || ''
}

/**
 * 格式化时间戳
 * @param {number} timestamp - 时间戳
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的时间字符串
 */
export function formatDatetime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp)
    return ''
  return dayjs(timestamp).format(format)
}

/**
 * 将 Message 对象适配为 TDesign TdChatItemMeta 格式
 *
 * @param {Object} message - 原始消息对象
 * @param {Object} options - 配置选项
 * @returns {Object} TDesign 格式的消息对象
 */
export function adaptMessageForTDesign(message, options = {}) {
  if (!message) {
    return null
  }

  const role = message.role

  return {
    // 原始 ID 保留，用于操作
    id: message.id,
    // TDesign 所需字段
    role,
    avatar: getAvatarByRole(message.role),
    name: getNameByRole(message.role),
    datetime: formatDatetime(message.timestamp),
    content: message.content || '',
    // 扩展字段
    reasoningCollapsed: false,
    status: message.status,
    steps: [],
    // 保留原始数据引用
    _raw: message,
  }
}

/**
 * 批量适配消息列表
 *
 * @param {Array} messages - 原始消息数组
 * @param {Object} options - 配置选项
 * @param {boolean} options.reverse - 是否倒序（用于 TDesign reverse=true 模式）
 * @returns {Array} TDesign 格式的消息数组
 */
export function adaptMessagesForTDesign(messages, options = {}) {
  const { reverse = true } = options

  if (!Array.isArray(messages)) {
    return []
  }

  const adapted = messages
    .map(msg => adaptMessageForTDesign(msg))
    .filter(Boolean)

  // 如果启用 reverse 模式，需要将消息倒序（useChatMessages 返回的是升序）
  // TDesign reverse=true 时，新消息应在数组头部
  return reverse ? [...adapted].reverse() : adapted
}

/**
 * 创建临时助手消息（用于实时输出流）
 *
 * @param {Object} options - 配置选项
 * @param {Function} options.t - i18n 翻译函数
 * @returns {Object} 临时消息对象
 */
export function createTemporaryAssistantMessage(options = {}) {
  const tempId = `temp-${Date.now()}`

  return {
    id: tempId,
    role: MessageRoleEnum.ASSISTANT,
    avatar: getAvatarByRole(MessageRoleEnum.ASSISTANT),
    name: getNameByRole(MessageRoleEnum.ASSISTANT),
    datetime: formatDatetime(Date.now()),
    content: '',
    status: MessageStatusEnum.PENDING,
    isTemporary: true,
    reasoningCollapsed: false,
    steps: [],
    _raw: {
      id: tempId,
      role: MessageRoleEnum.ASSISTANT,
      content: '',
      timestamp: Date.now(),
      status: MessageStatusEnum.PENDING,
    },
  }
}
