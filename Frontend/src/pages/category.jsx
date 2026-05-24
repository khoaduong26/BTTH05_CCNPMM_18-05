// Frontend/src/pages/category.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ShopHeader from '../components/shop/ShopHeader';
import ShopFooter from '../components/shop/ShopFooter';
import SectionHeader from '../components/shop/SectionHeader';
import ProductGrid from '../components/shop/ProductGrid';
import { fetchProducts } from '../util/catalog.api';

const CategoryPage = () => {
  const { categoryId } = useParams(); // Lấy ID danh mục từ URL
  
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  // Reset state khi đổi danh mục
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError('');
  }, [categoryId]);

  // Logic gọi API để lấy dữ liệu
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (!hasMore) return;
      
      setLoading(true);
      try {
        const res = await fetchProducts({ categoryId, page, limit: 1 });
        const newItems = res?.items ?? [];
        const totalPages = res?.pagination?.totalPages ?? 1;

        setProducts((prevItems) => {
            
          const existingIds = new Set(prevItems.map((p) => p.id));
          const filteredNew = newItems.filter((p) => !existingIds.has(p.id));
          return [...prevItems, ...filteredNew];
        });

        // Kiểm tra xem còn trang để load tiếp không
        setHasMore(page < totalPages);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [categoryId, page]);

  // Logic Lazy Loading sử dụng IntersectionObserver
  const observer = useRef();
  const lastElementRef = useCallback((node) => {
    if (loading) return; // Đang tải thì không observe
    if (observer.current) observer.current.disconnect(); // Hủy observe cũ
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        // Kéo đến thẻ cuối cùng -> Tăng số trang lên 1
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader />
      <main className="flex-1 py-10">
        <section className="section-shell space-y-8 container mx-auto px-4">
          <SectionHeader
            eyebrow="Danh mục"
            title="Sản phẩm theo danh mục"
            description="Khám phá tất cả các sản phẩm thuộc danh mục này."
          />
          
          <ProductGrid
            items={products}
            isLoading={loading}
            error={error}
            emptyMessage="Không có sản phẩm nào trong danh mục này."
            lastElementRef={lastElementRef} // Truyền ref xuống để bắt sự kiện cuộn
          />
          
          {loading && products.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="text-sm text-blue-500 animate-pulse">Đang tải thêm sản phẩm...</span>
            </div>
          )}
          
          {!hasMore && products.length > 0 && (
            <div className="flex justify-center py-6">
              <span className="text-sm text-gray-500">Bạn đã xem hết sản phẩm.</span>
            </div>
          )}
        </section>
      </main>
      <ShopFooter />
    </div>
  );
};

export default CategoryPage;