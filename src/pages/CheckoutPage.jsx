import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, ChevronRight, CreditCard, MapPin, Package, PartyPopper } from 'lucide-react';
import { selectCartItems, selectCartSubtotal, clearCart } from '../features/cart/cartSlice';
import { formatCurrency, generateOrderId } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PageWrapper from '../components/layout/PageWrapper';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: Package },
  { id: 4, label: 'Confirmed', icon: Check },
];

const TAX_RATE = 0.08;
const SHIPPING_COST = 5.99;
const FREE_SHIPPING = 50;

const schema = yup.object().shape({
  // Shipping validation
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  phone: yup.string().nullable(),
  address: yup.string().required('Required'),
  city: yup.string().required('Required'),
  state: yup.string().required('Required'),
  zip: yup.string().matches(/^\d{5,6}$/, { message: 'Must be 5 or 6 digits', excludeEmptyString: true }).required('Required'),
  country: yup.string().default('United States'),

  // Payment validation
  cardName: yup.string().required('Required'),
  cardNumber: yup.string().matches(/^(\d{4} ){3}\d{4}$/, { message: 'Valid 16-digit card required', excludeEmptyString: true }).required('Required'),
  expiry: yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Invalid expiry (MM/YY)', excludeEmptyString: true }).required('Required'),
  cvv: yup.string().matches(/^\d{3,4}$/, { message: 'Invalid CVV', excludeEmptyString: true }).required('Required'),
});

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, trigger, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { country: 'India' },
    mode: 'onTouched'
  });

  const formData = watch();

  async function handleShippingNext() {
    const isValid = await trigger(['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip']);
    if (isValid) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  }

  async function handlePaymentNext() {
    const isValid = await trigger(['cardName', 'cardNumber', 'expiry', 'cvv']);
    if (isValid) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  }

  async function submitOrder(data) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setOrderId(generateOrderId());
    dispatch(clearCart());
    setStep(4);
    setLoading(false);
    window.scrollTo(0, 0);
    toast.success('Order placed successfully!');
  }

  const formatCardNumber = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    return e;
  };

  const formatExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) e.target.value = `${val.slice(0, 2)}/${val.slice(2)}`;
    return e;
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <ol className="flex items-center gap-0 max-w-3xl mx-auto">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const current = step === s.id;
            return (
              <li key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${done ? 'border-primary-600 bg-primary-600 text-white'
                      : current ? 'border-primary-600 bg-white dark:bg-slate-900 text-primary-600'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-300'
                      }`}
                  >
                    {done ? <Check size={18} /> : <s.icon size={16} />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${current ? 'text-primary-600' : done ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300 ${done ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <form onSubmit={handleSubmit(submitOrder)}>
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First name" placeholder="John" required error={errors.firstName?.message} {...register('firstName')} />
                <Input label="Last name" placeholder="Doe" required error={errors.lastName?.message} {...register('lastName')} />
                <div className="sm:col-span-2">
                  <Input label="Email" type="email" placeholder="john.doe@example.com" required error={errors.email?.message} {...register('email')} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Phone (optional)" type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Street address" placeholder="123 Main St, Apt 4B" required error={errors.address?.message} {...register('address')} />
                </div>
                <Input label="City" placeholder="New York" required error={errors.city?.message} {...register('city')} />
                <Input label="State" placeholder="NY" required error={errors.state?.message} {...register('state')} />
                <Input
                  label="ZIP code"
                  placeholder="10001"
                  required
                  error={errors.zip?.message}
                  maxLength={6}
                  {...register('zip', {
                    onChange: e => e.target.value = e.target.value.replace(/\D/g, '')
                  })}
                />
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Country<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register('country')}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'India'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="button" onClick={handleShippingNext} size="lg" className="mt-6" fullWidth>
                Continue to Payment <ChevronRight size={18} />
              </Button>
            </div>
            <div className="lg:col-span-1">
              <OrderSummaryPanel items={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </div>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Payment Details</h2>
              <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" /> Demo mode — no real charges
              </p>

              <div className="flex flex-col gap-4">
                <Input
                  label="Name on card"
                  placeholder="John Doe"
                  required
                  error={errors.cardName?.message}
                  {...register('cardName')}
                />
                <div>
                  <Input
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                    required
                    error={errors.cardNumber?.message}
                    maxLength={19}
                    {...register('cardNumber', {
                      onChange: formatCardNumber
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry date"
                    placeholder="MM/YY"
                    required
                    error={errors.expiry?.message}
                    maxLength={5}
                    {...register('expiry', {
                      onChange: formatExpiryInput
                    })}
                  />
                  <Input
                    label="CVV"
                    placeholder="•••"
                    type="password"
                    required
                    error={errors.cvv?.message}
                    maxLength={4}
                    {...register('cvv', {
                      onChange: e => e.target.value = e.target.value.replace(/\D/g, '')
                    })}
                  />
                </div>

                {/* Accepted cards */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  {['VISA', 'MC', 'AMEX', 'DISC'].map((card) => (
                    <span key={card} className="rounded border border-slate-200 dark:border-slate-700 px-2 py-0.5 font-mono font-semibold text-slate-500">
                      {card}
                    </span>
                  ))}
                  <span className="ml-auto">🔒 SSL secured</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} size="lg">
                  Back
                </Button>
                <Button type="button" onClick={handlePaymentNext} size="lg" fullWidth>
                  Review Order <ChevronRight size={18} />
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <OrderSummaryPanel items={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </div>
          </div>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Review Your Order</h2>

              {/* Shipping summary */}
              <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Shipping to</h3>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-primary-600 hover:underline">Edit</button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formData.address}, {formData.city}, {formData.state} {formData.zip}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formData.country}</p>
              </div>

              {/* Payment summary */}
              <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Payment method</h3>
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-primary-600 hover:underline">Edit</button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CreditCard size={16} className="text-slate-400" />
                  <span>•••• •••• •••• {(formData.cardNumber || '').replace(/\s/g, '').slice(-4)}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{formData.cardName}</p>
              </div>

              {/* Items */}
              <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                  Items ({cartItems.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.title} className="h-12 w-12 rounded-lg object-contain bg-slate-50 dark:bg-slate-900/40 p-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(2)} size="lg">Back</Button>
                <Button type="submit" size="lg" fullWidth loading={loading} variant="accent">
                  Place Order — {formatCurrency(total)}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <OrderSummaryPanel items={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </div>
          </div>
        )}

      </form>

      {/* ── Step 4: Confirmation ── */}
      {step === 4 && (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <PartyPopper size={38} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Order Confirmed!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Order ID</p>
            <p className="font-mono text-lg font-bold text-primary-600">{orderId}</p>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            A confirmation will be sent to <strong>{formData.email}</strong>. Your items will arrive in 3–5 business days.
          </p>
          <div className="flex gap-3 mt-2">
            <Button type="button" onClick={() => navigate('/products')}>Continue Shopping</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function OrderSummaryPanel({ items, subtotal, shipping, tax, total }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 p-5 shadow-sm sticky top-20">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Order Summary ({items.length} items)
      </h3>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <img src={item.thumbnail} alt="" className="h-10 w-10 rounded-lg object-contain bg-slate-50 dark:bg-slate-900/40 shrink-0 p-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">{item.title}</p>
              <p className="text-xs text-slate-400">×{item.quantity}</p>
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Tax</span><span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base pt-2 border-t border-slate-100 dark:border-slate-700">
          <span>Total</span><span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
