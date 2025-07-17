import { logout } from '../../api/utils/logout';
import { useRouter } from 'next/navigation';

export const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
      type="button"
    >
      Выйти
    </button>
  );
};
