'use client';
import { useState } from 'react';
import { registerUser } from '../../api/auth/register';
import { useNotifications } from '@/widgets';
import Link from 'next/link';
import { useModal } from '@/widgets/hooks/useModal';
import { ConfirmCode } from './ConfirmCode';
import { useRouter } from 'next/navigation';
import { sendConfirmCode } from '../../api/auth/sendCode';

export const RegisterForm = () => {
  const { addNotification } = useNotifications();
  const { openModal } = useModal();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestId = crypto.randomUUID();
      await registerUser({ email, password, username }, requestId);
      await sendConfirmCode({ email, password }, requestId);
      addNotification({
        type: 'success',
        message: 'Регистрация успешна! Проверьте почту.',
      });
      openModal(
        <ConfirmCode
          email={email}
          onSuccess={() => {
            router.push('/auth/login');
          }}
        />,
        { title: 'Подтвердите почту', size: 'md', showCloseButton: false },
      );
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err?.meta?.message || 'Ошибка регистрации',
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
        Регистрация
      </h2>
      <input
        type="text"
        placeholder="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border border-border dark:border-dark-border px-3 py-2 rounded bg-secondary dark:bg-dark-secondary text-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-dark-primary"
      />
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
        className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover transition-colors duration-200"
      >
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      <div className="text-center text-sm text-text dark:text-dark-text">
        Уже есть аккаунт?{' '}
        <Link
          href="/auth/login"
          className="text-primary dark:text-dark-primary no-underline"
        >
          Войти
        </Link>
      </div>
    </form>
  );
};
