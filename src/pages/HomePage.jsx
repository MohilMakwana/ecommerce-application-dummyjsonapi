import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Smartphone, Laptop, Shirt, Sparkles, Home, Watch, Camera, Droplet } from 'lucide-react';
import { loadProducts, loadCategories, selectProducts, selectCategories, selectProductsStatus, setFilter } from '../features/products/productsSlice';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';
import PageWrapper from '../components/layout/PageWrapper';

const perks = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: Headphones, title: '24/7 Support', desc: 'We\'re always here' },
];

const categoryColors = [
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-green-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-cyan-600',
];

const categoryIcons = [Smartphone, Laptop, Shirt, Sparkles, Home, Watch, Camera, Droplet];

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const status = useSelector(selectProductsStatus);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadCategories());
  }, [dispatch]);

  function handleCategoryClick(slug) {
    dispatch(setFilter({ category: slug }));
  }

  // show first 8 categories
  const featuredCategories = categories.slice(0, 8);
  // show first 8 products as featured
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 h-96 w-96 rounded-full bg-primary-300 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="text-primary-100 shrink-0" size={16} /> New arrivals every week
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Shop smarter,<br />
              <span className="text-primary-200">live better.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-100 max-w-lg leading-relaxed">
              Thousands of products across every category. Fast delivery, easy returns, and prices you'll love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-primary-700 font-semibold px-7 py-3.5 hover:bg-primary-50 transition-colors shadow-lg"
              >
                Shop now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 text-white font-medium px-7 py-3.5 hover:bg-white/10 transition-colors"
              >
                View deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks bar */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageWrapper>
        {/* Categories */}
        {featuredCategories.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Browse Categories</h2>
              <Link to="/products" className="text-sm text-primary-600 hover:underline font-medium">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {featuredCategories.map((cat, i) => {
                const Icon = categoryIcons[i % categoryIcons.length];
                return (
                  <Link
                    key={cat.slug}
                    to="/products"
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`
                      group flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${categoryColors[i % categoryColors.length]}
                      p-4 text-white aspect-square hover:scale-105 transition-transform duration-200 shadow-sm
                    `}
                  >
                    <span>
                      <Icon size={28} />
                    </span>
                    <span className="text-[11px] font-medium text-center leading-tight capitalize mt-1">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Featured Products</h2>
            <Link to="/products" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={status === 'loading'} skeletonCount={8} />
        </section>
      </PageWrapper>
    </div>
  );
}
