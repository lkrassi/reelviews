import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface GetUserByTokenResponse {
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

export const getUserByToken = async (
  accessToken: string,
  requestId: string,
): Promise<GetUserByTokenResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const res = await fetch(`https://${API_URL}/v1/user/profile/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Request-Id': requestId,
      },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
