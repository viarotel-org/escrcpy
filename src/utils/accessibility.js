/**
 * Accessibility utilities for escrcpy
 * Provides comprehensive accessibility features and utilities
 */

/**
 * ARIA labels and descriptions for common UI elements
 */
export const ARIA_LABELS = {
  // Device management
  deviceList: 'Android device list',
  deviceItem: 'Android device',
  deviceConnect: 'Connect to device',
  deviceDisconnect: 'Disconnect from device',
  deviceRefresh: 'Refresh device list',
  
  // Screen mirroring
  screenMirror: 'Screen mirroring window',
  screenControl: 'Screen control area',
  screenFullscreen: 'Toggle fullscreen mode',
  screenRotate: 'Rotate screen',
  screenScreenshot: 'Take screenshot',
  
  // Settings and preferences
  settingsPanel: 'Settings panel',
  settingsTab: 'Settings tab',
  settingsInput: 'Settings input field',
  settingsToggle: 'Settings toggle',
  settingsSave: 'Save settings',
  settingsReset: 'Reset settings',
  
  // Navigation
  navigationMenu: 'Main navigation menu',
  navigationItem: 'Navigation item',
  navigationBack: 'Go back',
  navigationHome: 'Go to home',
  
  // Actions
  actionButton: 'Action button',
  actionPrimary: 'Primary action',
  actionSecondary: 'Secondary action',
  actionDanger: 'Dangerous action',
  
  // Status and feedback
  statusIndicator: 'Status indicator',
  loadingSpinner: 'Loading spinner',
  errorMessage: 'Error message',
  successMessage: 'Success message',
  warningMessage: 'Warning message',
  
  // Form elements
  formField: 'Form field',
  formLabel: 'Form label',
  formHelp: 'Form help text',
  formError: 'Form error message',
  formRequired: 'Required field',
  
  // Media controls
  mediaPlay: 'Play media',
  mediaPause: 'Pause media',
  mediaStop: 'Stop media',
  mediaVolume: 'Volume control',
  mediaMute: 'Mute audio',
  
  // Window management
  windowMinimize: 'Minimize window',
  windowMaximize: 'Maximize window',
  windowClose: 'Close window',
  windowResize: 'Resize window',
}

/**
 * Keyboard shortcuts and navigation
 */
export const KEYBOARD_SHORTCUTS = {
  // Global shortcuts
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  
  // Application shortcuts
  REFRESH_DEVICES: 'F5',
  CONNECT_DEVICE: 'Ctrl+Enter',
  DISCONNECT_DEVICE: 'Ctrl+Shift+Enter',
  SCREENSHOT: 'Ctrl+S',
  FULLSCREEN: 'F11',
  SETTINGS: 'Ctrl+,',
  HELP: 'F1',
  
  // Navigation shortcuts
  NEXT_TAB: 'Ctrl+Tab',
  PREVIOUS_TAB: 'Ctrl+Shift+Tab',
  CLOSE_TAB: 'Ctrl+W',
  NEW_TAB: 'Ctrl+T',
}

/**
 * Screen reader announcements
 */
export class ScreenReader {
  static announce(message, priority = 'polite') {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  static announceError(message) {
    this.announce(`Error: ${message}`, 'assertive')
  }
  
  static announceSuccess(message) {
    this.announce(`Success: ${message}`, 'polite')
  }
  
  static announceWarning(message) {
    this.announce(`Warning: ${message}`, 'polite')
  }
  
  static announceInfo(message) {
    this.announce(`Info: ${message}`, 'polite')
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  static trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    })
  }
  
  static restoreFocus(element) {
    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  }
  
  static getFocusableElements(container) {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  }
  
  static focusFirst(container) {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }
  
  static focusLast(container) {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
    }
  }
}

/**
 * Color contrast utilities
 */
