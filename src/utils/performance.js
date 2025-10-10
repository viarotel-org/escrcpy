/**
 * Performance optimization utilities for escrcpy
 * Provides comprehensive performance monitoring and optimization features
 */

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  constructor(name = 'escrcpy') {
    this.name = name
    this.metrics = new Map()
    this.observers = new Map()
    this.startTimes = new Map()
  }
  
  /**
   * Start timing an operation
   */
  startTimer(operation) {
    this.startTimes.set(operation, performance.now())
  }
  
  /**
   * End timing an operation and record the result
   */
  endTimer(operation) {
    const startTime = this.startTimes.get(operation)
    if (!startTime) {
      console.warn(`Timer for operation '${operation}' was not started`)
      return 0
    }
    
    const duration = performance.now() - startTime
    this.startTimes.delete(operation)
    
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    this.metrics.get(operation).push(duration)
    
    console.log(`[${this.name}] ${operation}: ${duration.toFixed(2)}ms`)
    return duration
  }
  
  /**
   * Get performance statistics for an operation
   */
  getStats(operation) {
    const times = this.metrics.get(operation)
    if (!times || times.length === 0) {
      return null
    }
    
    const sorted = [...times].sort((a, b) => a - b)
    const sum = times.reduce((a, b) => a + b, 0)
    
    return {
      count: times.length,
      total: sum,
      average: sum / times.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    }
  }
  
  /**
   * Get all performance statistics
   */
  getAllStats() {
    const stats = {}
    for (const operation of this.metrics.keys()) {
      stats[operation] = this.getStats(operation)
    }
    return stats
  }
  
  /**
   * Reset all metrics
   */
  reset() {
    this.metrics.clear()
    this.startTimes.clear()
  }
  
  /**
   * Start monitoring Web Vitals
   */
  startWebVitalsMonitoring() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('lcp', lcpObserver)
      
      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          console.log(`FID: ${entry.processingStart - entry.startTime}ms`)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.set('fid', fidObserver)
      
      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        console.log(`CLS: ${clsValue.toFixed(4)}`)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('cls', clsObserver)
    }
  }
  
  /**
   * Stop all observers
   */
  stopMonitoring() {
    for (const observer of this.observers.values()) {
      observer.disconnect()
    }
    this.observers.clear()
  }
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  constructor() {
    this.measurements = []
    this.intervalId = null
  }
  
  /**
   * Start monitoring memory usage
   */
  startMonitoring(interval = 5000) {
    if (this.intervalId) {
      this.stopMonitoring()
    }
    
    this.intervalId = setInterval(() => {
      this.measureMemory()
    }, interval)
  }
  
  /**
   * Stop monitoring memory usage
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
  
  /**
   * Measure current memory usage
   */
  measureMemory() {
    if ('memory' in performance) {
      const memory = performance.memory
      const measurement = {
        timestamp: Date.now(),
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      }
      
      this.measurements.push(measurement)
      
      // Keep only last 100 measurements
      if (this.measurements.length > 100) {
        this.measurements = this.measurements.slice(-100)
      }
      
      console.log(`Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB used`)
    }
  }
  
  /**
   * Get memory statistics
   */
  getMemoryStats() {
    if (this.measurements.length === 0) {
      return null
    }
    
    const usedSizes = this.measurements.map(m => m.usedJSHeapSize)
    const totalSizes = this.measurements.map(m => m.totalJSHeapSize)
    
    return {
      count: this.measurements.length,
      avgUsed: usedSizes.reduce((a, b) => a + b, 0) / usedSizes.length,
      maxUsed: Math.max(...usedSizes),
      minUsed: Math.min(...usedSizes),
      avgTotal: totalSizes.reduce((a, b) => a + b, 0) / totalSizes.length,
      maxTotal: Math.max(...totalSizes),
      minTotal: Math.min(...totalSizes),
    }
  }
  
  /**
   * Check for memory leaks
   */
  checkMemoryLeak() {
    if (this.measurements.length < 10) {
      return false
    }
    
    const recent = this.measurements.slice(-10)
    const older = this.measurements.slice(-20, -10)
    
    if (older.length === 0) {
      return false
    }
    
    const recentAvg = recent.reduce((a, b) => a + b.usedJSHeapSize, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b.usedJSHeapSize, 0) / older.length
    
    // Consider it a leak if memory usage increased by more than 50%
    return recentAvg > olderAvg * 1.5
  }
}

/**
 * Component performance optimization
 */
