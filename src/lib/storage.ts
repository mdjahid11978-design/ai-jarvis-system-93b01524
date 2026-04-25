// Local storage utilities for data persistence
export const storage = {
  // Get item from localStorage with JSON parsing
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  // Set item in localStorage with JSON stringification
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Remove item from localStorage
  remove(key: string): void {
    localStorage.removeItem(key);
  },

  // Clear all localStorage
  clear(): void {
    localStorage.clear();
  }
};

// Storage keys
export const STORAGE_KEYS = {
  AGENTS: 'jarvis_agents',
  TASKS: 'jarvis_tasks',
  ANALYTICS: 'jarvis_analytics',
  SETTINGS: 'jarvis_settings',
  VOICE_HISTORY: 'jarvis_voice_history',
  SYSTEM_LOGS: 'jarvis_system_logs',
  USER_PREFERENCES: 'jarvis_user_preferences',
  FILES: 'jarvis_files'
};
