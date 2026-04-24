import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginApiCall, getAuthenticatedUser } from '../../api/authApi';
import { AUTH_STORAGE_KEY } from '../../utils/constants';

function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const persisted = loadAuthFromStorage();

const initialState = {
  user: persisted?.user || null,
  token: persisted?.token || null,
  refreshToken: persisted?.refreshToken || null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await loginApiCall(credentials);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    return await getAuthenticatedUser(token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = 'idle';
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user: action.payload,
          token: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => !!state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
