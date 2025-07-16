import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-bg dark:bg-dark-bg">
      <h1 className="text-4xl text-center font-bold mb-6">
        Добро пожаловать в ReelViews!
      </h1>
      <p className="mb-8 text-lg text-primary dark:text-dark-primary text-center max-w-xl">
        Оценивайте фильмы, делитесь мнением и находите новые шедевры вместе с
        нами.
      </p>
      <div className="flex gap-4 max-sm:flex-col">
        <Link
          href="/auth/login"
          className="px-6 py-3 w-40 text-center rounded bg-secondary hover:bg-hover transition-colors duration-200 shadow"
        >
          Войти
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-3 w-40 text-center rounded bg-secondary hover:bg-hover transition-colors duration-200 shadow"
        >
          Регистрация
        </Link>
      </div>
    </main>
  );
}
