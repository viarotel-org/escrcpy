/**
 * Generic Base Store class - provides unified CRUD interfaces
 *
 * Design:
 * 1. Abstract common data operations, inherited by modules
 * 2. Unified input/output formats
 * 3. Built-in error handling and data validation
 * 4. Support pagination and filtered queries
 *
 * @module storage/core/BaseStore
 */

import { db } from './database.js'
import { createStorageError, StorageErrorTypes, validateData } from '../utils/validation.js'

/**
 * Store configuration options
 * @typedef {Object} StoreConfig
 * @property {string} tableName - Table name
 * @property {Object} [schema] - Field definitions for validation
 * @property {string} [primaryKey='id'] - Primary key field name
 * @property {Array<string>} [requiredFields=[]] - Required field list
 */

/**
 * Pagination parameters
 * @typedef {Object} PaginationParams
 * @property {number} [page=1] - Page number (1-based)
 * @property {number} [pageSize=20] - Items per page
 * @property {string} [orderBy] - Sort field
 * @property {boolean} [desc=true] - Descending order
 */

/**
 * Pagination result
 * @typedef {Object} PaginationResult
 * @property {Array} list - Data list
 * @property {number} total - Total record count
 * @property {number} page - Current page number
 * @property {number} pageSize - Items per page
 * @property {number} totalPages - Total page count
 */

/**
 * Base Store class
 */
export class BaseStore {
  /**
   * @param {StoreConfig} config - Store config
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
   * Add a single record
   * @param {Object} data - Data to add
   * @returns {Promise<{success: boolean, data?: any, error?: Object}>}
   */
  async add(data) {
    try {
      // Data validation
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

      // Add timestamps (if schema defines them)
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
   * Bulk add records
   * @param {Array<Object>} items - Array of items to add
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
   * Get a single record by primary key
   * @param {any} id - Primary key value
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
   * Get all records
   * @param {Object} [options] - Query options
   * @param {string} [options.orderBy] - Sort field
   * @param {boolean} [options.desc] - Descending
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
   * Paged query
   * @param {PaginationParams} params - Pagination parameters
   * @param {Object} [filter] - Filter conditions (indexed fields)
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

      // Build query
      let collection

      // If there are indexed filter conditions
      const filterKeys = Object.keys(filter)
      if (filterKeys.length > 0) {
        const [firstKey] = filterKeys
        collection = this.table.where(firstKey).equals(filter[firstKey])

        // Chain additional conditions
        for (let i = 1; i < filterKeys.length; i++) {
          const key = filterKeys[i]
          collection = collection.and(item => item[key] === filter[key])
        }
      }
      else {
        collection = this.table.toCollection()
      }

      // Get total count
      const total = await collection.count()

      // Sorting
      let query = collection
      if (orderBy) {
        // Need to recreate query with ordering
        if (filterKeys.length > 0) {
          const [firstKey] = filterKeys
          query = this.table.where(firstKey).equals(filter[firstKey])
        }
        else {
          query = this.table.orderBy(orderBy)
        }
      }

      // Pagination
      const offset = (page - 1) * pageSize
      let records = await query.toArray()

      // Manual sort (orderBy not available when using where)
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

      // Slice pagination data
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
   * Update record
   * @param {any} id - Primary key value
   * @param {Object} changes - Fields to update
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

      // Return the updated full record
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
   * Delete a single record
   * @param {any} id - Primary key value
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
   * Bulk delete
   * @param {Array<any>} ids - Array of primary key values
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
   * Clear all records
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
   * Get total record count
   * @param {Object} [filter] - Filter conditions
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
   * Get Dexie Table instance for custom queries
   * @returns {import('dexie').Table}
   */
  getTable() {
    return this.table
  }
}

export default BaseStore
