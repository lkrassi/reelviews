import { useContext } from 'react';
import { NotificationQueue } from '../notifications/NotificationProvider';

export const useNotifications = () => {
  const ctx = useContext(NotificationQueue);
  if (!ctx)
    throw new Error(
      'useNotifications must be used within NotificationProvider',
    );
  return ctx;
};
