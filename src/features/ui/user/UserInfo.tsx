'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profilePhotoModalFade } from '../../model/animations';
import { UpdateProfilePicture } from './UpdateProfilePicture';
import { getUserByToken } from '../../api/user/getUserByToken';
import { useUser } from '../../model/userStore';

export const UserInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, fetchUser } = useUser();
  const [imgUrl, setImgUrl] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [imgError, setImgError] = useState(false);
  const [reloadTries, setReloadTries] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!user && accessToken) {
      fetchUser(accessToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setImgUrl(
        user.imgUrl && user.imgUrl.startsWith('http')
          ? user.imgUrl
          : user.imgUrl
          ? `https://${user.imgUrl}`
          : '',
      );
      setUsername(user.username || '');
      setUserId(user.id || '');
    }
  }, [user]);

  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  useEffect(() => {
    if (imgError && reloadTries < 5) {
      const timeout = setTimeout(() => {
        setReloadTries((t) => t + 1);
        setImgError(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [imgError, reloadTries]);

  return (
    <main className="flex flex-col items-center gap-4 mt-8">
      {imgUrl && (
        <>
          <div className="flex items-start">
            <div
              className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:scale-103 active:scale-95 duration-200"
              onClick={() => setShowModal(true)}
              title="Открыть фото на весь экран"
            >
              <img
                src={imgUrl + (reloadTries ? `?t=${Date.now()}` : '')}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>

            {userId && (
              <UpdateProfilePicture
                userId={userId}
                onSuccess={async () => {
                  const accessToken = localStorage.getItem('accessToken');
                  if (accessToken) {
                    await fetchUser(accessToken);
                  }
                }}
              />
            )}
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
