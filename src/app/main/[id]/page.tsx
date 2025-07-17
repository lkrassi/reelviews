import { MovieFull } from '@/features';
import { Header } from '@/widgets';

export default function MoviePage() {
  return (
    <>
      <Header />
      <main className="mt-10">
        <MovieFull />;
      </main>
    </>
  );
}
