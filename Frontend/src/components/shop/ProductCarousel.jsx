import ProductCard from './ProductCard';

const ProductCarousel = ({ items = [], isLoading, error, emptyMessage }) => {
  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-[280px] h-72 flex-shrink-0 animate-pulse rounded-3xl border border-blue-100 bg-surface shadow-sm" />
        ))}
      </div>
    );
  }

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!items.length) return <div className="p-6 text-sm text-gray-500">{emptyMessage}</div>;

  return (
    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
      {items.map((item) => (
        <div key={item.id} className="w-[280px] flex-shrink-0 snap-start">
          <ProductCard product={item} />
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;