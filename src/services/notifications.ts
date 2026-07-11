import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';

export type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  getFcmToken: async (): Promise<string | null> => {
    if (!messaging) return null;
    try {
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  },

  onForegroundMessage: (callback: (payload: NotificationPayload) => void): (() => void) | undefined => {
    if (!messaging) return undefined;
    return onMessage(messaging, (payload) => {
      const title = payload.notification?.title || 'SATHI';
      const body = payload.notification?.body || '';
      callback({ title, body, data: payload.data as Record<string, string> });
    });
  },

  showLocalNotification: (payload: NotificationPayload) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    new Notification(payload.title, {
      body: payload.body,
      icon: '/sathi-icon.png',
      tag: payload.data?.tag,
    });
  },
};
