'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, GetUserByTokenResponse } from '../api/user/getUserByToken';
import { getUserByToken } from '../api/user/getUserByToken';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: (accessToken: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (accessToken: string) => {
    const requestId = crypto.randomUUID();
    const res: GetUserByTokenResponse = await getUserByToken(
      accessToken,
      requestId,
    );
    setUser(res.data);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
