import { createSlice } from '@reduxjs/toolkit';
import { CART_STORAGE_KEY, AUTH_STORAGE_KEY } from '../../utils/constants';

function getInitialUserId() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.user?.id || null;
  } catch {
    return null;
  }
}

function getCartKey(userId) {
  return userId ? `${CART_STORAGE_KEY}_${userId}` : `${CART_STORAGE_KEY}_guest`;
}

function loadCart(userId) {
  try {
    const raw = localStorage.getItem(getCartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(userId, items) {
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
}

const initialUserId = getInitialUserId();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    userId: initialUserId,
    items: loadCart(initialUserId),
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, product.stock || 99);
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      saveCart(state.userId, state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCart(state.userId, state.items);
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = quantity;
      }

      saveCart(state.userId, state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCart(state.userId, state.items);
    },
  },
  extraReducers: (builder) => {
    // When a user successfully logs in
    builder.addCase('auth/login/fulfilled', (state, action) => {
      const newUserId = action.payload.id;
      const savedUserCart = loadCart(newUserId);

      // If the guest had items, logically merge them into the user's permanent cart
      if (state.items.length > 0 && !state.userId) {
        state.items.forEach(guestItem => {
          const exist = savedUserCart.find(i => i.id === guestItem.id);
          if (exist) {
            exist.quantity += guestItem.quantity;
          } else {
            savedUserCart.push(guestItem);
          }
        });
        // Clear the obsolete guest cart
        localStorage.removeItem(getCartKey(null));
      }

      state.userId = newUserId;
      state.items = savedUserCart;
      saveCart(state.userId, state.items);
    });

    // When the user logs out
    builder.addCase('auth/logout', (state) => {
      // Do NOT destroy their saved cart in localStorage. 
      // Just step down to a fresh, empty guest cart for the UI.
      state.userId = null;
      state.items = [];
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
