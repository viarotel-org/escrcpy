/**
 * IPCX Channel Pool Manager
 * Optimizes channel generation overhead for high-frequency call scenarios
 */

import { nanoid } from 'nanoid'

export interface ChannelPoolOptions {
  /**
   * Number of channels pre-allocated in the pool
   * @default 10
   */
  poolSize?: number

  /**
   * Whether to auto-expand when the pool is exhausted
   * @default true
   */
  autoExpand?: boolean

  /**
   * Number of channels to add on each expansion
   * @default 5
   */
  expandSize?: number

  /**
   * Channel prefix
   * @default ''
   */
  prefix?: string
}

/**
 * Channel pool manager
 * Reduces nanoid() calls to improve performance
 */
export class ChannelPool {
  private pool: string[] = []
  private inUse = new Set<string>()
  private options: Required<ChannelPoolOptions>

  constructor(options: ChannelPoolOptions = {}) {
    this.options = {
      poolSize: options.poolSize ?? 10,
      autoExpand: options.autoExpand ?? true,
      expandSize: options.expandSize ?? 5,
      prefix: options.prefix ?? '',
    }

    // Pre-allocate channels
    this.expand(this.options.poolSize)
  }

  /**
   * Expand the pool
   */
  private expand(count: number) {
    for (let i = 0; i < count; i++) {
      const channel = this.generateChannel()
      this.pool.push(channel)
    }
  }

  /**
   * Generate a new channel
   */
  private generateChannel(): string {
    const suffix = nanoid(8)
    return this.options.prefix ? `${this.options.prefix}_${suffix}` : suffix
  }

  /**
   * Acquire an available channel
   */
  acquire(): string {
    // If the pool is empty and auto-expansion is allowed
    if (this.pool.length === 0) {
      if (this.options.autoExpand) {
        this.expand(this.options.expandSize)
      }
      else {
        // Pool exhausted and auto-expansion disabled: generate a new channel directly
        const channel = this.generateChannel()
        this.inUse.add(channel)
        return channel
      }
    }

    const channel = this.pool.pop()!
    this.inUse.add(channel)
    return channel
  }

  /**
   * Release a channel back to the pool
   */
  release(channel: string) {
    if (!this.inUse.has(channel)) {
      return // Channel was not allocated from the pool
    }

    this.inUse.delete(channel)

    // Avoid unbounded pool growth
    if (this.pool.length < this.options.poolSize * 2) {
      this.pool.push(channel)
    }
  }

  /**
   * Release multiple channels
   */
  releaseAll(channels: string[]) {
    channels.forEach(channel => this.release(channel))
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size,
    }
  }

  /**
   * Clear the pool
   */
  clear() {
    this.pool = []
    this.inUse.clear()
  }
}

/**
 * Simple timestamp-based channel generator (lightweight)
 */
export class SimpleChannelGenerator {
  private counter = 0
  private prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  /**
   * Generate a channel
   * Format: prefix_timestamp_counter
   */
  generate(): string {
    const timestamp = Date.now()
    const count = this.counter++

    // Reset counter to prevent overflow
    if (this.counter > 9999) {
      this.counter = 0
    }

    const suffix = `${timestamp}_${count.toString().padStart(4, '0')}`
    return this.prefix ? `${this.prefix}_${suffix}` : suffix
  }
}

/**
 * Hybrid strategy: combine pooling and on-demand generation
 * Use pooling for low-argument calls and direct generation for high-argument calls to avoid pool pollution
 */
export class HybridChannelProvider {
  private pool: ChannelPool
  private generator: SimpleChannelGenerator
  private threshold: number

  constructor(
    poolOptions?: ChannelPoolOptions,
    threshold = 3, // Use on-demand generation if function argument count exceeds this threshold
  ) {
    this.pool = new ChannelPool(poolOptions)
    this.generator = new SimpleChannelGenerator(poolOptions?.prefix)
    this.threshold = threshold
  }

  /**
   * Acquire a channel (automatic selection strategy)
   */
  acquire(functionCount: number): {
    channel: string
    release: () => void
  } {
    // Use on-demand generation for high-argument calls
    if (functionCount > this.threshold) {
      const channel = this.generator.generate()
      return {
        channel,
        release: () => {}, // On-demand channels do not require release
      }
    }

    // Use pooling for low-argument calls
    const channel = this.pool.acquire()
    return {
      channel,
      release: () => this.pool.release(channel),
    }
  }

  getStats() {
    return this.pool.getStats()
  }
}
