/**
 * IPCX Channel 池管理模块
 * 优化高频调用场景下的 channel 生成开销
 */

import { nanoid } from 'nanoid'

export interface ChannelPoolOptions {
  /**
   * 池中预分配的 channel 数量
   * @default 10
   */
  poolSize?: number
  
  /**
   * 当池耗尽时是否自动扩容
   * @default true
   */
  autoExpand?: boolean
  
  /**
   * 每次扩容增加的 channel 数量
   * @default 5
   */
  expandSize?: number
  
  /**
   * Channel 前缀
   * @default ''
   */
  prefix?: string
}

/**
 * Channel 池管理器
 * 用于减少 nanoid() 调用次数，提升性能
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
    
    // 预分配 channel
    this.expand(this.options.poolSize)
  }
  
  /**
   * 扩容池
   */
  private expand(count: number) {
    for (let i = 0; i < count; i++) {
      const channel = this.generateChannel()
      this.pool.push(channel)
    }
  }
  
  /**
   * 生成新的 channel
   */
  private generateChannel(): string {
    const suffix = nanoid(8)
    return this.options.prefix ? `${this.options.prefix}_${suffix}` : suffix
  }
  
  /**
   * 获取可用 channel
   */
  acquire(): string {
    // 如果池为空且允许扩容
    if (this.pool.length === 0) {
      if (this.options.autoExpand) {
        this.expand(this.options.expandSize)
      }
      else {
        // 池耗尽且不扩容，直接生成新 channel
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
   * 释放 channel 回收到池中
   */
  release(channel: string) {
    if (!this.inUse.has(channel)) {
      return // 不是从池中分配的 channel
    }
    
    this.inUse.delete(channel)
    
    // 避免池无限增长
    if (this.pool.length < this.options.poolSize * 2) {
      this.pool.push(channel)
    }
  }
  
  /**
   * 批量释放 channels
   */
  releaseAll(channels: string[]) {
    channels.forEach(channel => this.release(channel))
  }
  
  /**
   * 获取池状态信息
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size,
    }
  }
  
  /**
   * 清空池
   */
  clear() {
    this.pool = []
    this.inUse.clear()
  }
}

/**
 * 简单的基于时间戳的 channel 生成器（更轻量级）
 */
export class SimpleChannelGenerator {
  private counter = 0
  private prefix: string
  
  constructor(prefix = '') {
    this.prefix = prefix
  }
  
  /**
   * 生成 channel
   * 格式: prefix_timestamp_counter
   */
  generate(): string {
    const timestamp = Date.now()
    const count = this.counter++
    
    // 重置计数器防止溢出
    if (this.counter > 9999) {
      this.counter = 0
    }
    
    const suffix = `${timestamp}_${count.toString().padStart(4, '0')}`
    return this.prefix ? `${this.prefix}_${suffix}` : suffix
  }
}

/**
 * 混合策略：结合池化和即时生成
 * 对于函数参数较少的调用使用池化，函数较多的直接生成避免池污染
 */
export class HybridChannelProvider {
  private pool: ChannelPool
  private generator: SimpleChannelGenerator
  private threshold: number
  
  constructor(
    poolOptions?: ChannelPoolOptions,
    threshold = 3, // 函数参数超过此阈值使用即时生成
  ) {
    this.pool = new ChannelPool(poolOptions)
    this.generator = new SimpleChannelGenerator(poolOptions?.prefix)
    this.threshold = threshold
  }
  
  /**
   * 获取 channel（自动选择策略）
   */
  acquire(functionCount: number): {
    channel: string
    release: () => void
  } {
    // 函数参数较多时使用即时生成
    if (functionCount > this.threshold) {
      const channel = this.generator.generate()
      return {
        channel,
        release: () => {}, // 即时生成的不需要释放
      }
    }
    
    // 函数参数较少时使用池化
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
