'use client';

import { UserPhoto } from './UserPhoto';
import { Logout } from './Logout';

export const Profile = () => {
  return (
    <main className="flex flex-col justify-center items-center gap-y-5">
      <UserPhoto />
      <Logout />
    </main>
  );
};
