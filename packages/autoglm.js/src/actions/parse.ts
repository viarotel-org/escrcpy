import type {
  ArrayExpression,
  AssignmentExpression,
  Expression,
  ExpressionStatement,
  Literal,
} from 'acorn'
import type { Action } from './types'
import { parse } from 'acorn-loose'

function getElements(node: Expression, index: number = 1) {
  if (node.type !== 'SequenceExpression') {
    return undefined
  }
  const _elements = (node.expressions[index] as AssignmentExpression).right as ArrayExpression
  return _elements.elements.map(e => (e as unknown as Literal).value as number) as [number, number]
}

function getText(node: Expression) {
  if (node.type !== 'SequenceExpression') {
    return undefined
  }
  const text = (node.expressions[1] as AssignmentExpression).right as Literal
  return text.value as string
}

function getActionType(node: Expression) {
  if (node.type === 'SequenceExpression') {
    return ((node.expressions[0] as AssignmentExpression).right as Literal).value as string
  }
  if (node.type === 'AssignmentExpression') {
    return (node.right as Literal).value as string
  }
}

/**
 * Parse action from string format.
 */
export function parseAction(actionStr: string): Action {
  // Check for finish action
  if (actionStr.startsWith('finish(')) {
    // Extract message
    const match = actionStr.match(/finish\(message=(.*)\)/)
    return {
      _metadata: 'finish',
      message: match ? match[1].trim() : undefined,
    }
  }

  // Check for do action
  if (actionStr.startsWith('do(')) {
    const ast = parse(actionStr, { ecmaVersion: 'latest' })
    if (ast.body[0].type !== 'DoWhileStatement') {
      throw new Error(`Invalid action format: ${actionStr}`)
    }
    const expression = (ast.body[0].body as ExpressionStatement).expression
    const actionType = getActionType(expression)

    // Parse parameters based on action type
    if (actionType === 'Launch') {
      const app = getText(expression)
      if (!app) {
        throw new Error(`Invalid Launch action parameters: ${actionStr}`)
      }
      return {
        _metadata: 'do',
        action: 'Launch',
        app,
      }
    }

    if (actionType === 'Tap') {
      const element = getElements(expression)
      if (!element) {
        throw new Error(`Invalid Tap action parameters: ${actionStr}`)
      }
      return {
        _metadata: 'do',
        action: 'Tap',
        element,
      }
    }

    if (actionType === 'Type') {
      const text = getText(expression)
      if (!text) {
        throw new Error(`Invalid Type action parameters: ${actionStr}`)
      }
      return {
        _metadata: 'do',
        action: 'Type',
        text: text.trim(),
      }
    }

    if (actionType === 'Swipe') {
      const start = getElements(expression, 1)
      const end = getElements(expression, 2)

      if (!start || !end) {
        throw new Error(`Invalid Swipe action parameters: ${actionStr}`)
      }

      return {
        _metadata: 'do',
        action: 'Swipe',
        start,
        end,
      }
    }

    if (actionType === 'Back') {
      return {
        _metadata: 'do',
        action: 'Back',
      }
    }

    if (actionType === 'Home') {
      return {
        _metadata: 'do',
        action: 'Home',
      }
    }

    if (actionType === 'Long Press') {
      const element = getElements(expression)

      if (!element) {
        throw new Error(`Invalid Long Press action parameters: ${actionStr}`)
      }

      return {
        _metadata: 'do',
        action: 'Long Press',
        element,
      }
    }

    if (actionType === 'Double Tap') {
      const element = getElements(expression)
      if (!element) {
        throw new Error(`Invalid Double Tap action parameters: ${actionStr}`)
      }

      return {
        _metadata: 'do',
        action: 'Double Tap',
        element,
      }
    }

    if (actionType === 'Wait') {
      const duration = getText(expression)
      if (!duration) {
        throw new Error(`Invalid Wait action parameters: ${actionStr}`)
      }
      return {
        _metadata: 'do',
        action: 'Wait',
        duration: Number.parseInt(duration, 10),
      }
    }

    if (actionType === 'Take_over') {
      const reason = getText(expression)
      if (!reason) {
        throw new Error(`Invalid Take_over action parameters: ${actionStr}`)
      }
      return {
        _metadata: 'do',
        action: 'Take_over',
        reason,
      }
    }
  }

  throw new Error(`Unknown action format: ${actionStr}`)
}
