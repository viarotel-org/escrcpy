import { screen } from 'electron'

export class Edger {
  constructor(window) {
    if (!window) {
      throw new Error('Window instance is required')
    }

    this.window = window
    this.isHidden = false
    this.dockEdge = null
    this.originalBounds = null
    this.animationTimer = null
    this.showDebounceTimer = null
    this.hideDebounceTimer = null
    this.isDragging = false
    this.isAnimating = false
    this.lastMousePosition = null
    this.mouseMovementBuffer = []
    this.lastAnimationTime = 0
    this.isMaximized = window.isMaximized()
    this.lastMaximizedState = this.isMaximized

    // Animation configs
    this.animationDuration = 300
    this.animationSteps = 30
    this.visiblePortion = 2
    this.mouseBufferSize = 5
    this.mouseVelocityThreshold = 50
    this.animationCooldown = 100

    // Thresholds
    this.snapThreshold = 10
    this.undockThreshold = 20
    this.showHideThreshold = 50
    this.stablePositionThreshold = 3

    // Window topping
    this.wasAlwaysOnTop = window.isAlwaysOnTop()
    this.handleWindowBlur = this.handleWindowBlur.bind(this)
    this.handleWindowFocus = this.handleWindowFocus.bind(this)

    // Add mouse tracking timer reference
    this.mouseTrackingTimer = null

    this.initialize()
  }

  easeOutCubic(t) {
    return 1 - (1 - t) ** 3
  }

  easeInCubic(t) {
    return t * t * t
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - (-2 * t + 2) ** 3 / 2
  }

  addBounceEffect(finalBounds) {
    const bounceSteps = 15
    const bounceDistance = 5
    let step = 0

    const bounceBounds = { ...finalBounds }
    switch (this.dockEdge) {
      case 'right':
        bounceBounds.x -= bounceDistance
        break
      case 'left':
        bounceBounds.x += bounceDistance
        break
      case 'top':
        bounceBounds.y += bounceDistance
        break
    }

    const bounceTimer = setInterval(() => {
      step++
      const progress = step / bounceSteps
      const easeProgress = this.easeInOutCubic(progress)

      const currentBounds = {
        x: Math.round(bounceBounds.x + (finalBounds.x - bounceBounds.x) * easeProgress),
        y: Math.round(bounceBounds.y + (finalBounds.y - bounceBounds.y) * easeProgress),
        width: finalBounds.width,
        height: finalBounds.height,
      }

      try {
        this.window.setBounds(currentBounds)
      }
      catch (err) {
        console.error('Failed to set window bounds during bounce:', err)
        clearInterval(bounceTimer)
        this.isAnimating = false
        return
      }

      if (step >= bounceSteps) {
        clearInterval(bounceTimer)
        this.window.setBounds(finalBounds)
        this.isAnimating = false
      }
    }, 16)
  }

  showWindow() {
    if (!this.window || this.window.isDestroyed() || !this.isHidden || this.isAnimating)
      return

    clearTimeout(this.hideDebounceTimer)

    if (this.showDebounceTimer)
      return

    this.showDebounceTimer = setTimeout(() => {
      this.animateWindow(this.originalBounds, false)
      this.isHidden = false
      this.showDebounceTimer = null
    }, 100)
  }

  hideWindow() {
    if (!this.window || this.window.isDestroyed() || this.isHidden || this.isAnimating)
      return

    clearTimeout(this.showDebounceTimer)

    if (this.hideDebounceTimer)
      return

    this.hideDebounceTimer = setTimeout(() => {
      const hiddenBounds = this.getHiddenBounds()
      this.animateWindow(hiddenBounds, true)
      this.isHidden = true
      this.hideDebounceTimer = null
    }, 300)
  }

  initialize() {
    // Track window movement
    this.window.on('move', () => {
      if (!this.isHidden) {
        this.checkEdgeSnap()
      }
    })

    // Track drag start
    this.window.on('will-move', () => {
      this.isDragging = true
      if (this.dockEdge) {
        this.checkUndock()
      }
    })

    // Track drag end
    this.window.on('moved', () => {
      this.isDragging = false
    })

    // Track mouse position
    this.startMouseTracking()

    // Add window focus event listening
    this.window.on('blur', this.handleWindowBlur)
    this.window.on('focus', this.handleWindowFocus)

    // Check initial status
    if (this.window.isAlwaysOnTop()) {
      this.wasAlwaysOnTop = true
    }

    // Add window close event listener
    this.window.on('closed', () => {
      this.destroy()
    })

    // Listening to maximize event
    this.window.on('maximize', () => {
      this.isMaximized = true
      this.lastMaximizedState = true
      // 如果之前已贴边，则取消贴边状态
      if (this.dockEdge) {
        this.undock()
      }
    })

    // Listening to restore event
    this.window.on('unmaximize', () => {
      this.isMaximized = false
      // Add a short delay to avoid triggering welt checks
      setTimeout(() => {
        this.lastMaximizedState = false
      }, 100)
    })
  }

