import { Injectable } from '@angular/core';
import { StorageResult } from '@core/types/storage-result';
import { scopedLoggerFactory } from '@core/utils/scope.logger.factory';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private logger = scopedLoggerFactory(LocalStorage);

  /**
   * Sets a value in the browser's localStorage.
   *
   * @param key - The key under which the value should be stored.
   * @param value - The string value to store.
   * @returns The stored string value, or `null` if not found.
   */
  setLocalStorage(key: string, value: string): StorageResult {
    try {
      localStorage.setItem(key, value);
      this.logger.log('LocalStorage: set item', `${key} = ${value}`);
      return { success: true, error: null, item: `${key} = ${value}` };
    } catch (exception) {
      this.logger.error('LocalStorage Error: failed to set item', [`${key} = ${value}`, exception]);
      return { success: false, error: exception, item: null };
    }
  }

  /**
   * Retrieves a value from the browser's localStorage by key.
   * If an error occurs (e.g., access denied), it logs and throws a `GetLocalStorageException`.
   *
   * @param key - The key of the value to retrieve.
   * @returns The stored string value, or `null` if not found.
   */
  getLocalStorage(key: string): StorageResult {
    try {
      const value = localStorage.getItem(key);
      this.logger.log('LocalStorage: got item', `${key} = ${value}`);
      return { success: true, error: null, item: value };
    } catch (exception) {
      this.logger.error('LocalStorage Error: failed to get item', [key, exception]);
      return { success: false, error: exception, item: null };
    }
  }
}
