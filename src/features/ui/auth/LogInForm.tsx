'use client';
import { useState } from 'react';
import { logIn } from '../../api/auth/logIn';
import { useNotifications } from '@/widgets';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserByToken } from '../../api/user/getUserByToken';

export const LogInForm = () => {
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestId = crypto.randomUUID();
      const res = await logIn({ email, password }, requestId);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      try {
        const userRes = await getUserByToken(
          res.data.accessToken,
          crypto.randomUUID(),
        );
        localStorage.setItem('user', JSON.stringify(userRes.data));
      } catch (userErr) {}
      addNotification({ type: 'success', message: 'Успешный вход!' });
      router.push('/main');
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err?.meta?.message || 'Ошибка входа',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-150 gap-5 bg-white dark:bg-dark-bg p-8 rounded-xl shadow-lg mt-12"
    >
      <h2 className="text-2xl font-bold text-center text-primary dark:text-dark-primary">
        Вход
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-border dark:border-dark-border px-3 py-2 rounded bg-secondary dark:bg-dark-secondary text-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-dark-primary"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-border dark:border-dark-border px-3 py-2 rounded bg-secondary dark:bg-dark-secondary text-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-dark-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
      >
        {loading ? 'Вход...' : 'Войти'}
      </button>
      <div className="text-center text-sm text-text dark:text-dark-text">
        Нет аккаунта?{' '}
        <Link
          href="/auth/register"
          className="text-primary dark:text-dark-primary no-underline"
        >
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
};