  handleWindowBlur() {
    if (this.isHidden) {
      this.setAlwaysOnTop(true)
    }
  }

  handleWindowFocus() {
    if (!this.isHidden && !this.wasAlwaysOnTop) {
      this.setAlwaysOnTop(false)
    }
  }

  setAlwaysOnTop(value) {
    try {
      if (!this.window || this.window.isDestroyed())
        return

      if (process.platform === 'darwin') {
        this.window.setAlwaysOnTop(value, 'floating')
      }
      else {
        this.window.setAlwaysOnTop(value)
      }
    }
    catch (err) {
      console.error('Failed to set always on top:', err)
    }
  }

  // Improved access to hidden location method to ensure that the window edge is always visible
  getHiddenBounds() {
    const currentBounds = this.window.getBounds()
    const display = screen.getDisplayNearestPoint({
      x: currentBounds.x,
      y: currentBounds.y,
    })
    const screenBounds = display.workArea

    let hiddenBounds = { ...currentBounds }
    const minVisiblePixels = 3 // To ensure that at least three pixels is visible

    switch (this.dockEdge) {
      case 'right':
        hiddenBounds.x = screenBounds.x + screenBounds.width - minVisiblePixels
        break
      case 'left':
        hiddenBounds.x = screenBounds.x - currentBounds.width + minVisiblePixels
        break
      case 'top':
        hiddenBounds.y = screenBounds.y - currentBounds.height + minVisiblePixels
        break
    }

    // Make sure the window does not completely hidden
    hiddenBounds = {
      x: Math.round(hiddenBounds.x),
      y: Math.round(hiddenBounds.y),
      width: currentBounds.width,
      height: currentBounds.height,
    }

    return hiddenBounds
  }

  // Add the window position recovery method
  restoreWindowPosition() {
    if (!this.dockEdge || !this.originalBounds)
      return

    const display = screen.getDisplayNearestPoint({
      x: this.originalBounds.x,
      y: this.originalBounds.y,
    })
    const screenBounds = display.workArea

    // Make sure the window within the scope of the screen
    const restoredBounds = { ...this.originalBounds }

    switch (this.dockEdge) {
      case 'right':
        restoredBounds.x = Math.min(
          restoredBounds.x,
          screenBounds.x + screenBounds.width - restoredBounds.width,
        )
        break
      case 'left':
        restoredBounds.x = Math.max(restoredBounds.x, screenBounds.x)
        break
      case 'top':
        restoredBounds.y = Math.max(restoredBounds.y, screenBounds.y)
        break
    }

    this.window.setBounds(restoredBounds)
  }

  destroy() {
    // Clear all timers
    this.cleanupAnimation()
    if (this.showDebounceTimer) {
      clearTimeout(this.showDebounceTimer)
      this.showDebounceTimer = null
    }
    if (this.hideDebounceTimer) {
      clearTimeout(this.hideDebounceTimer)
      this.hideDebounceTimer = null
    }
    if (this.mouseTrackingTimer) {
      clearInterval(this.mouseTrackingTimer)
      this.mouseTrackingTimer = null
    }

    // Clean up event listeners
    if (this.window && !this.window.isDestroyed()) {
      this.window.removeListener('blur', this.handleWindowBlur)
      this.window.removeListener('focus', this.handleWindowFocus)
      this.window.removeAllListeners()

      // Restore original always on top state
      if (this.window.isAlwaysOnTop() !== this.wasAlwaysOnTop) {
        this.setAlwaysOnTop(this.wasAlwaysOnTop)
      }
    }

    this.mouseMovementBuffer = []
    this.window = null
    this.dockEdge = null
    this.originalBounds = null
    this.isHidden = false
    this.isDragging = false
    this.isAnimating = false
  }

