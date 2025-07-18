'use client';

import Link from 'next/link';
import { useUser } from '@/features/model/userStore';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const ProfileLink = () => {
  const { user, fetchUser } = useUser();
  const [imgUrl, setImgUrl] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
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
    }
  }, [user]);

  return (
    <Link
      href="/profile"
      className="flex items-center gap-2 group hover:scale-105 active:scale-95 duration-200"
    >
      {pathname !== '/profile' &&
        (imgUrl ? (
          <img
            src={imgUrl}
            alt="Профиль"
            className="w-10 h-10 rounded-full object-cover aspect-square"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent dark:text-dark-accent bg-secondary dark:bg-dark-secondary rounded-full p-2 border border-accent dark:border-dark-accent shadow"
          >
            <path
              fill="currentColor"
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5z"
            />
          </svg>
        ))}
    </Link>
  );
};
