import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, Star, Package, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import {
  loadProductById, selectSelectedProduct, selectProductStatus, clearSelectedProduct,
} from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectProductStatus);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(loadProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  if (status === 'loading') {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'failed' || (!product && status === 'succeeded')) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-slate-500 dark:text-slate-400">Product not found.</p>
        <Button onClick={() => navigate('/products')} variant="secondary">
          <ArrowLeft size={15} /> Back to products
        </Button>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.thumbnail];
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  const inStock = product.stock > 0;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity}x ${product.title.slice(0, 25)}... added to cart`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-500 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[160px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/60 aspect-square border border-slate-100 dark:border-slate-700">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="h-full w-full object-contain p-6 transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 shadow hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 shadow hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i
                    ? 'border-primary-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1 bg-slate-50 dark:bg-slate-800" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400 capitalize mb-1">{product.brand || product.category}</p>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">{product.title}</h1>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast('Link copied!'); }}
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatCurrency(parseFloat(originalPrice))}</span>
                <Badge color="orange">-{Math.round(product.discountPercentage)}%</Badge>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <Package size={16} className={inStock ? 'text-green-500' : 'text-red-400'} />
            <span className={`text-sm font-medium ${inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} color="blue">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex justify-between items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              fullWidth
              size="lg"
            >
              <ShoppingCart size={18} /> Add to cart
            </Button>
          </div>

          {/* Extra info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {[
              { label: 'SKU', value: product.sku || '—' },
              { label: 'Category', value: product.category },
              { label: 'Warranty', value: product.warrantyInformation || '—' },
              { label: 'Shipping', value: product.shippingInformation || '—' },
              { label: 'Return', value: product.returnPolicy || '—' },
              { label: 'Min. Order', value: `${product.minimumOrderQuantity || 1} unit(s)` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{review.reviewerName}</p>
                    <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
