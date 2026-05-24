const ShopFooter = () => {
  return (
    <footer className="border-t border-blue-100 bg-surface/90 py-10 backdrop-blur">
      <div className="section-shell">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">QuickCart</p>
            <h3 className="mt-3 font-display text-2xl text-ink">Commerce Studio</h3>
            <p className="mt-4 text-sm text-inkLight">
              A curated marketplace with real-time product data, handpicked for modern shoppers.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Explore</p>
            <ul className="space-y-2 text-sm text-inkLight">
              <li><a className="transition hover:text-primary" href="#latest">Latest arrivals</a></li>
              <li><a className="transition hover:text-primary" href="#best-sellers">Best sellers</a></li>
              <li><a className="transition hover:text-primary" href="#promotions">Promotions</a></li>
              <li><a className="transition hover:text-primary" href="#categories">Categories</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Support</p>
            <ul className="space-y-2 text-sm text-inkLight">
              <li>help@quickcart.io</li>
              <li>+1 222 112 4567</li>
              <li>Mon - Sat · 08:00 - 22:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-inkLight/80">
          <span>© 2026 QuickCart Commerce Studio</span>
          <span>Built with care for modern shopping experiences.</span>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;
