export interface ConfirmCodeRequest {
  code: string;
  email: string;
  newPassword?: string;
}

export interface ConfirmCodeResponse {
  data: string;
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

export const confirmCode = async (
  data: ConfirmCodeRequest,
  requestId: string,
): Promise<ConfirmCodeResponse> => {
  const res = await fetch(`https://${API_URL}/v1/auth/confirm`, {
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
