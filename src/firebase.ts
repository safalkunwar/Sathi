import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let messaging: Messaging | null = null;

const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID;

console.log('[SATHI] Firebase config loaded:', {
  hasValidConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'yes' : 'no',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'none',
});

if (hasValidConfig && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[SATHI] Firebase initialized:', { app: !!app, auth: !!auth, db: !!db, storage: !!storage });
    try {
      messaging = getMessaging(app);
      console.log('[SATHI] Messaging initialized:', !!messaging);
    } catch (e) {
      console.warn('[SATHI] FCM not available:', e);
    }
  } catch (error) {
    console.error('[SATHI] Firebase initialization failed:', error);
  }
} else if (getApps().length) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('[SATHI] Firebase reused existing app:', { app: !!app, auth: !!auth, db: !!db });
}

export { app, auth, db, storage, messaging, firebaseConfig };
