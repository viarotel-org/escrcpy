import Store from 'electron-store'
import type { IStorage } from '../interfaces'

/**
 * Adapter that wraps electron-store to implement IStorage interface
 */
export class ElectronStoreAdapter implements IStorage {
  private store: Store

  constructor(storeInstance?: Store) {
    this.store = storeInstance || new Store()
  }

  get<T = any>(key: string): T | undefined {
    return this.store.get(key) as T | undefined
  }

  set<T = any>(key: string, value: T): void {
    this.store.set(key, value)
  }

  has(key: string): boolean {
    return this.store.has(key)
  }

  delete(key: string): void {
    this.store.delete(key)
  }
}

/**
 * Create a default storage adapter using electron-store
 */
export function createDefaultStorage(): IStorage {
  return new ElectronStoreAdapter()
}
