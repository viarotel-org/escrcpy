import type { Action, ActionCallbacks, ActionResult, BackAction, BaseAction, DoubleTapAction, FinishAction, HomeAction, LaunchAction, LongPressAction, SwipeAction, TakeOverAction, TapAction, TypeAction, WaitAction } from './types'
import type { AgentContext } from '@/context'
import { back, doubleTap, home, launchApp, longPress, swipe, tap } from '@/adb/device'
import { typeText } from '@/adb/input'

/**
 * Create a finish action.
 */
export function finish(message?: string): FinishAction {
  return {
    _metadata: 'finish',
    message,
  }
}

/**
 * Create a do action.
 */
export function createDoAction<T extends Omit<BaseAction, '_metadata'>>(action: T): T & { _metadata: 'do' } {
  return {
    ...action,
    _metadata: 'do',
  }
}

/**
 * Action handler that executes the actions on the device.
 */
export class ActionHandler {
  constructor(
    private context: AgentContext,
    private callbacks: ActionCallbacks = {},
  ) {}

  get deviceId() {
    return this.context.getConfig().deviceId
  }

  /**
   * Execute an action.
   */
  async execute(action: Action, screenWidth: number, screenHeight: number): Promise<ActionResult> {
    try {
      if (action._metadata === 'finish') {
        const finishAction = action as FinishAction
        return {
          success: true,
          should_finish: true,
          message: finishAction.message,
        }
      }

      switch (action.action) {
        case 'Launch':
          return await this.executeLaunchAction(action)
        case 'Tap':
          return await this.executeTapAction(action, screenWidth, screenHeight)
        case 'Type':
          return await this.executeTypeAction(action)
        case 'Swipe':
          return await this.executeSwipeAction(action, screenWidth, screenHeight)
        case 'Back':
          return await this.executeBackAction(action)
        case 'Home':
          return await this.executeHomeAction(action)
        case 'Long Press':
          return await this.executeLongPressAction(action, screenWidth, screenHeight)
        case 'Double Tap':
          return await this.executeDoubleTapAction(action, screenWidth, screenHeight)
        case 'Wait':
          return await this.executeWaitAction(action)
        case 'Take_over':
          return await this.executeTakeOverAction(action)
        default:
          return {
            success: false,
            should_finish: true,
            message: `Unknown action: ${(action as any).action}`,
          }
      }
    }
    catch (error) {
      return {
        success: false,
        should_finish: true,
        message: `Action execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Execute launch action.
   */
  private async executeLaunchAction(action: LaunchAction): Promise<ActionResult> {
    const success = await launchApp(action.app, this.deviceId)

    if (!success) {
      return {
        success: false,
        should_finish: false,
        message: `Failed to launch app: ${action.app}`,
      }
    }

    return {
      success: true,
      should_finish: false,
    }
  }

  private convertRelativeToAbsolute(element: [number, number], screenWidth: number, screenHeight: number): [number, number] {
    return [element[0] / 1000 * screenWidth, element[1] / 1000 * screenHeight]
  }

  /**
   * Execute tap action.
   */
  private async executeTapAction(action: TapAction, screenWidth: number, screenHeight: number): Promise<ActionResult> {
    const [x, y] = action.element
    const [absoluteX, absoluteY] = this.convertRelativeToAbsolute([x, y], screenWidth, screenHeight)
    await tap(absoluteX, absoluteY, this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute type action.
   */
  private async executeTypeAction(action: TypeAction): Promise<ActionResult> {
    await typeText(action.text, this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute swipe action.
   */
  private async executeSwipeAction(action: SwipeAction, screenWidth: number, screenHeight: number): Promise<ActionResult> {
    const [startX, startY] = this.convertRelativeToAbsolute(action.start, screenWidth, screenHeight)
    const [endX, endY] = this.convertRelativeToAbsolute(action.end, screenWidth, screenHeight)
    await swipe(startX, startY, endX, endY, action.duration, this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute back action.
   */
  private async executeBackAction(_action: BackAction): Promise<ActionResult> {
    await back(this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute home action.
   */
  private async executeHomeAction(_action: HomeAction): Promise<ActionResult> {
    await home(this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute long press action.
   */
  private async executeLongPressAction(action: LongPressAction, screenWidth: number, screenHeight: number): Promise<ActionResult> {
    const [x, y] = this.convertRelativeToAbsolute(action.element, screenWidth, screenHeight)
    await longPress(x, y, action.duration, this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute double tap action.
   */
  private async executeDoubleTapAction(action: DoubleTapAction, screenWidth: number, screenHeight: number): Promise<ActionResult> {
    const [x, y] = this.convertRelativeToAbsolute(action.element, screenWidth, screenHeight)
    await doubleTap(x, y, this.deviceId)

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute wait action.
   */
  private async executeWaitAction(action: WaitAction): Promise<ActionResult> {
    const duration = action.duration || 1.0
    await new Promise(resolve => setTimeout(resolve, duration * 1000))

    return {
      success: true,
      should_finish: false,
    }
  }

  /**
   * Execute take over action.
   */
  private async executeTakeOverAction(action: TakeOverAction): Promise<ActionResult> {
    if (this.callbacks.takeoverCallback) {
      await this.callbacks.takeoverCallback(action.reason || 'Manual takeover requested')
      return {
        success: true,
        should_finish: false,
      }
    }

    return {
      success: false,
      should_finish: true,
      message: action.reason,
    }
  }
}
