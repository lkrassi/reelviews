import { MovieReview } from './getMovieFull';
import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface GetMovieReviewsResponse {
  data: {
    reviews: MovieReview[];
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

export const getReviewsById = async (
  page: number,
  movieId: string,
  requestId: string,
): Promise<GetMovieReviewsResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const params = new URLSearchParams({ movie_id: movieId });
    const res = await fetch(
      `https://${API_URL}/v1/reviews/movie/${page}?${params.toString()}`,
      {
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
