import { FlightFormData } from '../types';

const DB_NAME = 'AirBorderControlDB';
const DB_VERSION = 1;
const STORE_FLIGHTS = 'flights';

/**
 * Opens the IndexedDB database.
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FLIGHTS)) {
        const store = db.createObjectStore(STORE_FLIGHTS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('flightNumber', 'flightNumber', { unique: false });
      }
    };
  });
};

/**
 * Saves a flight record to the database.
 */
export const saveFlight = async (flight: FlightFormData): Promise<string> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_FLIGHTS, 'readwrite');
    const store = transaction.objectStore(STORE_FLIGHTS);
    
    const record = {
        ...flight,
        id: flight.id || crypto.randomUUID(),
        createdAt: flight.createdAt || new Date()
    };

    const request = store.put(record);

    request.onsuccess = () => resolve(record.id);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Retrieves all flight records.
 */
export const getFlights = async (): Promise<FlightFormData[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_FLIGHTS, 'readonly');
    const store = transaction.objectStore(STORE_FLIGHTS);
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev'); // Sort by newest first

    const results: FlightFormData[] = [];
    request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
            results.push(cursor.value);
            cursor.continue();
        } else {
            resolve(results);
        }
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Deletes a flight record.
 */
export const deleteFlight = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_FLIGHTS, 'readwrite');
        const store = transaction.objectStore(STORE_FLIGHTS);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};