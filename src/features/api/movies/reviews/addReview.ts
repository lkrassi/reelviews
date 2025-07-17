import { withTokenRefresh } from '../../utils/withTokenRefresh';

export interface Review {
  createdAt: string;
  description: string;
  movieId: string;
  rating: number;
  userId: string;
}

export interface AddReviewRequest {
  review: Review;
}

export interface AddReviewResponse {
  data: {
    reviewId: string;
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

export const addReview = async (
  accessToken: string,
  requestId: string,
  review: Review,
): Promise<AddReviewResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const res = await fetch(`https://${API_URL}/v1/reviews/my/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify({ review }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
