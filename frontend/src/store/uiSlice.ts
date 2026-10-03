import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialState: UIState = {
  darkMode: false,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' } | null>
    ) => {
      state.toast = action.payload;
    },
  },
});

export const { toggleDarkMode, setToast } = uiSlice.actions;
export default uiSlice.reducer;
