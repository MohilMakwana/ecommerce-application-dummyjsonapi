import { useNavigate } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-primary-100 dark:text-primary-900 select-none">404</p>
      <SearchX size={48} className="mt-2 text-slate-300 dark:text-slate-600" />
      <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => navigate('/')} variant="primary" size="md">
          <Home size={16} /> Go home
        </Button>
        <Button onClick={() => navigate('/products')} variant="secondary" size="md">
          Browse products
        </Button>
      </div>
    </div>
  );
}
