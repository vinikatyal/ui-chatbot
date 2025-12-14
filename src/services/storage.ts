import { openDB, type IDBPDatabase } from 'idb';
import type { Message } from '@/types';

const DB_NAME = 'ui-chatbot-db';
const DB_VERSION = 1;
const STORE_NAME = 'messages'; // table name

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = async (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          // Create index on timestamp for ordering
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      },
    });
  }
  return dbPromise;
};

export const storage = {
  async save(messages: Message[]): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Clear existing messages
      await store.clear();
      
      // Add all messages
      for (const message of messages) {
        await store.add(message);
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  },

  async load(): Promise<Message[]> {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const messages = await store.getAll();
      await tx.done;
      // Sort messages by timestamp to maintain conversation order
      return messages.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  },

  async clear(): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await store.clear();
      await tx.done;
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
};