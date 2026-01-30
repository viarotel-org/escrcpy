/**
 * Storage interface for persisting application and window state.
 * Implementations can use electron-store, localStorage, Redis, etc.
 */
export interface IStorage {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @returns The stored value or undefined if not found
   */
  get<T = any>(key: string): T | undefined

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T = any>(key: string, value: T): void

  /**
   * Check if a key exists in storage
   * @param key - Storage key
   * @returns True if the key exists
   */
  has(key: string): boolean

  /**
   * Delete a key from storage
   * @param key - Storage key
   */
  delete(key: string): void
}
