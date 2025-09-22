class StorageUtils {
  static async get(keys) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.get(keys);
      }
      return {};
    } catch (error) {
      console.error('Storage get error:', error);
      return {};
    }
  }

  static async set(items) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.set(items);
      }
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      throw error;
    }
  }

  static async remove(keys) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return await chrome.storage.local.remove(keys);
      }
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      throw error;
    }
  }
}

if (typeof window !== 'undefined') {
  window.StorageUtils = StorageUtils;
}