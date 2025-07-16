'use client';

import * as React from 'react';
import { Modal } from '../modal/Modal';
import { ModalContextType, ModalProps } from '../model/modalTypes';
import { ReactNode } from 'react';

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined,
);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = React.useState<{
    content: ReactNode;
    options: Partial<Omit<ModalProps, 'open' | 'onClose' | 'children'>>;
    open: boolean;
  }>({ content: null, options: {}, open: false });

  const openModal = React.useCallback((content: ReactNode, options = {}) => {
    setModal({ content, options, open: true });
  }, []);

  const closeModal = React.useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <Modal open={modal.open} onClose={closeModal} {...modal.options}>
        {modal.content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
