import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface RecommendationMovie {
  avgRating: number;
  genres: string[] | null;
  id: string;
  imgUrl: string;
  similarityScore: number;
  title: string;
}

export interface RecommendationReview {
  createdAt: string;
  description: string;
  id: string;
  movieId: string;
  rating: number;
  userId: string;
}

export interface RecommendationMainMovie {
  avgRating: number;
  genres: string[];
  id: string;
  imgUrl: string;
  reviews: RecommendationReview[];
  title: string;
}

export interface GetUserRecommendationsResponse {
  data: {
    movies: RecommendationMovie[];
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

export const getUserRecommendations = async (
  accessToken: string,
  requestId: string,
): Promise<GetUserRecommendationsResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const res = await fetch(
      `https://${API_URL}/v1/movies/recomendations/user`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Request-Id': requestId,
        },
      },
    );
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
