const DB_NAME = 'sathi-offline';
const DB_VERSION = 1;

type StoreSchema = {
  companions: { key: string; value: any };
  stories: { key: string; value: any };
  activities: { key: string; value: any };
  events: { key: string; value: any };
  favorites: { key: string; value: any };
  pendingBookings: { key: string; value: any };
};

type StoreName = keyof StoreSchema;

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      (Object.keys({
        companions: null,
        stories: null,
        activities: null,
        events: null,
        favorites: null,
        pendingBookings: null,
      }) as StoreName[]).forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      });
    };
  });
};

export const offlineStorage = {
  cacheCollection: async <T extends { id: string }>(store: StoreName, items: T[]): Promise<void> => {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const objectStore = tx.objectStore(store);
    items.forEach((item) => objectStore.put(item));
    await tx.done;
  },

  getCachedCollection: async <T extends { id: string }>(store: StoreName): Promise<T[]> => {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    const objectStore = tx.objectStore(store);
    const request = objectStore.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  },

  cacheItem: async <T extends { id: string }>(store: StoreName, item: T): Promise<void> => {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const objectStore = tx.objectStore(store);
    objectStore.put(item);
    await tx.done;
  },

  getCachedItem: async <T extends { id: string }>(store: StoreName, id: string): Promise<T | null> => {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    const objectStore = tx.objectStore(store);
    const request = objectStore.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as T) || null);
      request.onerror = () => reject(request.error);
    });
  },

  clearStore: async (store: StoreName): Promise<void> => {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const objectStore = tx.objectStore(store);
    objectStore.clear();
    await tx.done;
  },
};
