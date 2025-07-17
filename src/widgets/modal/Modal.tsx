import { FC, useEffect, useRef } from 'react';
import { ModalProps, ModalSize } from '../model/modalTypes';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: FC<ModalProps & { closable?: boolean }> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !closable) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closable, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closable) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-2 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-dark-bg rounded-xl shadow-xl p-6 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {closable && (
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
