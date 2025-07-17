import { withTokenRefresh } from '../../utils/withTokenRefresh';

export interface UpdateReviewRequest {
  id: string;
  description: string;
  rating: number;
}

export interface UpdateReviewResponse {
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

export const updateReview = async (
  accessToken: string,
  requestId: string,
  data: UpdateReviewRequest,
): Promise<UpdateReviewResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const res = await fetch(`https://${API_URL}/v1/reviews/my`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
