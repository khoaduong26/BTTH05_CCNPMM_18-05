const CategoryStrip = ({ categories = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-3xl border border-blue-100 bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Category</p>
          <h4 className="mt-3 text-lg font-semibold text-ink">{category.name}</h4>
          <p className="mt-2 text-sm text-inkLight">{category.description || 'Discover curated picks.'}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryStrip;
