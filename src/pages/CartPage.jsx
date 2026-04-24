import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import {
  selectCartItems, selectCartSubtotal, selectCartItemCount,
  removeFromCart, updateQuantity, clearCart,
} from '../features/cart/cartSlice';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import PageWrapper from '../components/layout/PageWrapper';
import toast from 'react-hot-toast';

const SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.08;
const SHIPPING_COST = 5.99;

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const itemCount = useSelector(selectCartItemCount);

  const freeShipping = subtotal >= SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <PageWrapper>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          action={
            <Button onClick={() => navigate('/products')}>
              Start shopping
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Shopping Cart
          <span className="ml-2 text-base font-normal text-slate-400">({itemCount} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm"
            >
              <Link to={`/products/${item.id}`} className="shrink-0 h-24 w-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-contain p-2"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => { dispatch(removeFromCart(item.id)); toast('Item removed'); }}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-xs text-slate-400 capitalize">{item.brand || item.category}</p>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity control */}
                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-800 dark:text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      disabled={item.quantity >= (item.stock || 99)}
                    >
                      +
                    </button>
                  </div>

                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => { dispatch(clearCart()); toast('Cart cleared'); }}
            className="self-start text-sm text-slate-400 hover:text-red-500 transition-colors mt-2"
          >
            Clear cart
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span className={freeShipping ? 'text-green-500 font-medium' : ''}>
                  {freeShipping ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              {!freeShipping && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2 text-xs text-blue-600 dark:text-blue-400">
                  Add {formatCurrency(SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-slate-900 dark:text-white text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={() => toast('Coupons coming soon!')}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              fullWidth
              size="lg"
              className="mt-5"
            >
              Proceed to Checkout
            </Button>

            <Link
              to="/products"
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft size={14} /> Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
