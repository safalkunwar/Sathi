import { vi } from 'vitest';

vi.mock('../src/firebase', () => ({
  app: { name: '[DEFAULT]' },
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(() => vi.fn()),
  },
  db: {},
  storage: {},
  messaging: null,
  firebaseConfig: {},
}));
