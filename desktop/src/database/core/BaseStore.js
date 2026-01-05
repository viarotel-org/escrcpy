/**
 * 通用 Store 基类 - 提供统一的 CRUD 接口
 *
 * 设计思路：
 * 1. 抽象通用的数据操作方法，所有模块继承此类
 * 2. 统一的入参/出参格式
 * 3. 内置错误处理和数据校验
 * 4. 支持分页查询和条件过滤
 *
 * @module storage/core/BaseStore
 */

import { db } from './database.js'
import { createStorageError, StorageErrorTypes, validateData } from '../utils/validation.js'

/**
 * Store 配置选项
 * @typedef {Object} StoreConfig
 * @property {string} tableName - 表名
 * @property {Object} [schema] - 字段定义，用于数据校验
 * @property {string} [primaryKey='id'] - 主键字段名
 * @property {Array<string>} [requiredFields=[]] - 必填字段列表
 */

/**
 * 分页参数
 * @typedef {Object} PaginationParams
 * @property {number} [page=1] - 页码（从1开始）
 * @property {number} [pageSize=20] - 每页数量
 * @property {string} [orderBy] - 排序字段
 * @property {boolean} [desc=true] - 是否降序
 */

/**
 * 分页结果
 * @typedef {Object} PaginationResult
 * @property {Array} list - 数据列表
 * @property {number} total - 总记录数
 * @property {number} page - 当前页码
 * @property {number} pageSize - 每页数量
 * @property {number} totalPages - 总页数
 */

/**
 * 通用 Store 基类
 */
export class BaseStore {
  /**
   * @param {StoreConfig} config - Store 配置
   */
  constructor(config) {
    if (!config.tableName) {
      throw new Error('tableName is required for BaseStore')
    }

    this.tableName = config.tableName
    this.table = db.table(config.tableName)
    this.schema = config.schema || {}
    this.primaryKey = config.primaryKey || 'id'
    this.requiredFields = config.requiredFields || []
  }

