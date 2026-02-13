/**
 * Storage Utility
 * Provides a wrapper around chrome.storage.sync with a fallback to localStorage
 * for development outside of the extension environment.
 */

const StorageUtils = {
  /**
   * Get items from storage
   * @param {Object} keys - Keys with default values
   * @returns {Promise<Object>}
   */
  get: (keys) => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(keys, resolve);
      } else {
        console.warn('chrome.storage.sync is not available. Using localStorage.');
        const result = {};
        for (const key in keys) {
          const value = localStorage.getItem(key);
          try {
            result[key] = value !== null ? JSON.parse(value) : keys[key];
          } catch (e) {
            result[key] = keys[key];
          }
        }
        resolve(result);
      }
    });
  },

  /**
   * Set items in storage
   * @param {Object} items - Key-value pairs to set
   * @returns {Promise<void>}
   */
  set: (items) => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set(items, resolve);
      } else {
        for (const key in items) {
          localStorage.setItem(key, JSON.stringify(items[key]));
        }
        resolve();
      }
    });
  }
};
