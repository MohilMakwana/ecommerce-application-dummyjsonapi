import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  loadProducts, loadCategories,
  selectProducts, selectTotal, selectCategories, selectFilters, selectProductsStatus,
  setFilter, setPage, resetFilters,
} from '../features/products/productsSlice';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';
import PageWrapper from '../components/layout/PageWrapper';
import { ITEMS_PER_PAGE, SORT_OPTIONS } from '../utils/constants';
import { useDebounce } from '../hooks/useDebounce';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const total = useSelector(selectTotal);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectFilters);
  const status = useSelector(selectProductsStatus);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 450);

  // Trigger load whenever filters change
  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  // Sync debounced search into Redux filter
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilter({ search: debouncedSearch }));
    }
  }, [debouncedSearch]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const isLoading = status === 'loading';

  function handleCategorySelect(slug) {
    dispatch(setFilter({ category: slug }));
    setSidebarOpen(false);
  }

  function handleReset() {
    dispatch(resetFilters());
    setSearchInput('');
  }

  const hasActiveFilters = filters.category || filters.search || filters.sortBy !== 'default';

  return (
    <PageWrapper className="!py-6">
      <div className="flex flex-col gap-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {filters.category
                ? <span className="capitalize">{filters.category.replace(/-/g, ' ')}</span>
                : 'All Products'
              }
            </h1>
            {!isLoading && (
              <p className="text-sm text-slate-400 mt-0.5">{total} products found</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex lg:hidden items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setFilter({ sortBy: e.target.value }))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-xl border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
            <FilterPanel
              categories={categories}
              filters={filters}
              onCategorySelect={handleCategorySelect}
              onFilterChange={(f) => dispatch(setFilter(f))}
            />
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto h-full w-72 bg-white dark:bg-slate-900 p-5 overflow-y-auto shadow-xl animate-slideIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={20} />
                  </button>
                </div>
                <FilterPanel
                  categories={categories}
                  filters={filters}
                  onCategorySelect={handleCategorySelect}
                  onFilterChange={(f) => dispatch(setFilter(f))}
                />
              </div>
            </div>
          )}

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="relative mb-5">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); dispatch(setFilter({ search: '' })); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {!isLoading && products.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No products found"
                description="Try adjusting your filters or search term."
                action={
                  <button
                    onClick={handleReset}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Reset filters
                  </button>
                }
              />
            ) : (
              <ProductGrid products={products} loading={isLoading} />
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => dispatch(setPage(filters.page - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {(() => {
                  const currentPage = filters.page;
                  let pages = [];
                  if (totalPages <= 7) {
                    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                  } else if (currentPage <= 4) {
                    pages = [1, 2, 3, 4, 5, '...', totalPages];
                  } else if (currentPage >= totalPages - 3) {
                    pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                  } else {
                    pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                  }

                  return pages.map((page, i) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${i}`} className="px-1 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => dispatch(setPage(page))}
                        className={`h-9 w-9 rounded-xl text-sm font-medium transition-colors ${filters.page === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}

                <button
                  disabled={filters.page >= totalPages}
                  onClick={() => dispatch(setPage(filters.page + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function FilterPanel({ categories, filters, onCategorySelect, onFilterChange }) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Category
        </h3>
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => onCategorySelect('')}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors capitalize ${!filters.category
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => onCategorySelect(cat.slug)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors capitalize ${filters.category === cat.slug
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
