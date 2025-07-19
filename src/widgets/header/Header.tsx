'use client';

import { ProfileLink } from './ProfileLink';
import { BackButton } from '../BackButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="px-20 py-[17px] max-sm:px-10 w-full flex justify-between items-center">
      <BackButton />
      <nav>
        <ul>
          {pathname !== '/main/recommend' && (
            <li>
              <Link
                href="/main/recommend"
                className="hover:underline underline-offset-2 text-text dark:text-dark-text"
              >
                Рекомендации
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <ProfileLink />
    </header>
  );
};
