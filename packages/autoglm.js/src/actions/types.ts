/**
 * Action types that the agent can perform.
 */
export type ActionType
  = | 'Launch'
    | 'Tap'
    | 'Type'
    | 'Swipe'
    | 'Back'
    | 'Home'
    | 'Long Press'
    | 'Double Tap'
    | 'Wait'
    | 'Take_over'

/**
 * Base action interface.
 */
export interface BaseAction {
  _metadata: 'do' | 'finish'
  action: ActionType
}

/**
 * Launch app action.
 */
export interface LaunchAction extends BaseAction {
  action: 'Launch'
  app: string
}

/**
 * Tap action.
 */
export interface TapAction extends BaseAction {
  action: 'Tap'
  element: [number, number]
}

/**
 * Type action.
 */
export interface TypeAction extends BaseAction {
  action: 'Type'
  text: string
}

/**
 * Swipe action.
 */
export interface SwipeAction extends BaseAction {
  action: 'Swipe'
  start: [number, number]
  end: [number, number]
  duration?: number
}

/**
 * Back action.
 */
export interface BackAction extends BaseAction {
  action: 'Back'
}

/**
 * Home action.
 */
export interface HomeAction extends BaseAction {
  action: 'Home'
}

/**
 * Long press action.
 */
export interface LongPressAction extends BaseAction {
  action: 'Long Press'
  element: [number, number]
  duration?: number
}

/**
 * Double tap action.
 */
export interface DoubleTapAction extends BaseAction {
  action: 'Double Tap'
  element: [number, number]
}

/**
 * Wait action.
 */
export interface WaitAction extends BaseAction {
  action: 'Wait'
  duration?: number
}

/**
 * Take over action.
 */
export interface TakeOverAction extends BaseAction {
  action: 'Take_over'
  reason?: string
}

/**
 * Finish action.
 */
export interface FinishAction {
  _metadata: 'finish'
  message?: string
}

/**
 * Union type for all possible actions.
 */
export type Action
  = | LaunchAction
    | TapAction
    | TypeAction
    | SwipeAction
    | BackAction
    | HomeAction
    | LongPressAction
    | DoubleTapAction
    | WaitAction
    | TakeOverAction
    | FinishAction

/**
 * Action execution result.
 */
export interface ActionResult {
  success: boolean
  should_finish: boolean
  message?: string
}

/**
 * Action execution callbacks.
 */
export interface ActionCallbacks {
  confirmationCallback?: (message: string) => Promise<boolean>
  takeoverCallback?: (message: string) => Promise<void>
}
