import { FC } from 'react';
import { NotificationProps } from '@/widgets/model/notificationTypes';

const typeStyles: Record<string, string> = {
  success: 'bg-green-100 border-green-400 text-green-800',
  error: 'bg-red-100 border-red-400 text-red-800',
  info: 'bg-blue-100 border-blue-400 text-blue-800',
};

export const Notification: FC<NotificationProps> = ({
  id,
  type,
  message,
  onClose,
}) => (
  <div
    className={`flex items-center border-l-4 p-4 mb-2 mr-20 rounded shadow ${typeStyles[type]} animate-fade-in`}
    role="alert"
  >
    <span className="flex-1">{message}</span>
  </div>
);