  startMouseTracking() {
    const trackMouse = () => {
      if (!this.dockEdge || !this.window || this.window.isDestroyed())
        return

      const currentTime = Date.now()
      const mousePos = screen.getCursorScreenPoint()

      // Update mouse movement buffer
      this.updateMouseBuffer(mousePos, currentTime)

      try {
        const windowBounds = this.window.getBounds()
        const display = screen.getDisplayNearestPoint(mousePos)
        const screenBounds = display.workArea

        // Check that the mouse is stable
        if (this.isMouseStable()) {
          if (this.isMouseNearEdge(mousePos, windowBounds, screenBounds)) {
            this.showWindow()
          }
          else if (this.isMouseOutsideWindow(mousePos, windowBounds)) {
            this.hideWindow()
          }
        }

        this.lastMousePosition = mousePos
      }
      catch (err) {
        // Window was destroyed, clean up
        this.destroy()
      }
    }

    this.mouseTrackingTimer = setInterval(trackMouse, 16)
  }

  updateMouseBuffer(mousePos, currentTime) {
    this.mouseMovementBuffer.push({
      x: mousePos.x,
      y: mousePos.y,
      time: currentTime,
    })

    if (this.mouseMovementBuffer.length > this.mouseBufferSize) {
      this.mouseMovementBuffer.shift()
    }
  }

  isMouseStable() {
    if (this.mouseMovementBuffer.length < this.mouseBufferSize)
      return true

    const recentMovements = this.mouseMovementBuffer.slice(-this.stablePositionThreshold)
    const firstPos = recentMovements[0]

    return recentMovements.every(pos =>
      Math.abs(pos.x - firstPos.x) <= this.stablePositionThreshold
      && Math.abs(pos.y - firstPos.y) <= this.stablePositionThreshold,
    )
  }

  calculateMouseVelocity() {
    if (this.mouseMovementBuffer.length < 2)
      return 0

    const latest = this.mouseMovementBuffer[this.mouseMovementBuffer.length - 1]
    const previous = this.mouseMovementBuffer[this.mouseMovementBuffer.length - 2]
    const timeDiff = latest.time - previous.time

    if (timeDiff === 0)
      return 0

    const distance = Math.sqrt(
      (latest.x - previous.x) ** 2
      + (latest.y - previous.y) ** 2,
    )

    return distance / timeDiff
  }

  isMouseNearEdge(mousePos, windowBounds, screenBounds) {
    const threshold = this.snapThreshold

    // Consider the offset of the window position
    const offset = 5
    const velocity = this.calculateMouseVelocity()

    // If the mouse moves too fast, the display is not triggered
    if (velocity > this.mouseVelocityThreshold)
      return false

    switch (this.dockEdge) {
      case 'right': {
        const rightEdge = screenBounds.x + screenBounds.width
        return mousePos.x >= rightEdge - threshold
          && mousePos.y >= windowBounds.y - offset
          && mousePos.y <= windowBounds.y + windowBounds.height + offset
      }
      case 'left': {
        return mousePos.x <= screenBounds.x + threshold
          && mousePos.y >= windowBounds.y - offset
          && mousePos.y <= windowBounds.y + windowBounds.height + offset
      }
      case 'top': {
        return mousePos.y <= screenBounds.y + threshold
          && mousePos.x >= windowBounds.x - offset
          && mousePos.x <= windowBounds.x + windowBounds.width + offset
      }
      default:
        return false
    }
  }

  isMouseOutsideWindow(mousePos, windowBounds) {
    const margin = 10 // Add edge tolerance
    return mousePos.x < windowBounds.x - margin
      || mousePos.x > windowBounds.x + windowBounds.width + margin
      || mousePos.y < windowBounds.y - margin
      || mousePos.y > windowBounds.y + windowBounds.height + margin
  }