  /**
   * 添加单条记录
   * @param {Object} data - 要添加的数据
   * @returns {Promise<{success: boolean, data?: any, error?: Object}>}
   */
  async add(data) {
    try {
      // 数据校验
      const validation = validateData(data, this.requiredFields, this.schema)
      if (!validation.valid) {
        return {
          success: false,
          error: createStorageError(
            StorageErrorTypes.VALIDATION_ERROR,
            validation.message,
            validation.errors,
          ),
        }
      }

      // 添加时间戳（如果 schema 中定义了）
      const record = {
        ...data,
        createdAt: data.createdAt || Date.now(),
        updatedAt: Date.now(),
      }

      const id = await this.table.add(record)

      return {
        success: true,
        data: { ...record, [this.primaryKey]: id },
      }
    }
    catch (error) {
      console.error(`[${this.tableName}] Add error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 批量添加记录
   * @param {Array<Object>} items - 要添加的数据数组
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async bulkAdd(items) {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        return {
          success: false,
          error: createStorageError(
            StorageErrorTypes.VALIDATION_ERROR,
            'Items must be a non-empty array',
          ),
        }
      }

      const now = Date.now()
      const records = items.map(item => ({
        ...item,
        createdAt: item.createdAt || now,
        updatedAt: now,
      }))

      const ids = await this.table.bulkAdd(records, { allKeys: true })

      return {
        success: true,
        data: records.map((record, index) => ({
          ...record,
          [this.primaryKey]: ids[index],
        })),
      }
    }
    catch (error) {
      console.error(`[${this.tableName}] BulkAdd error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 根据主键获取单条记录
   * @param {any} id - 主键值
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  async getById(id) {
    try {
      const record = await this.table.get(id)

      if (!record) {
        return {
          success: false,
          error: createStorageError(
            StorageErrorTypes.NOT_FOUND,
            `Record with ${this.primaryKey}=${id} not found`,
          ),
        }
      }

      return { success: true, data: record }
    }
    catch (error) {
      console.error(`[${this.tableName}] GetById error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.READ_ERROR, error.message),
      }
    }
  }

  /**
   * 获取所有记录
   * @param {Object} [options] - 查询选项
   * @param {string} [options.orderBy] - 排序字段
   * @param {boolean} [options.desc] - 是否降序
   * @returns {Promise<{success: boolean, data?: Array, error?: Object}>}
   */
  async getAll(options = {}) {
    try {
      let collection = this.table.toCollection()

      if (options.orderBy) {
        collection = this.table.orderBy(options.orderBy)
        if (options.desc !== false) {
          collection = collection.reverse()
        }
      }

      const records = await collection.toArray()

      return { success: true, data: records }
    }
    catch (error) {
      console.error(`[${this.tableName}] GetAll error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.READ_ERROR, error.message),
      }
    }
  }

  /**
   * 分页查询
   * @param {PaginationParams} params - 分页参数
   * @param {Object} [filter] - 过滤条件（索引字段）
   * @returns {Promise<{success: boolean, data?: PaginationResult, error?: Object}>}
   */
  async getList(params = {}, filter = {}) {
    try {
      const {
        page = 1,
        pageSize = 20,
        orderBy = 'createdAt',
        desc = true,
      } = params

      // 构建查询
      let collection

      // 如果有索引过滤条件
      const filterKeys = Object.keys(filter)
      if (filterKeys.length > 0) {
        const [firstKey] = filterKeys
        collection = this.table.where(firstKey).equals(filter[firstKey])

        // 链式添加其他条件
        for (let i = 1; i < filterKeys.length; i++) {
          const key = filterKeys[i]
          collection = collection.and(item => item[key] === filter[key])
        }
      }
      else {
        collection = this.table.toCollection()
      }

      // 获取总数
      const total = await collection.count()

      // 排序
      let query = collection
      if (orderBy) {
        // 需要重新创建带排序的查询
        if (filterKeys.length > 0) {
          const [firstKey] = filterKeys
          query = this.table.where(firstKey).equals(filter[firstKey])
        }
        else {
          query = this.table.orderBy(orderBy)
        }
      }

      // 分页
      const offset = (page - 1) * pageSize
      let records = await query.toArray()

      // 手动排序（当使用 where 时 orderBy 不可用）
      if (filterKeys.length > 0 && orderBy) {
        records.sort((a, b) => {
          const aVal = a[orderBy]
          const bVal = b[orderBy]
          return desc ? bVal - aVal : aVal - bVal
        })
      }
      else if (desc && orderBy) {
        records = records.reverse()
      }

      // 截取分页数据
      const list = records.slice(offset, offset + pageSize)

      return {
        success: true,
        data: {
          list,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      }
    }
    catch (error) {
      console.error(`[${this.tableName}] GetList error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.READ_ERROR, error.message),
      }
    }
  }

  /**
   * 更新记录
   * @param {any} id - 主键值
   * @param {Object} changes - 要更新的字段
   * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
   */
  async update(id, changes) {
    try {
      const exists = await this.table.get(id)
      if (!exists) {
        return {
          success: false,
          error: createStorageError(
            StorageErrorTypes.NOT_FOUND,
            `Record with ${this.primaryKey}=${id} not found`,
          ),
        }
      }

      const updateData = {
        ...changes,
        updatedAt: Date.now(),
      }

      await this.table.update(id, updateData)

      // 返回更新后的完整记录
      const updated = await this.table.get(id)

      return { success: true, data: updated }
    }
    catch (error) {
      console.error(`[${this.tableName}] Update error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 删除单条记录
   * @param {any} id - 主键值
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  async deleteById(id) {
    try {
      await this.table.delete(id)
      return { success: true }
    }
    catch (error) {
      console.error(`[${this.tableName}] DeleteById error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 批量删除
   * @param {Array<any>} ids - 主键值数组
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  async bulkDelete(ids) {
    try {
      await this.table.bulkDelete(ids)
      return { success: true }
    }
    catch (error) {
      console.error(`[${this.tableName}] BulkDelete error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 清空所有记录
   * @returns {Promise<{success: boolean, error?: Object}>}
   */
  async clearAll() {
    try {
      await this.table.clear()
      return { success: true }
    }
    catch (error) {
      console.error(`[${this.tableName}] ClearAll error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.WRITE_ERROR, error.message),
      }
    }
  }

  /**
   * 获取记录总数
   * @param {Object} [filter] - 过滤条件
   * @returns {Promise<{success: boolean, data?: number, error?: Object}>}
   */
  async count(filter = {}) {
    try {
      let collection

      const filterKeys = Object.keys(filter)
      if (filterKeys.length > 0) {
        const [firstKey] = filterKeys
        collection = this.table.where(firstKey).equals(filter[firstKey])
      }
      else {
        collection = this.table.toCollection()
      }

      const total = await collection.count()

      return { success: true, data: total }
    }
    catch (error) {
      console.error(`[${this.tableName}] Count error:`, error)
      return {
        success: false,
        error: createStorageError(StorageErrorTypes.READ_ERROR, error.message),
      }
    }
  }

  /**
   * 获取 Dexie Table 实例，用于自定义查询
   * @returns {import('dexie').Table}
   */
  getTable() {
    return this.table
  }
}

export default BaseStore