export class ColorContrast {
  static getLuminance(hex) {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return 0
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  static getContrastRatio(color1, color2) {
    const lum1 = this.getLuminance(color1)
    const lum2 = this.getLuminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }
  
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  static isAccessible(color1, color2, level = 'AA') {
    const ratio = this.getContrastRatio(color1, color2)
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
  static handleArrowKeys(event, items, currentIndex) {
    let newIndex = currentIndex
    
    switch (event.key) {
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case 'ArrowDown':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = items.length - 1
        break
      default:
        return currentIndex
    }
    
    event.preventDefault()
    return newIndex
  }
  
  static handleEscape(event, callback) {
    if (event.key === 'Escape') {
      event.preventDefault()
      callback()
    }
  }
  
  static handleEnter(event, callback) {
    if (event.key === 'Enter') {
      event.preventDefault()
      callback()
    }
  }
  
  static handleSpace(event, callback) {
    if (event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }
}

/**
 * Accessibility validation utilities
 */
export class AccessibilityValidator {
  static validateImage(img) {
    const issues = []
    
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push('Image missing alt text or aria-label')
    }
    
    if (img.alt === '' && img.getAttribute('role') !== 'presentation') {
      issues.push('Image has empty alt text but is not decorative')
    }
    
    return issues
  }
  
  static validateButton(button) {
    const issues = []
    
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      issues.push('Button missing accessible name')
    }
    
    if (button.disabled && !button.getAttribute('aria-disabled')) {
      issues.push('Disabled button missing aria-disabled attribute')
    }
    
    return issues
  }
  
  static validateForm(form) {
    const issues = []
    const inputs = form.querySelectorAll('input, select, textarea')
    
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${input.id}"]`)
        if (!label) {
          issues.push(`Input missing label or aria-label: ${input.name || input.id}`)
        }
      }
    })
    
    return issues
  }
  
  static validatePage() {
    const issues = []
    
    // Check for page title
    if (!document.title) {
      issues.push('Page missing title')
    }
    
    // Check for main landmark
    if (!document.querySelector('main, [role="main"]')) {
      issues.push('Page missing main landmark')
    }
    
    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > previousLevel + 1) {
        issues.push(`Heading hierarchy skipped: ${heading.tagName}`)
      }
      previousLevel = level
    })
    
    return issues
  }
}

/**
 * Performance monitoring for accessibility
 */
export class AccessibilityPerformance {
  static measureFocusTime(element) {
    const startTime = performance.now()
    
    element.addEventListener('focus', () => {
      const focusTime = performance.now() - startTime
      console.log(`Focus time: ${focusTime.toFixed(2)}ms`)
    })
  }
  
  static measureRenderTime(component) {
    const startTime = performance.now()
    
    return () => {
      const renderTime = performance.now() - startTime
      console.log(`Render time: ${renderTime.toFixed(2)}ms`)
    }
  }
}

/**
 * Vue composable for accessibility
 */
export function useAccessibility() {
  const announce = (message, priority = 'polite') => {
    ScreenReader.announce(message, priority)
  }
  
  const announceError = (message) => {
    ScreenReader.announceError(message)
  }
  
  const announceSuccess = (message) => {
    ScreenReader.announceSuccess(message)
  }
  
  const trapFocus = (element) => {
    FocusManager.trapFocus(element)
  }
  
  const restoreFocus = (element) => {
    FocusManager.restoreFocus(element)
  }
  
  const handleKeyboardNavigation = (event, items, currentIndex) => {
    return KeyboardNavigation.handleArrowKeys(event, items, currentIndex)
  }
  
  const validateAccessibility = () => {
    return AccessibilityValidator.validatePage()
  }
  
  return {
    announce,
    announceError,
    announceSuccess,
    trapFocus,
    restoreFocus,
    handleKeyboardNavigation,
    validateAccessibility,
    ARIA_LABELS,
    KEYBOARD_SHORTCUTS,
  }
}

/**
 * CSS classes for screen reader only content
 */
export const SR_ONLY_CSS = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
`

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.querySelector('#accessibility-styles')) {
  const style = document.createElement('style')
  style.id = 'accessibility-styles'
  style.textContent = SR_ONLY_CSS
  document.head.appendChild(style)
}
