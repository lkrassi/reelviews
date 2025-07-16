import { withTokenRefresh } from '../utils/withTokenRefresh';

export interface MovieShort {
  id: string;
  title: string;
  imgUrl?: string;
  avgRating?: number;
  genres?: string[];
}

export interface GetMoviesShortResponse {
  data: {
    movies: MovieShort[];
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

export const getMoviesShort = async (
  page: number,
  search?: string,
): Promise<GetMoviesShortResponse> => {
  return withTokenRefresh(async (accessToken) => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(
      `https://${API_URL}/v1/movies/short/${page}${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Request-Id': crypto.randomUUID(),
        },
      },
    );
    if (!res.ok) throw await res.json();
    return res.json();
  });
};
