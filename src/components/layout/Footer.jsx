import { Link } from 'react-router-dom';
import { Store, Globe, MessageSquare, Camera } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary-600">
              <Store size={20} />
              Evercart
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              A modern e-commerce experience built with React, Redux Toolkit, and Tailwind CSS.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Globe, MessageSquare, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Shop</h4>
            <ul className="space-y-2">
              {['All Products', 'New Arrivals', 'Best Sellers', 'Sale'].map((label) => (
                <li key={label}>
                  <Link
                    to="/products"
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Support</h4>
            <ul className="space-y-2">
              {['FAQ', 'Shipping', 'Returns', 'Contact Us'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">© {year} Evercart. All rights reserved.</p>
          <p className="text-xs text-slate-400">Powered by DummyJSON API</p>
        </div>
      </div>
    </footer>
  );
}
