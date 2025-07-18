import { useRef, useState } from 'react';
import { useModal } from '@/widgets';
import { changeProfilePicture } from '../../api/user/changeProfilePicture';
import { useNotifications } from '@/widgets';
import { useUser } from '../../model/userStore';

interface UpdateProfilePictureProps {
  userId: string;
  onSuccess?: (newImgUrl?: string) => void;
}

export const UpdateProfilePicture = ({
  userId,
  onSuccess,
}: UpdateProfilePictureProps) => {
  const { openModal, closeModal } = useModal();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useUser();

  const handleOpen = () => {
    let file: File | null = null;
    let preview: string | null = null;
    let error = '';
    let localLoading = false;
    let dragActive = false;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      file = e.target.files?.[0] || null;
      if (file) preview = URL.createObjectURL(file);
      openModal(modalContent());
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      file = e.dataTransfer.files?.[0] || null;
      if (file) preview = URL.createObjectURL(file);
      openModal(modalContent());
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragActive = true;
      openModal(modalContent());
    };
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragActive = false;
      openModal(modalContent());
    };

    const modalContent = () => (
      <form
        className="flex flex-col gap-5 p-6 bg-white dark:bg-dark-bg rounded-xl shadow-xl min-w-[320px] max-w-xs mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!file) {
            addNotification({ type: 'error', message: 'Выберите файл' });
            return;
          }
          localLoading = true;
          setLoading(true);
          try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Нет токена');
            const requestId = crypto.randomUUID();
            await changeProfilePicture(accessToken, requestId, file, userId);
            await fetchUser(accessToken);
            closeModal();
            if (onSuccess) onSuccess();
            addNotification({
              type: 'success',
              message: 'Фото успешно обновлено',
            });
          } catch (e: any) {
            addNotification({
              type: 'error',
              message: e?.message || 'Ошибка обновления фото',
            });
          } finally {
            setLoading(false);
            localLoading = false;
          }
        }}
      >
        <h2 className="text-lg font-bold text-center mb-2">
          Сменить фото профиля
        </h2>
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition min-h-[120px] ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-bg'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-2">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="text-gray-500 text-sm text-center select-none py-4">
              Перетащите изображение сюда или кликните для выбора
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
          disabled={localLoading || loading}
        >
          {localLoading || loading ? 'Загрузка...' : 'Сохранить'}
        </button>
      </form>
    );

    openModal(modalContent());
  };

  return (
    <button
      type="button"
      aria-label="Сменить фото"
      onClick={handleOpen}
      disabled={loading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 16 16"
        fill="none"
        className="text-text dark:text-dark-text align-middle"
      >
        <path
          fill="currentColor"
          d="M7.46 2a5.52 5.52 0 0 0-3.91 1.61a5.44 5.44 0 0 0-1.54 2.97a.503.503 0 0 1-.992-.166a6.514 6.514 0 0 1 6.44-5.41a6.55 6.55 0 0 1 4.65 1.93l1.89 2.21v-2.64a.502.502 0 0 1 1.006 0v4a.5.5 0 0 1-.503.5h-3.99a.5.5 0 0 1-.503-.5c0-.275.225-.5.503-.5h2.91l-2.06-2.4a5.53 5.53 0 0 0-3.9-1.6zm1.09 12a5.52 5.52 0 0 0 3.91-1.61A5.44 5.44 0 0 0 14 9.42a.504.504 0 0 1 .992.166a6.514 6.514 0 0 1-6.44 5.41a6.55 6.55 0 0 1-4.65-1.93l-1.89-2.21v2.64a.501.501 0 0 1-.858.353a.5.5 0 0 1-.148-.354v-4c0-.276.225-.5.503-.5H5.5c.278 0 .503.224.503.5s-.225.5-.503.5H2.59l2.06 2.4a5.53 5.53 0 0 0 3.9 1.6z"
        />
      </svg>
    </button>
  );
};
