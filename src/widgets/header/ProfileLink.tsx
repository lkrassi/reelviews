'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProfileLink = () => {
  const [imgUrl, setImgUrl] = useState('');

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
      }
    } catch (e) {}
  }, []);

  return (
    <main>
      <Link href={'/profile'}>
        <div className="w-10 h-10 rounded-full overflow-hidden hover:scale-103 active:scale-95 duration-200">
          {imgUrl && (
            <img
              src={imgUrl}
              alt="Фото профиля"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>
    </main>
  );
};
