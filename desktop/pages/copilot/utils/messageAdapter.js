import dayjs from 'dayjs'
import { MessageRoleEnum, MessageStatusEnum } from '$copilot/dicts/index.js'

/**
 * Avatar configuration
 */
const AVATAR_CONFIG = {
  [MessageRoleEnum.USER]: null,
  [MessageRoleEnum.ASSISTANT]: null,
  [MessageRoleEnum.SYSTEM]: null,
}

/**
 * Get avatar URL for a role
 * @param {string} role - Message role
 * @returns {string|null} Avatar URL
 */
export function getAvatarByRole(role) {
  return AVATAR_CONFIG[role] || null
}

/**
 * Get name key for a role
 * @param {string} role - Message role
 * @returns {string} i18n key for role name
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
 * Format timestamp
 * @param {number} timestamp - Timestamp
 * @param {string} format - Format template
 * @returns {string} Formatted datetime string
 */
export function formatDatetime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp)
    return ''
  return dayjs(timestamp).format(format)
}

/**
 * Adapt a Message object to TDesign TdChatItemMeta format
 *
 * @param {Object} message - Original message object
 * @param {Object} options - Options
 * @returns {Object} Message object in TDesign format
 */
export function adaptMessageForTDesign(message, options = {}) {
  if (!message) {
    return null
  }

  const role = message.role

  return {
    // Preserve original ID for operations
    id: message.id,
    // TDesign required fields
    role,
    avatar: getAvatarByRole(message.role),
    name: getNameByRole(message.role),
    datetime: formatDatetime(message.timestamp),
    content: message.content || '',
    // Extended fields
    reasoningCollapsed: false,
    status: message.status,
    steps: [],
    // Preserve original data reference
    _raw: message,
  }
}

/**
 * Adapt an array of messages for TDesign in batch
 *
 * @param {Array} messages - Original messages array
 * @param {Object} options - Options
 * @param {boolean} options.reverse - Whether to reverse order (used for TDesign reverse=true mode)
 * @returns {Array} Array of messages formatted for TDesign
 */
export function adaptMessagesForTDesign(messages, options = {}) {
  const { reverse = true } = options

  if (!Array.isArray(messages)) {
    return []
  }

  const adapted = messages
    .map(msg => adaptMessageForTDesign(msg))
    .filter(Boolean)

  // If reverse mode is enabled, reverse the message order (useChatMessages returns ascending order)
  // For TDesign with reverse=true, new messages should appear at the start of the array
  return reverse ? [...adapted].reverse() : adapted
}

/**
 * Create a temporary assistant message (used for streaming output)
 *
 * @param {Object} options - Options
 * @returns {Object} Temporary message object
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
