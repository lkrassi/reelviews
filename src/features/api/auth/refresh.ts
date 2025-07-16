export interface RefreshRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken: string;
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

export async function refreshTokens(
  data: RefreshRequest,
  requestId: string,
): Promise<RefreshResponse> {
  const res = await fetch(`https://${API_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
}

// Универсальная функция-обёртка для запросов с авто-рефрешем токена
export async function withTokenRefresh<T>(
  requestFn: (accessToken: string) => Promise<T>,
): Promise<T> {
  let accessToken = localStorage.getItem('accessToken') || '';
  let refreshToken = localStorage.getItem('refreshToken') || '';
  try {
    return await requestFn(accessToken);
  } catch (err: any) {
    // Проверяем, что ошибка связана с истекшим токеном
    const isExpired =
      err?.meta?.code === 'bad_access_token' ||
      err?.meta?.code === 'token_expired' ||
      err?.meta?.message?.toLowerCase().includes('token');
    if (!isExpired) throw err;
    // Пробуем рефрешнуть токен
    const requestId = crypto.randomUUID();
    const res = await refreshTokens({ accessToken, refreshToken }, requestId);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    // Повторяем исходный запрос с новым accessToken
    return await requestFn(res.data.accessToken);
  }
}
