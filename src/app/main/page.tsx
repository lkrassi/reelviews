import { MovieShortGrid } from '@/features';
import { Header } from '@/widgets';

export default function MainPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg dark:bg-black">
        <MovieShortGrid />
      </main>
    </>
  );
}
