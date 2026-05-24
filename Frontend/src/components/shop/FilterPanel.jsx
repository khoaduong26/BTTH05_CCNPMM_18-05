const FilterPanel = ({
  categories = [],
  filters,
  onChange,
  onReset
}) => {
  return (
    <div className="space-y-6 rounded-3xl border border-blue-100 bg-surface p-6 shadow-sm shadow-blue-500/5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Filters</p>
        <h4 className="mt-2 text-lg font-semibold text-ink">Refine search</h4>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-inkLight">Category</label>
        <select
          className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
          value={filters.categoryId}
          onChange={(event) => onChange({ categoryId: event.target.value })}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-inkLight">Price range</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm text-ink outline-none transition placeholder:text-inkLight/60 focus:border-primary focus:ring-4 focus:ring-blue-100"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value })}
          />
          <input
            type="number"
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm text-ink outline-none transition placeholder:text-inkLight/60 focus:border-primary focus:ring-4 focus:ring-blue-100"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { key: 'discounted', label: 'Discounted products' },
          { key: 'bestSelling', label: 'Best selling' },
          { key: 'newest', label: 'Newest' },
          { key: 'inStock', label: 'In stock' }
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-3 text-sm text-inkLight">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-blue-200 text-primary accent-primary"
              checked={Boolean(filters[item.key])}
              onChange={(event) => onChange({ [item.key]: event.target.checked })}
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-inkLight">Sort by</label>
        <select
          className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
          value={filters.sort}
          onChange={(event) => onChange({ sort: event.target.value })}
        >
          <option value="newest">Newest first</option>
          <option value="best_selling">Best selling</option>
          <option value="price_asc">Price ascending</option>
          <option value="price_desc">Price descending</option>
        </select>
      </div>

      <button
        className="w-full rounded-full border border-blue-100 bg-primarySoft px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary hover:text-white"
        onClick={onReset}
        type="button"
      >
        Reset filters
      </button>
    </div>
  );
};

export default FilterPanel;
