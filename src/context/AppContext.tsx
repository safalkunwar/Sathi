import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Companion, Booking, Message, Notification, ExperienceStory } from '../types';
import { authService, AuthUser } from '../services/auth';
import { firestore } from '../services/firestore';
import { offlineStorage } from '../services/storage';

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<Pick<User, 'name' | 'avatar' | 'bio' | 'location' | 'phone'>>) => Promise<void>;
  postStory: (story: Omit<ExperienceStory, 'id'>) => Promise<void>;
  favorites: string[];
  toggleFavorite: (companionId: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getConversationId: (otherUserId: string) => string;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

const mapAuthUserToUser = (authUser: AuthUser | null): User | null => {
  if (!authUser) return null;
  return {
    id: authUser.uid,
    name: authUser.displayName || 'User',
    email: authUser.email || '',
    avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || 'User')}&background=random`,
    role: 'customer',
    favorites: [],
    claims: authUser.claims,
  };
};

export const getConversationId = (userIdA: string, userIdB: string): string => {
  return [userIdA, userIdB].sort().join('_');
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[SATHI] AppProvider auth effect starting');
    let cancelled = false;
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (cancelled) return;
      try {
        const user = mapAuthUserToUser(authUser);
        console.log('[SATHI] AppProvider auth user:', user ? `uid=${user.id}` : 'null');
        if (user) {
          const profile = await firestore.getDocument<User>(`users/${user.id}`);
          console.log('[SATHI] Firestore user profile:', profile ? 'found' : 'not found');
          if (profile && !cancelled) {
            setCurrentUser({
              ...user,
              role: profile.role || 'customer',
              favorites: profile.favorites || [],
              bio: profile.bio,
              location: profile.location,
              phone: profile.phone,
            });
          } else if (!cancelled) {
            await firestore.setDocument(`users/${user.id}`, {
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: 'customer',
              favorites: [],
              bio: '',
              location: '',
              phone: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            if (!cancelled) setCurrentUser(user);
          }
        } else {
          if (!cancelled) setCurrentUser(null);
        }
      } catch (err) {
        console.error('[SATHI] Failed to load user profile:', err);
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) {
          console.log('[SATHI] AppProvider loading=false');
          setLoading(false);
        }
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const unsubBookings = firestore.subscribe<Booking>('bookings', { where: [{ field: 'userId', operator: '==', value: currentUser.id }] }, (items) => {
      setBookings(items);
    });
    const unsubNotifications = firestore.subscribe<Notification>('notifications', { where: [{ field: 'userId', operator: '==', value: currentUser.id }], orderByField: 'timestamp', orderDirection: 'desc' }, (items) => {
      setNotifications(items);
    });
    return () => {
      unsubBookings();
      unsubNotifications();
    };
  }, [currentUser]);

  const toggleFavorite = useCallback((companionId: string) => {
    setFavorites(prev => {
      const next = prev.includes(companionId) ? prev.filter(id => id !== companionId) : [...prev, companionId];
      if (currentUser) {
        firestore.updateDocument(`users/${currentUser.id}`, { favorites: next });
      }
      return next;
    });
  }, [currentUser]);

  const addBooking = useCallback(async (booking: Booking) => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      await offlineStorage.cacheItem('pendingBookings', { ...booking, _pending: true });
      setBookings(prev => [...prev, { ...booking, _pending: true }]);
      return;
    }

    setBookings(prev => [...prev, booking]);
    const ref = await firestore.setDocument(`bookings/${booking.id}`, {
      ...booking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Booking Requested',
      message: `Your booking for ${booking.date} is now pending.`,
      type: 'booking',
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notification, ...prev]);
    await firestore.setDocument(`notifications/${notification.id}`, notification);
  }, [currentUser]);

  const updateBookingStatus = useCallback(async (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    await firestore.updateDocument(`bookings/${id}`, { status, updatedAt: new Date().toISOString() });

    const booking = bookings.find(b => b.id === id);
    if (booking && currentUser) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: `Booking ${status}`,
        message: `Your booking for ${booking.date} has been ${status}.`,
        type: 'booking',
        isRead: false,
        timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [notification, ...prev]);
      await firestore.setDocument(`notifications/${notification.id}`, notification);
    }
  }, [bookings, currentUser]);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    await firestore.setDocument(`messages/${newMessage.id}`, newMessage);

    await firestore.updateDocument(`conversations/${conversationId}`, {
      lastMessage: {
        id: newMessage.id,
        conversationId,
        senderId: newMessage.senderId,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        isRead: false,
      },
      updatedAt: newMessage.timestamp,
    });
  }, [currentUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await firestore.updateDocument(`notifications/${id}`, { isRead: true });
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'avatar' | 'bio' | 'location' | 'phone'>>) => {
    if (!currentUser) return;
    const payload: Record<string, unknown> = { ...updates, updatedAt: new Date().toISOString() };
    await firestore.setDocument(`users/${currentUser.id}`, payload, true);

    if (updates.name !== undefined || updates.avatar !== undefined) {
      try {
        await authService.updateProfile(
          updates.name !== undefined ? updates.name : currentUser.name,
          updates.avatar !== undefined ? updates.avatar : currentUser.avatar
        );
      } catch (err) {
        console.error('[SATHI] Failed to update auth profile:', err);
      }
    }

    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
  }, [currentUser]);

  const postStory = useCallback(async (story: Omit<ExperienceStory, 'id'>) => {
    const id = `story-${Date.now()}`;
    await firestore.setDocument(`stories/${id}`, {
      ...story,
      id,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const getConversationWith = useCallback((otherUserId: string): string => {
    if (!currentUser) return '';
    return getConversationId(currentUser.id, otherUserId);
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      updateUserProfile,
      postStory,
      favorites,
      toggleFavorite,
      bookings,
      addBooking,
      updateBookingStatus,
      getConversationId: getConversationWith,
      notifications,
      markNotificationRead,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
