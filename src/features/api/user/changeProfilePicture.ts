import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface ChangeProfilePictureResponse {
  data: {
    newImgUrl: string;
  };
  meta: {
    code: string;
    error: string;
    message: string;
    requestId: string;
  };
  pagination: {
    page: number;
    pages: number;
    perPage: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const changeProfilePicture = async (
  accessToken: string,
  requestId: string,
  file: File,
  userId: string,
): Promise<ChangeProfilePictureResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    const res = await fetch(`https://${API_URL}/v1/user/picture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Request-Id': requestId,
      },
      body: formData,
    });
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
