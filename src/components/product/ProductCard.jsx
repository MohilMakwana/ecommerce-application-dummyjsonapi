import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency, truncateText } from '../../utils/formatters';
import toast from 'react-hot-toast';
import Badge from '../common/Badge';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [wishlisted, setWishlisted] = useState(false);

  const discountedPrice = product.price;
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  const stockBadgeColor = product.stock < 10 ? 'red' : 'green';

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${truncateText(product.title, 25)} added to cart`);
  }

  function handleWishlist(e) {
    e.preventDefault();
    setWishlisted((prev) => !prev);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: '♡' });
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Discount badge */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge color="orange">-{Math.round(product.discountPercentage)}%</Badge>
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-sm transition-transform duration-200 hover:scale-110"
      >
        <Heart
          size={15}
          className={wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}
        />
      </button>

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-50 dark:bg-slate-900/40">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide">{product.brand || product.category}</p>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews?.length || 0})</span>
        </div>

        {/* Stock */}
        <Badge color={stockBadgeColor} className="w-fit">
          {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
        </Badge>

        {/* Pricing + CTA */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(parseFloat(originalPrice))}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-primary-600/40 transition-all duration-200 hover:scale-105"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
