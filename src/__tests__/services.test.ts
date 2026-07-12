import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('firestore service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getDocuments returns empty array when db is missing', async () => {
    vi.doMock('../firebase', () => ({ db: null }));
    const { firestore } = await import('../services/firestore');
    const result = await firestore.getDocuments('users');
    expect(result).toEqual([]);
  });

  it('subscribe calls callback with empty array when db is missing', async () => {
    vi.doMock('../firebase', () => ({ db: null }));
    const { firestore } = await import('../services/firestore');
    const callback = vi.fn();
    const unsubscribe = firestore.subscribe('users', {}, callback);
    expect(callback).toHaveBeenCalledWith([]);
    expect(typeof unsubscribe).toBe('function');
  });

  it('subscribeDocument calls callback with null when db is missing', async () => {
    vi.doMock('../firebase', () => ({ db: null }));
    const { firestore } = await import('../services/firestore');
    const callback = vi.fn();
    const unsubscribe = firestore.subscribeDocument('users/u1', callback);
    expect(callback).toHaveBeenCalledWith(null);
    expect(typeof unsubscribe).toBe('function');
  });
});

describe('payment service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('throws for unsupported provider', async () => {
    const { paymentService } = await import('../services/payments');
    await expect(paymentService.initiatePayment({ provider: 'unknown' as any, amount: 100, currency: 'NPR', companionId: 'c1', bookingId: 'b1' })).rejects.toThrow('Unsupported payment provider');
  });

  it('throws when Khalti secret key is missing', async () => {
    const { paymentService } = await import('../services/payments');
    await expect(paymentService.initiateKhalti({
      provider: 'khalti',
      amount: 100,
      currency: 'NPR',
      companionId: 'c1',
      bookingId: 'b1',
    })).rejects.toThrow('Khalti secret key is not configured');
  });

  it('throws when eSewa merchant ID is missing', async () => {
    const { paymentService } = await import('../services/payments');
    await expect(paymentService.initiateEsewa({
      provider: 'esewa',
      amount: 100,
      currency: 'NPR',
      companionId: 'c1',
      bookingId: 'b1',
    })).rejects.toThrow('eSewa merchant ID is not configured');
  });

  it('verifyPayment always throws server-side error', async () => {
    const { paymentService } = await import('../services/payments');
    await expect(paymentService.verifyPayment('khalti', 'token')).rejects.toThrow('Payment verification must be handled by server-side Cloud Function or payment gateway webhook.');
  });
});

describe('auth service helpers', () => {
  it('maps Firebase user to AuthUser shape', () => {
    const mapAuthUserToUser = (authUser: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null; claims?: Record<string, unknown> } | null) => {
      if (!authUser) return null;
      return {
        id: authUser.uid,
        name: authUser.displayName || 'User',
        email: authUser.email || '',
        avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || 'User')}&background=random`,
        role: 'customer' as const,
        favorites: [],
        claims: authUser.claims || {},
      };
    };

    const user = mapAuthUserToUser({ uid: 'u1', email: 'test@example.com', displayName: 'Test', photoURL: '', claims: { admin: true } });
    expect(user?.email).toBe('test@example.com');
    expect(user?.claims?.admin).toBe(true);
  });
});

describe('getConversationId', () => {
  const getConversationId = (userIdA: string, userIdB: string): string => [userIdA, userIdB].sort().join('_');

  it('returns stable conversation id', () => {
    expect(getConversationId('u1', 'c1')).toBe('c1_u1');
    expect(getConversationId('c1', 'u1')).toBe('c1_u1');
  });
});

describe('maps service', () => {
  it('exports expected map center and zoom', async () => {
    const { MAP_CENTER, DEFAULT_ZOOM } = await import('../services/maps');
    expect(MAP_CENTER).toEqual({ lat: 27.7172, lng: 85.324 });
    expect(DEFAULT_ZOOM).toBe(12);
  });
});

describe('notifications service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('requestPermission returns false when Notification is unavailable', async () => {
    vi.doMock('../firebase', () => ({ messaging: null }));
    // @ts-expect-error simulate missing Notification
    delete globalThis.Notification;
    const { notificationService } = await import('../services/notifications');
    const result = await notificationService.requestPermission();
    expect(result).toBe(false);
  });

  it('getFcmToken returns null when messaging is missing', async () => {
    vi.doMock('../firebase', () => ({ messaging: null }));
    const { notificationService } = await import('../services/notifications');
    const result = await notificationService.getFcmToken();
    expect(result).toBeNull();
  });

  it('onForegroundMessage returns undefined when messaging is missing', async () => {
    vi.doMock('../firebase', () => ({ messaging: null }));
    const { notificationService } = await import('../services/notifications');
    const cleanup = notificationService.onForegroundMessage(() => {});
    expect(cleanup).toBeUndefined();
  });
});

describe('storage service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports offlineStorage object', async () => {
    const { offlineStorage } = await import('../services/storage');
    expect(typeof offlineStorage).toBe('object');
    expect(typeof offlineStorage.cacheCollection).toBe('function');
    expect(typeof offlineStorage.getCachedCollection).toBe('function');
    expect(typeof offlineStorage.cacheItem).toBe('function');
    expect(typeof offlineStorage.getCachedItem).toBe('function');
    expect(typeof offlineStorage.clearStore).toBe('function');
  });
});

describe('auth service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getConversationId is stable', async () => {
    const { getConversationId } = await import('../context/AppContext');
    expect(getConversationId('u1', 'c1')).toBe('c1_u1');
    expect(getConversationId('c1', 'u1')).toBe('c1_u1');
  });

  it('toAuthUser maps Firebase user fields', async () => {
    const { authService } = await import('../services/auth');
    const mapped = (authService as any).toAuthUser({
      uid: 'u1',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/avatar.png',
      emailVerified: true,
    });
    expect(mapped.uid).toBe('u1');
    expect(mapped.email).toBe('test@example.com');
    expect(mapped.displayName).toBe('Test User');
    expect(mapped.photoURL).toBe('https://example.com/avatar.png');
    expect(mapped.emailVerified).toBe(true);
  });
});
