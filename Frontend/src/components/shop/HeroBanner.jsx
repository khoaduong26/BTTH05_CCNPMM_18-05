const HeroBanner = () => {
  return (
    <section className="section-shell">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-blue-600 to-sky-500 px-8 py-12 text-white shadow-2xl shadow-blue-500/20 md:px-12 lg:px-16">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primarySoft/30 blur-3xl" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-50">
              Spring 2026 drop
            </p>
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              Curated essentials for the modern shopper.
            </h2>
            <p className="text-sm text-blue-50/90 md:text-base">
              Discover best sellers, new arrivals, and exclusive promotions tailored for you.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-blue-900/10 transition hover:bg-primarySoft">Shop now</button>
              <button className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Explore collections
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-50/80">Flash sales</p>
              <p className="mt-3 text-2xl font-semibold">Up to 40% off</p>
              <p className="mt-2 text-sm text-blue-50/80">Limited time on featured items.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-50/80">Member perks</p>
              <p className="mt-3 text-2xl font-semibold">Free express delivery</p>
              <p className="mt-2 text-sm text-blue-50/80">On orders over $120.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
