import { FC } from 'react';
import { PaginationProps } from '../model/paginationTypes';

export const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className="px-2 py-1 rounded disabled:opacity-40 text-xl text-text hover:text-bg dark:text-bg hover:bg-hover dark:hover:bg-dark-hover transition-colors"
        aria-label="Предыдущая страница"
      >
        &#8592;
      </button>
      <span className="text-base font-mono text-text dark:text-bg">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className="px-2 py-1 rounded disabled:opacity-40 text-xl text-text hover:text-bg dark:text-bg hover:bg-hover dark:hover:bg-dark-hover transition-colors"
        aria-label="Следующая страница"
      >
        &#8594;
      </button>
    </div>
  );
};
