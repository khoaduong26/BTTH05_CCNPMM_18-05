import { useEffect, useMemo, useState } from 'react';
import ShopHeader from '../components/shop/ShopHeader';
import HeroBanner from '../components/shop/HeroBanner';
import SectionHeader from '../components/shop/SectionHeader';
import ProductGrid from '../components/shop/ProductGrid';
import FilterPanel from '../components/shop/FilterPanel';
import CategoryStrip from '../components/shop/CategoryStrip';
import ShopFooter from '../components/shop/ShopFooter';
import Pagination from '../components/shop/Pagination';
import ProductCarousel from '../components/shop/ProductCarousel';
import {
  fetchBestSellingProducts,
  fetchCategories,
  fetchLatestProducts,
  fetchProducts,
  fetchPromotionProducts,
  fetchMostViewedProducts
} from '../util/catalog.api';

const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [catalog, setCatalog] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [loading, setLoading] = useState({ latest: true, best: true, promo: true, mostViewed: true, catalog: true, categories: true });
  const [error, setError] = useState({ latest: '', best: '', promo: '', mostViewed: '', catalog: '', categories: '' });

  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    discounted: false,
    bestSelling: false,
    newest: false,
    inStock: false,
    sort: 'newest',
    page: 1
  });

  const loadLanding = async () => {
    try {
      const [categoryRes, latestRes, bestRes, promoRes, viewedRes] = await Promise.all([
        fetchCategories(),
        fetchLatestProducts(6),
        fetchBestSellingProducts(10),
        fetchPromotionProducts(6),
        fetchMostViewedProducts(10)
      ]);
      
      setCategories(categoryRes?.categories ?? []);
      setLatest(latestRes?.items ?? []);
      setBestSelling(bestRes?.items ?? []);
      setPromotions(promoRes?.items ?? []);
      setMostViewed(viewedRes?.items ?? []);
      
      setError((prev) => ({ ...prev, latest: '', best: '', promo: '', mostViewed: '', categories: '' }));
    } catch {
      setError((prev) => ({
        ...prev,
        latest: 'Unable to load latest products.',
        best: 'Unable to load best sellers.',
        promo: 'Unable to load promotions.',
        categories: 'Unable to load categories.',
        mostViewed: 'Could not load most viewed products.'
      }));
    } finally {
      setLoading((prev) => ({ ...prev, latest: false, best: false, promo: false, categories: false, mostViewed: false }));
    }
  };

  const loadCatalog = async (nextFilters) => {
    setLoading((prev) => ({ ...prev, catalog: true }));
    try {
      const res = await fetchProducts({
        search: nextFilters.search,
        categoryId: nextFilters.categoryId,
        minPrice: nextFilters.minPrice,
        maxPrice: nextFilters.maxPrice,
        discounted: nextFilters.discounted,
        bestSelling: nextFilters.bestSelling,
        newest: nextFilters.newest,
        inStock: nextFilters.inStock,
        sort: nextFilters.sort,
        page: nextFilters.page,
        limit: 5
      });
      setCatalog({ items: res?.items ?? [], pagination: res?.pagination ?? { page: 1, totalPages: 1 } });
      setError((prev) => ({ ...prev, catalog: '' }));
    } catch {
      setError((prev) => ({ ...prev, catalog: 'Unable to load catalog.' }));
    } finally {
      setLoading((prev) => ({ ...prev, catalog: false }));
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        const nextFilters = { ...filters, page: 1, search: value };
        loadCatalog(nextFilters);
        setFilters(nextFilters);
      }, 450),
    [filters]
  );

  useEffect(() => {
    loadLanding();
    loadCatalog({ ...filters, search });
  }, []);

  const handleFilterChange = (patch) => {
    const nextFilters = { ...filters, ...patch, page: 1, search };
    setFilters(nextFilters);
    loadCatalog(nextFilters);
  };

  const handleReset = () => {
    const nextFilters = {
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      discounted: false,
      bestSelling: false,
      newest: false,
      inStock: false,
      sort: 'newest',
      page: 1,
      search
    };
    setFilters(nextFilters);
    loadCatalog(nextFilters);
  };

  const handlePageChange = (page) => {
    const nextFilters = { ...filters, page, search };
    setFilters(nextFilters);
    loadCatalog(nextFilters);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          debouncedSearch(value);
        }}
      />

      <main className="flex flex-col gap-16 py-10">
        <HeroBanner />

        <section id="latest" className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Latest"
            title="New arrivals"
            description="Fresh drops curated from your most-loved categories."
          />
          <ProductGrid
            items={latest}
            isLoading={loading.latest}
            error={error.latest}
            emptyMessage="No products available right now."
          />
        </section>

        {/* ĐÃ SỬA: Thay ProductGrid thành ProductCarousel để cuộn ngang */}
        <section id="best-sellers" className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Best sellers"
            title="Shop the crowd favorites"
            description="Top-moving products based on real sales volume."
          />
          <ProductCarousel
            items={bestSelling}
            isLoading={loading.best}
            error={error.best}
            emptyMessage="No best-selling products yet."
          />
        </section>

        {/* THÊM MỚI: Mục Xem nhiều nhất (Most viewed) */}
        <section id="most-viewed" className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Most viewed"
            title="Top 10 most viewed products"
            description="Discover the products getting the most attention right now."
          />
          <ProductCarousel
            items={mostViewed}
            isLoading={loading.mostViewed}
            error={error.mostViewed}
            emptyMessage="No products viewed yet. Click on some products to see them here!"
          />
        </section>

        <section id="promotions" className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Promotions"
            title="Limited-time savings"
            description="Active discounts pulled directly from the database."
          />
          <ProductGrid
            items={promotions}
            isLoading={loading.promo}
            error={error.promo}
            emptyMessage="No active promotions right now."
          />
        </section>

        <section id="categories" className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Categories"
            title="Browse by category"
            description="Explore product groups curated by our team."
          />
          {loading.categories ? (
            <div className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          ) : (
            <CategoryStrip categories={categories} />
          )}
          {error.categories && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error.categories}</div>
          )}
        </section>

        <section className="section-shell space-y-8">
          <SectionHeader
            eyebrow="Catalog"
            title="Search and filter"
            description="Find the right product using multi-condition filters and sorting."
          />
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <FilterPanel
              categories={categories}
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
            <div className="space-y-6">
              <ProductGrid
                items={catalog.items}
                isLoading={loading.catalog}
                error={error.catalog}
                emptyMessage="No products match the current filters."
              />
              <Pagination
                page={catalog.pagination.page}
                totalPages={catalog.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </div>
  );
};

export default HomePage;