  animateWindow(targetBounds, isHiding = false) {
    const currentTime = Date.now()
    if (currentTime - this.lastAnimationTime < this.animationCooldown) {
      return
    }

    if (this.animationTimer) {
      clearInterval(this.animationTimer)
    }

    if (this.isAnimating)
      return

    this.isAnimating = true
    this.lastAnimationTime = currentTime

    const startBounds = this.window.getBounds()
    // Make sure the start and destination positions are integers
    const sanitizedTargetBounds = {
      x: Math.round(targetBounds.x),
      y: Math.round(targetBounds.y),
      width: Math.round(targetBounds.width),
      height: Math.round(targetBounds.height),
    }

    let step = 0
    let lastBounds = startBounds

    const animate = () => {
      step++
      const progress = step / this.animationSteps
      const easeProgress = isHiding
        ? this.easeInCubic(progress)
        : this.easeOutCubic(progress)

      const currentBounds = {
        x: Math.round(startBounds.x + (sanitizedTargetBounds.x - startBounds.x) * easeProgress),
        y: Math.round(startBounds.y + (sanitizedTargetBounds.y - startBounds.y) * easeProgress),
        width: startBounds.width,
        height: startBounds.height,
      }

      // Prevent the same location from being set repeatedly
      if (this.boundsEqual(currentBounds, lastBounds)) {
        return
      }

      try {
        this.window.setBounds(currentBounds)
        lastBounds = currentBounds
      }
      catch (err) {
        console.error('Animation error:', err)
        this.cleanupAnimation()
        return
      }

      if (step >= this.animationSteps) {
        this.window.setBounds(sanitizedTargetBounds)
        this.cleanupAnimation()
      }
    }

    this.animationTimer = setInterval(animate, this.animationDuration / this.animationSteps)
  }

  boundsEqual(bounds1, bounds2) {
    return bounds1.x === bounds2.x
      && bounds1.y === bounds2.y
      && bounds1.width === bounds2.width
      && bounds1.height === bounds2.height
  }

  cleanupAnimation() {
    clearInterval(this.animationTimer)
    this.animationTimer = null
    this.isAnimating = false
  }

  checkUndock() {
    if (!this.dockEdge || !this.isDragging)
      return

    const windowBounds = this.window.getBounds()
    const display = screen.getDisplayNearestPoint({
      x: windowBounds.x,
      y: windowBounds.y,
    })
    const screenBounds = display.workArea

    const distanceFromRight = Math.abs(windowBounds.x + windowBounds.width - screenBounds.x - screenBounds.width)
    const distanceFromLeft = Math.abs(windowBounds.x - screenBounds.x)
    const distanceFromTop = Math.abs(windowBounds.y - screenBounds.y)

    let shouldUndock = false

    switch (this.dockEdge) {
      case 'right':
        shouldUndock = distanceFromRight > this.undockThreshold
        break
      case 'left':
        shouldUndock = distanceFromLeft > this.undockThreshold
        break
      case 'top':
        shouldUndock = distanceFromTop > this.undockThreshold
        break
    }

    if (shouldUndock) {
      this.undock()
    }
  }

  undock() {
    this.dockEdge = null
    this.originalBounds = null
    this.isHidden = false
    if (this.animationTimer) {
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }
  }

  checkEdgeSnap() {
    // If the window is maximized state or just recover from maximization, do not perform welt
    if (this.isMaximized || this.lastMaximizedState) {
      return
    }

    if (this.isDragging && this.dockEdge) {
      this.checkUndock()
      return
    }

    const windowBounds = this.window.getBounds()
    const display = screen.getDisplayNearestPoint({
      x: windowBounds.x,
      y: windowBounds.y,
    })
    const screenBounds = display.workArea

    const distanceFromRight = Math.abs(windowBounds.x + windowBounds.width - screenBounds.x - screenBounds.width)
    const distanceFromLeft = Math.abs(windowBounds.x - screenBounds.x)
    const distanceFromTop = Math.abs(windowBounds.y - screenBounds.y)

    // Check right edge
    if (distanceFromRight < this.snapThreshold) {
      this.dockToEdge('right', windowBounds)
    }
    // Check left edge
    else if (distanceFromLeft < this.snapThreshold) {
      this.dockToEdge('left', windowBounds)
    }
    // Check top edge
    else if (distanceFromTop < this.snapThreshold) {
      this.dockToEdge('top', windowBounds)
    }
  }

  dockToEdge(edge, bounds) {
    // If the maximum window does not perform welt
    if (this.isMaximized) {
      return
    }

    this.dockEdge = edge
    this.originalBounds = bounds

    const display = screen.getDisplayNearestPoint({
      x: bounds.x,
      y: bounds.y,
    })
    const screenBounds = display.workArea

    // Snap to exact position
    switch (edge) {
      case 'right':
        this.window.setBounds({
          x: screenBounds.x + screenBounds.width - bounds.width,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        })
        break
      case 'left':
        this.window.setBounds({
          x: screenBounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        })
        break
      case 'top':
        this.window.setBounds({
          x: bounds.x,
          y: screenBounds.y,
          width: bounds.width,
          height: bounds.height,
        })
        break
    }
  }
}

export default Edger
