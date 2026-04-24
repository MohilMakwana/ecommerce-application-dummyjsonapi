// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
// import productsReducer from '../features/products/productsSlice';
// import cartReducer from '../features/cart/cartSlice';
// import themeReducer from '../features/theme/themeSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productsReducer,
//     cart: cartReducer,
//     theme: themeReducer,
//   },
// });

// export default store;




import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import themeReducer from '../features/theme/themeSlice';

const syncChannel = new BroadcastChannel('evercart_state_sync');

const syncMiddleware = (store) => (next) => (action) => {
  const isSyncAction = action.meta?.fromSync;
  const isAsyncLifecycle = action.type.endsWith('/pending') || action.type.endsWith('/rejected');

  if (!isSyncAction && !isAsyncLifecycle) {
    syncChannel.postMessage(action);
  }

  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(syncMiddleware),
});

syncChannel.onmessage = (event) => {
  const action = event.data;
  store.dispatch({
    ...action,
    meta: { ...action.meta, fromSync: true },
  });
};

export default store;
