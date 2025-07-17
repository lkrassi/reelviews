import { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  closable?: boolean;
  className?: string;
}

export interface ModalContextType {
  openModal: (
    content: ReactNode,
    options?: Partial<Omit<ModalProps, 'open' | 'onClose' | 'children'>>,
  ) => void;
  closeModal: () => void;
}