export class ComponentOptimizer {
  /**
   * Debounce function calls
   */
  static debounce(func, wait, immediate = false) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func(...args)
    }
  }
  
  /**
   * Throttle function calls
   */
  static throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
  
  /**
   * Lazy load images
   */
  static lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      })
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }
  
  /**
   * Virtual scrolling for large lists
   */
  static createVirtualScroller(container, itemHeight, totalItems, renderItem) {
    const visibleItems = Math.ceil(container.clientHeight / itemHeight)
    const buffer = 5
    
    let scrollTop = 0
    let startIndex = 0
    let endIndex = Math.min(startIndex + visibleItems + buffer, totalItems)
    
    const updateVisibleItems = () => {
      const newStartIndex = Math.floor(scrollTop / itemHeight)
      const newEndIndex = Math.min(newStartIndex + visibleItems + buffer, totalItems)
      
      if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
        startIndex = newStartIndex
        endIndex = newEndIndex
        
        // Clear container
        container.innerHTML = ''
        
        // Add spacer for items before visible range
        const topSpacer = document.createElement('div')
        topSpacer.style.height = `${startIndex * itemHeight}px`
        container.appendChild(topSpacer)
        
        // Render visible items
        for (let i = startIndex; i < endIndex; i++) {
          const item = renderItem(i)
          item.style.height = `${itemHeight}px`
          container.appendChild(item)
        }
        
        // Add spacer for items after visible range
        const bottomSpacer = document.createElement('div')
        bottomSpacer.style.height = `${(totalItems - endIndex) * itemHeight}px`
        container.appendChild(bottomSpacer)
      }
    }
    
    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop
      updateVisibleItems()
    })
    
    // Initial render
    updateVisibleItems()
  }
}

/**
 * Network performance monitoring
 */
export class NetworkMonitor {
  constructor() {
    this.requests = new Map()
    this.startMonitoring()
  }
  
  /**
   * Start monitoring network requests
   */
  startMonitoring() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
            this.recordRequest(entry)
          }
        })
      })
      observer.observe({ entryTypes: ['navigation', 'resource'] })
    }
  }
  
  /**
   * Record a network request
   */
  recordRequest(entry) {
    const request = {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration,
      size: entry.transferSize || 0,
      startTime: entry.startTime,
      endTime: entry.startTime + entry.duration,
    }
    
    this.requests.set(entry.name, request)
    
    // Keep only last 100 requests
    if (this.requests.size > 100) {
      const firstKey = this.requests.keys().next().value
      this.requests.delete(firstKey)
    }
  }
  
  /**
   * Get network statistics
   */
  getNetworkStats() {
    const requests = Array.from(this.requests.values())
    if (requests.length === 0) {
      return null
    }
    
    const durations = requests.map(r => r.duration)
    const sizes = requests.map(r => r.size)
    
    return {
      totalRequests: requests.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
      totalSize: sizes.reduce((a, b) => a + b, 0),
      avgSize: sizes.reduce((a, b) => a + b, 0) / sizes.length,
    }
  }
}

/**
 * Vue composable for performance monitoring
 */
export function usePerformance() {
  const performanceMonitor = new PerformanceMonitor('escrcpy')
  const memoryMonitor = new MemoryMonitor()
  const networkMonitor = new NetworkMonitor()
  
  const startTimer = (operation) => {
    performanceMonitor.startTimer(operation)
  }
  
  const endTimer = (operation) => {
    return performanceMonitor.endTimer(operation)
  }
  
  const getStats = (operation) => {
    return performanceMonitor.getStats(operation)
  }
  
  const getAllStats = () => {
    return performanceMonitor.getAllStats()
  }
  
  const startMemoryMonitoring = (interval) => {
    memoryMonitor.startMonitoring(interval)
  }
  
  const stopMemoryMonitoring = () => {
    memoryMonitor.stopMonitoring()
  }
  
  const getMemoryStats = () => {
    return memoryMonitor.getMemoryStats()
  }
  
  const checkMemoryLeak = () => {
    return memoryMonitor.checkMemoryLeak()
  }
  
  const getNetworkStats = () => {
    return networkMonitor.getNetworkStats()
  }
  
  const debounce = (func, wait, immediate) => {
    return ComponentOptimizer.debounce(func, wait, immediate)
  }
  
  const throttle = (func, limit) => {
    return ComponentOptimizer.throttle(func, limit)
  }
  
  const lazyLoadImages = () => {
    ComponentOptimizer.lazyLoadImages()
  }
  
  const createVirtualScroller = (container, itemHeight, totalItems, renderItem) => {
    return ComponentOptimizer.createVirtualScroller(container, itemHeight, totalItems, renderItem)
  }
  
  return {
    startTimer,
    endTimer,
    getStats,
    getAllStats,
    startMemoryMonitoring,
    stopMemoryMonitoring,
    getMemoryStats,
    checkMemoryLeak,
    getNetworkStats,
    debounce,
    throttle,
    lazyLoadImages,
    createVirtualScroller,
  }
}

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor('escrcpy-global')
export const globalMemoryMonitor = new MemoryMonitor()
export const globalNetworkMonitor = new NetworkMonitor()

// Start global monitoring
if (typeof window !== 'undefined') {
  globalPerformanceMonitor.startWebVitalsMonitoring()
  globalMemoryMonitor.startMonitoring(10000) // Monitor every 10 seconds
}
