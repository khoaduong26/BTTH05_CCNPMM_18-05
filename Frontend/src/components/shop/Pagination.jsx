const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pages.map((current) => (
        <button
          key={current}
          className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
            current === page
              ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
              : 'border border-blue-100 bg-surface text-inkLight hover:border-primary/40 hover:text-primary'
          }`}
          onClick={() => onPageChange(current)}
        >
          {current}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
