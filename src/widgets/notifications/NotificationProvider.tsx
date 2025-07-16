'use client';

import { createContext, useCallback, useRef, useState } from 'react';
import {
  Notification,
  NotificationQueueContext,
} from '../model/notificationTypes';
import { Notification as NotificationComponent } from './Notification';

export const NotificationQueue = createContext<
  NotificationQueueContext | undefined
>(undefined);

let globalId = 0;

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queueRef = useRef<Notification[]>([]);
  const MAX_ON_SCREEN = 5;

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      if (queueRef.current.length > 0 && filtered.length < MAX_ON_SCREEN) {
        const next = queueRef.current.shift()!;
        return [...filtered, next];
      }
      return filtered;
    });
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (n) =>
            n.type === notification.type && n.message === notification.message,
        );
        queueRef.current = queueRef.current.filter(
          (n) =>
            !(
              n.type === notification.type && n.message === notification.message
            ),
        );
        if (exists) return prev;
        const id = `${Date.now()}-${globalId++}`;
        const newNotif: Notification = { ...notification, id };
        if (prev.length < MAX_ON_SCREEN) {
          setTimeout(() => removeNotification(id), 5000);
          return [...prev, newNotif];
        } else {
          queueRef.current.push(newNotif);
          return prev;
        }
      });
    },
    [removeNotification],
  );

  return (
    <NotificationQueue.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      <div className="fixed z-[9999] top-4 right-4 w-full max-w-xs pointer-events-none select-none">
        {notifications.map((n) => (
          <NotificationComponent
            key={n.id}
            {...n}
            onClose={removeNotification}
          />
        ))}
      </div>
      {children}
    </NotificationQueue.Provider>
  );
};
