import { FC } from 'react';
import { ModalProps, ModalSize } from '../model/modalTypes';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-2 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-dark-bg rounded-xl shadow-xl p-6 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-2xl !bg-transparent text-text"
            aria-label="Закрыть модальное окно"
            type="button"
          >
            ×
          </button>
        )}
        {title && (
          <h3 className="text-xl font-bold mb-4 text-primary dark:text-dark-primary text-center">
            {title}
          </h3>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
