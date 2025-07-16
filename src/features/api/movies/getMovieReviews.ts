import { MovieReview } from './getMovieFull';

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
  const params = new URLSearchParams({ movie_id: movieId });
  const res = await fetch(
    `https://${API_URL}/v1/reviews/movie/${page}?${params.toString()}`,
    {
      headers: {
        'X-Request-Id': requestId,
      },
    },
  );
  if (!res.ok) throw await res.json();
  return res.json();
};
