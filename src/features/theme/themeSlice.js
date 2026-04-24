import { createSlice } from '@reduxjs/toolkit';
import { THEME_STORAGE_KEY } from '../../utils/constants';

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: savedTheme },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
