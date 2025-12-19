const STORAGE_KEYS = {
  NEWSLETTER: 'tqv_newsletter_subscribers',
  VIDEOS: 'tqv_media_videos',
  ARTICLES: 'tqv_media_articles',
  ADMIN_SESSION: 'tqv_admin_session'
};

// Helper to check storage size
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024 / 1024).toFixed(2); // Size in MB
};

export const storage = {
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);

      // Monitor storage size
      const size = getStorageSize();
      if (size > 4) {
        console.warn(`⚠️ Storage size: ${size}MB. Consider cleaning old data to avoid quota issues.`);
      }

      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('❌ Storage quota exceeded! Please delete some articles or images.');
        alert('Storage is full! Please delete some old content to continue.');
        return false;
      }
      console.error('Storage error:', e);
      return false;
    }
  },

  add: (key, item) => {
    const data = storage.get(key) || [];
    const newItem = { ...item, id: Date.now(), createdAt: new Date().toISOString() };
    data.push(newItem);
    const success = storage.set(key, data);
    return success ? newItem : null;
  },

  update: (key, updatedItem) => {
    const data = storage.get(key) || [];
    const index = data.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem };
      return storage.set(key, data);
    }
    return false;
  },

  remove: (key, id) => {
    const data = storage.get(key) || [];
    const filtered = data.filter(i => i.id !== id);
    return storage.set(key, filtered);
  },

  // Get current storage usage
  getSize: () => getStorageSize(),

  // Clear all app data (use with caution!)
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

export { STORAGE_KEYS };
