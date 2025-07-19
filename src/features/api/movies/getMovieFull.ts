import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface MovieReview {
  createdAt: string;
  description: string;
  id: string;
  movieId: string;
  rating: number;
  userId: string;
}

export interface RecommendedMovie {
  id: string;
  title: string;
  imgUrl?: string;
  genres?: string[] | null;
  avgRating?: number;
  similarityScore: number;
}

export interface MovieFullParams {
  id: string;
  title: string;
  imgUrl?: string;
  avgRating?: number;
  genres?: string[];
  reviews?: MovieReview[];
}

export interface GetMovieFullResponse {
  data: {
    movie: MovieFullParams;
    recomendations?: RecommendedMovie[];
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

export const getMovieFull = async (
  id: string,
): Promise<GetMovieFullResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const res = await fetch(`https://${API_URL}/v1/movies/full/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Request-Id': crypto.randomUUID(),
      },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
