import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-bg text-text">
      <h1 className="text-primary">404</h1>
      <h2 className="text-text">Страница не найдена</h2>
      <p className="text-lg text-primary text-center max-w-xl">
        К сожалению, такой страницы не существует или она была удалена.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded bg-secondary hover:bg-hover font-semibold transition-colors duration-200 shadow"
      >
        На главную
      </Link>
    </main>
  );
}
