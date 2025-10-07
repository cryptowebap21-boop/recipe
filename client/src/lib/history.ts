export interface HistoryItem {
  id: string;
  type: 'detector' | 'humanizer';
  timestamp: Date;
  input: string;
  output: any;
  preview: string;
}

const HISTORY_KEY = 'textgenai_history';
const MAX_HISTORY_ITEMS = 50;

export const historyStorage = {
  // Get all history items
  getAll(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return [];
      
      const items = JSON.parse(stored);
      return items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error reading history:', error);
      return [];
    }
  },

  // Add new history item
  add(item: Omit<HistoryItem, 'id' | 'timestamp' | 'preview'>): HistoryItem {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      preview: item.input.slice(0, 100) + (item.input.length > 100 ? '...' : '')
    };

    const history = this.getAll();
    history.unshift(newItem);

    // Keep only the most recent items
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving history:', error);
    }

    return newItem;
  },

  // Get item by ID
  getById(id: string): HistoryItem | undefined {
    return this.getAll().find(item => item.id === id);
  },

  // Delete item by ID
  delete(id: string): void {
    const history = this.getAll().filter(item => item.id !== id);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  },

  // Clear all history
  clear(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  // Get history by type
  getByType(type: 'detector' | 'humanizer'): HistoryItem[] {
    return this.getAll().filter(item => item.type === type);
  }
};
