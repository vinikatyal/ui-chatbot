import type { Message } from '@/types';

const STORAGE_KEY = 'ui-chatbot-history';

export const storage = {
  save: (messages: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  },

  load: (): Message[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};