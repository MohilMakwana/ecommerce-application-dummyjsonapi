import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, Store, Lock, User, MousePointerClick } from 'lucide-react';
import { login, clearError, selectAuthStatus, selectAuthError, selectIsLoggedIn } from '../features/auth/authSlice';
import { DEMO_CREDENTIALS } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' }
  });

  useEffect(() => {
    if (isLoggedIn) navigate('/');
    return () => dispatch(clearError());
  }, [isLoggedIn, navigate, dispatch]);

  async function onSubmit(data) {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.firstName}!`);
      navigate('/');
    }
  }

  function fillDemo() {
    setValue('username', DEMO_CREDENTIALS.username, { shouldValidate: true });
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col items-center justify-center p-12 text-white">
        <Store size={52} className="mb-6 opacity-90" />
        <h1 className="text-4xl font-bold mb-3">Evercart</h1>
        <p className="text-primary-200 text-center max-w-xs leading-relaxed">
          Discover thousands of products with a seamless shopping experience.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {[
            { label: '10K+', sub: 'Products' },
            { label: '5K+', sub: 'Happy Customers' },
            { label: '50+', sub: 'Categories' },
            { label: '99%', sub: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-center">
              <p className="text-2xl font-bold">{stat.label}</p>
              <p className="text-xs text-primary-200 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6 text-primary-600 font-bold text-xl">
              <Store size={22} /> Evercart
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* Demo credentials hint */}
          <button
            type="button"
            onClick={fillDemo}
            className="mb-6 w-full flex flex-col items-start rounded-xl border border-dashed border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 px-4 py-3 text-left group hover:border-primary-400 transition-colors"
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
              <MousePointerClick size={14} /> Click to fill demo credentials
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Username: <span className="font-mono font-medium">{DEMO_CREDENTIALS.username}</span>
              {' '}· Password: <span className="font-mono font-medium">{DEMO_CREDENTIALS.password}</span>
            </p>
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Username"
              icon={User}
              placeholder="emilys"
              required
              {...register('username')}
              error={errors.username?.message}
              autoComplete="username"
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                icon={Lock}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                required
                {...register('password')}
                error={errors.password?.message}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="self-end flex items-center gap-1 text-xs text-slate-400 hover:text-primary-500 transition-colors"
              >
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPass ? 'Hide' : 'Show'} password
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" loading={status === 'loading'} fullWidth size="lg">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            This app uses{' '}
            <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">
              DummyJSON
            </a>{' '}
            for demo authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
