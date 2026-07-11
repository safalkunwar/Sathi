import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  getIdTokenResult,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  claims: Record<string, unknown>;
};

export const authService = {
  signup: async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return authService.toAuthUser(cred.user);
  },

  login: async (email: string, password: string): Promise<AuthUser> => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return authService.toAuthUser(cred.user);
  },

  loginWithGoogle: async (): Promise<AuthUser> => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return authService.toAuthUser(cred.user);
  },

  logout: async (): Promise<void> => {
    if (!auth) return;
    await signOut(auth);
  },

  resetPassword: async (email: string): Promise<void> => {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    await sendPasswordResetEmail(auth, email);
  },

  getIdTokenClaims: async (): Promise<Record<string, unknown>> => {
    if (!auth) return {};
    const user = auth.currentUser;
    if (!user) return {};
    const result = await getIdTokenResult(user);
    return result.claims;
  },

  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
    if (!auth) {
      console.warn('[SATHI] Auth requested before Firebase Auth was initialized');
      callback(null);
      return () => {};
    }

    try {
      return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        try {
          console.log('[SATHI] Auth state changed:', firebaseUser ? `uid=${firebaseUser.uid}` : 'null');
          if (!firebaseUser) {
            callback(null);
            return;
          }
          const claims = await getIdTokenResult(firebaseUser).then(r => r.claims).catch(() => ({}));
          callback({ ...authService.toAuthUser(firebaseUser), claims });
        } catch (err) {
          console.error('[SATHI] Auth state change error:', err);
          callback(null);
        }
      });
    } catch (err) {
      console.error('[SATHI] Failed to subscribe to auth state:', err);
      callback(null);
      return () => {};
    }
  },

  toAuthUser: (user: FirebaseUser): Omit<AuthUser, 'claims'> => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  }),
};
