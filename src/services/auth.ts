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
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return authService.toAuthUser(cred.user);
  },

  login: async (email: string, password: string): Promise<AuthUser> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return authService.toAuthUser(cred.user);
  },

  loginWithGoogle: async (): Promise<AuthUser> => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return authService.toAuthUser(cred.user);
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  resetPassword: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  },

  getIdTokenClaims: async (): Promise<Record<string, unknown>> => {
    const user = auth.currentUser;
    if (!user) return {};
    const result = await getIdTokenResult(user);
    return result.claims;
  },

  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      const claims = await getIdTokenResult(firebaseUser).then(r => r.claims).catch(() => ({}));
      callback({ ...authService.toAuthUser(firebaseUser), claims });
    });
  },

  toAuthUser: (user: FirebaseUser): Omit<AuthUser, 'claims'> => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  }),
};
