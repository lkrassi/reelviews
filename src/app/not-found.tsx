import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-bg dark:bg-black gap-y-2">
      <h1 className="text-primary">404</h1>
      <h2 className="text-text">Страница не найдена</h2>
      <p className="text-lg text-primary text-center max-w-xl">
        К сожалению, такой страницы не существует или она была удалена.
      </p>
      <Link
        href="/"
        className="bg-btn dark:bg-dark-btn text-white rounded px-4 py-2 font-semibold hover:bg-hover dark:hover:bg-dark-hover"
      >
        На главную
      </Link>
    </main>
  );
}
