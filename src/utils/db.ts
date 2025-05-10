// src/utils/db.ts
import type { Song } from '../types';

// Database configuration
const DB_NAME = 'echo-player-db';
const DB_VERSION = 1;
const SONGS_STORE = 'songs';

// IndexedDB helper functions
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event: Event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening database");
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        db.createObjectStore(SONGS_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const getAllSongs = async (): Promise<Song[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SONGS_STORE, 'readonly');
    const store = transaction.objectStore(SONGS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result as Song[]);
    };
    
    request.onerror = (event: Event) => {
      console.error("Error fetching songs:", event);
      reject("Could not fetch songs");
    };
  });
};

export const addSong = async (song: Song): Promise<Song> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SONGS_STORE, 'readwrite');
    const store = transaction.objectStore(SONGS_STORE);
    const request = store.add(song);
    
    request.onsuccess = () => {
      resolve(song);
    };
    
    request.onerror = (event: Event) => {
      console.error("Error adding song:", event);
      reject("Could not add song");
    };
  });
};

export const deleteSongFromDB = async (id: string): Promise<boolean> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SONGS_STORE, 'readwrite');
    const store = transaction.objectStore(SONGS_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event: Event) => {
      console.error("Error deleting song:", event);
      reject("Could not delete song");
    };
  });
};
