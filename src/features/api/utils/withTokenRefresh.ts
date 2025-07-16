import { refreshTokens } from '../auth/refresh';

export const withTokenRefresh = async <T>(
  requestFn: (accessToken: string) => Promise<T>,
): Promise<T> => {
  let accessToken = localStorage.getItem('accessToken') || '';
  let refreshToken = localStorage.getItem('refreshToken') || '';
  try {
    return await requestFn(accessToken);
  } catch (err: any) {
    const isExpired =
      err?.meta?.code === 'bad_access_token' ||
      err?.meta?.code === 'token_expired' ||
      err?.meta?.code === 'invalid_authorization_header' ||
      err?.meta?.message?.toLowerCase().includes('token');
    if (!isExpired) throw err;
    const requestId = crypto.randomUUID();
    const res = await refreshTokens({ accessToken, refreshToken }, requestId);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    return await requestFn(res.data.accessToken);
  }
};
