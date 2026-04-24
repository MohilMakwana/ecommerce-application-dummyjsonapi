export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const SORT_OPTIONS = [
  { label: 'Default',        value: 'default' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Rating',         value: 'rating' },
  { label: 'Newest',         value: 'newest' },
];

export const ITEMS_PER_PAGE = 12;

export const CART_STORAGE_KEY = 'evercart_cart';
export const AUTH_STORAGE_KEY = 'evercart_auth';
export const THEME_STORAGE_KEY = 'evercart_theme';

// DummyJSON test credentials — shown on the login page
export const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
};
