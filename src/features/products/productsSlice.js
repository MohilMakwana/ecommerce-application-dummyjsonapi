import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchCategories } from '../../api/productsApi';
import { ITEMS_PER_PAGE } from '../../utils/constants';

const initialState = {
  items: [],
  total: 0,
  selectedProduct: null,
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 2000],
    minRating: 0,
    sortBy: 'default',
    search: '',
    page: 1,
  },
  status: 'idle',
  productStatus: 'idle',
  categoryStatus: 'idle',
  error: null,
};

export const loadProducts = createAsyncThunk('products/loadProducts', async (_, { getState, rejectWithValue }) => {
  try {
    const { filters } = getState().products;
    const skip = (filters.page - 1) * ITEMS_PER_PAGE;

    let sortBy = '';
    let order = 'asc';

    if (filters.sortBy === 'price_asc') { sortBy = 'price'; order = 'asc'; }
    if (filters.sortBy === 'price_desc') { sortBy = 'price'; order = 'desc'; }
    if (filters.sortBy === 'rating') { sortBy = 'rating'; order = 'desc'; }

    const data = await fetchProducts({
      limit: ITEMS_PER_PAGE,
      skip,
      category: filters.category,
      sortBy,
      order,
      q: filters.search,
    });

    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loadProductById = createAsyncThunk('products/loadProductById', async (id, { rejectWithValue }) => {
  try {
    return await fetchProductById(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loadCategories = createAsyncThunk('products/loadCategories', async (_, { rejectWithValue }) => {
  try {
    return await fetchCategories();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.productStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadProductById.pending, (state) => {
        state.productStatus = 'loading';
        state.selectedProduct = null;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.productStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.productStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.categoryStatus = 'succeeded';
      });
  },
});

export const { setFilter, setPage, resetFilters, clearSelectedProduct } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectTotal = (state) => state.products.total;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectCategories = (state) => state.products.categories;
export const selectFilters = (state) => state.products.filters;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductStatus = (state) => state.products.productStatus;

export default productsSlice.reducer;
