'use client';

import { UserInfo } from './UserInfo';
import { Logout } from './Logout';

export const Profile = () => {
  return (
    <main className="flex flex-col justify-center items-center gap-y-5">
      <UserInfo />
      <Logout />
    </main>
  );
};
