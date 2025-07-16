export interface SendCodeRequest {
  email: string;
  password: string;
}

export interface SendCodeResponse {
  data: {
    nextCodeDelay: number;
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

export const sendConfirmCode = async (
  data: SendCodeRequest,
  requestId: string,
): Promise<SendCodeResponse> => {
  const res = await fetch(`https://${API_URL}/v1/auth/code`, {
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
