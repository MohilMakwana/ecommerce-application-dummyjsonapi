import axiosInstance from './axiosInstance';

export async function fetchProducts({ limit = 12, skip = 0, category = '', sortBy = '', order = 'asc', q = '' } = {}) {
  let url = '/products';

  if (q) {
    url = '/products/search';
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const params = { limit, skip };

  if (q) params.q = q;
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  return await axiosInstance.get(url, { params });
}

export async function fetchProductById(id) {
  return await axiosInstance.get(`/products/${id}`);
}

export async function fetchCategories() {
  return await axiosInstance.get('/products/categories');
}
