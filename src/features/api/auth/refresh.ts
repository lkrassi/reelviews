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

export const refreshTokens = async (
  data: RefreshRequest,
  requestId: string,
): Promise<RefreshResponse> => {
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
};
