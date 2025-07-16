'use client';
import { useRef, useState } from 'react';
import { confirmCode } from '../../api/auth/confirmCode';
import { useNotifications } from '@/widgets';
import { useModal } from '@/widgets';

interface ConfirmCodeProps {
  email: string;
  onSuccess?: () => void;
}

export const ConfirmCode = ({ email, onSuccess }: ConfirmCodeProps) => {
  const { addNotification } = useNotifications();
  const { closeModal } = useModal();
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newValues = [...values];
    newValues[idx] = val;
    setValues(newValues);
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (paste.length === 6) {
      setValues(paste.split(''));
      setTimeout(() => inputsRef.current[5]?.focus(), 0);
    }
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.some((v) => !v)) {
      addNotification({ type: 'error', message: 'Введите все 6 цифр кода' });
      return;
    }
    setLoading(true);
    try {
      const code = values.join('');
      const requestId = crypto.randomUUID();
      await confirmCode({ code, email }, requestId);
      addNotification({
        type: 'success',
        message: 'Почта успешно подтверждена!',
      });
      closeModal();
      onSuccess?.();
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err?.meta?.message || 'Ошибка подтверждения',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 p-2"
    >
      <div className="flex gap-2">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="w-10 h-12 text-2xl text-center border border-border dark:border-dark-border rounded bg-secondary dark:bg-dark-secondary text-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-dark-primary"
            autoFocus={i === 0}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover transition-colors duration-200"
      >
        {loading ? 'Проверка...' : 'Подтвердить'}
      </button>
    </form>
  );
};
