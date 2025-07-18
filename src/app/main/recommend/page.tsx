import { RecomendedToUserMovies } from '@/features';
import { Header } from '@/widgets';

export default function RecomendedToUserMoviesPage() {
  return (
    <>
      <Header />
      <main className="mt-10">
        <RecomendedToUserMovies />
      </main>
    </>
  );
}
