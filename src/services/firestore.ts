import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, type Unsubscribe, type Query, type DocumentData, type Firestore } from 'firebase/firestore';
import { db } from '../firebase';

type QueryCondition = {
  field: string;
  operator: '==' | '!=' | '<' | '>' | '<=' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: unknown;
};

export interface QueryOptions {
  where?: QueryCondition[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
};

const buildQuery = <T = DocumentData>(collectionName: string, options: QueryOptions = {}): Query<T> => {
  const base = collection(requireDb(), collectionName);
  let q: Query<T> = base;

  if (options.where) {
    for (const condition of options.where) {
      q = query(q, where(condition.field, condition.operator, condition.value as any));
    }
  }

  if (options.orderByField) {
    q = query(q, orderBy(options.orderByField, options.orderDirection || 'asc'));
  }

  if (options.limitCount) {
    q = query(q, limit(options.limitCount));
  }

  return q;
};

const requireDb = (): Firestore => {
  if (!db) throw new Error('Firebase is not configured. Set your VITE_FIREBASE_* environment variables.');
  return db;
};

export const firestore = {
  collection: <T = DocumentData>(name: string) => collection(requireDb(), name),

  getDocument: async <T = DocumentData>(path: string): Promise<T | null> => {
    const snap = await getDoc(doc(requireDb(), path));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  },

  setDocument: async (path: string, data: Record<string, unknown>, merge = false) => {
    const ref = doc(requireDb(), path);
    await setDoc(ref, data, { merge });
    return ref.id;
  },

  updateDocument: async (path: string, data: Record<string, unknown>) => {
    const ref = doc(requireDb(), path);
    await updateDoc(ref, data);
    return ref.id;
  },

  deleteDocument: async (path: string) => {
    await deleteDoc(doc(requireDb(), path));
  },

  getDocuments: async <T = DocumentData>(collectionName: string, options: QueryOptions = {}): Promise<T[]> => {
    if (!db) return [];
    const q = buildQuery<T>(collectionName, options);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
  },

  subscribe: <T = DocumentData>(collectionName: string, options: QueryOptions = {}, callback: (items: T[]) => void): Unsubscribe => {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = buildQuery<T>(collectionName, options);
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
      callback(items);
    });
  },

  subscribeDocument: <T = DocumentData>(path: string, callback: (item: T | null) => void): Unsubscribe => {
    if (!db) {
      callback(null);
      return () => {};
    }
    return onSnapshot(doc(db, path), (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback({ id: snap.id, ...snap.data() } as T);
    });
  },
};
