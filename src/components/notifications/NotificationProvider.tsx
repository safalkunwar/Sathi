import React, { useEffect } from 'react';
import { notificationService } from '../../services/notifications';
import { firestore } from '../../services/firestore';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext();
  const { showToast } = useToast();

  useEffect(() => {
    if (!currentUser) return;

    const setupNotifications = async () => {
      const granted = await notificationService.requestPermission();
      if (!granted) return;

      const token = await notificationService.getFcmToken();
      if (!token) return;

      await firestore.updateDocument(`users/${currentUser.id}`, {
        fcmToken: token,
        updatedAt: new Date().toISOString(),
      });
    };

    setupNotifications();

    const unsubscribe = notificationService.onForegroundMessage((payload) => {
      showToast(`${payload.title}: ${payload.body}`, 'info');
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, showToast]);

  return <>{children}</>;
};
