'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profilePhotoModalFade } from '../../model/animations';

export const UserInfo = () => {
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.imgUrl) {
          setImgUrl(
            user.imgUrl.startsWith('http')
              ? user.imgUrl
              : `https://${user.imgUrl}`,
          );
        }
        if (user.username) {
          setUsername(user.username);
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  return (
    <main className="flex flex-col items-center gap-4 mt-8">
      {imgUrl && (
        <>
          <div
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:scale-103 active:scale-95 duration-200"
            onClick={() => setShowModal(true)}
            title="Открыть фото на весь экран"
          >
            <img
              src={imgUrl}
              alt="Фото профиля"
              className="w-full h-full object-cover"
            />
          </div>
          {username && (
            <div className="text-xl font-bold text-center mt-2 break-all">
              {username}
            </div>
          )}
          {showModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.img
                src={imgUrl}
                alt="Фото профиля"
                className="max-w-full max-h-full rounded-xl shadow-2xl border-4 border-white dark:border-dark-bg"
                onClick={(e) => e.stopPropagation()}
                variants={profilePhotoModalFade}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};
