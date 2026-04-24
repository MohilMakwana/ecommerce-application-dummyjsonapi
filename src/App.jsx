import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { selectTheme } from './features/theme/themeSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRouter from './routes/AppRouter';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <div className="flex-1 flex flex-col">
        <AppRouter />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  const theme = useSelector(selectTheme);

  // Apply dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AppLayout />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontSize: '14px',
            borderRadius: '12px',
            padding: '10px 14px',
          },
          success: {
            iconTheme: { primary: '#0ea5e9', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  );
}
