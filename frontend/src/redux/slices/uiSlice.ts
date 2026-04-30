import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  theme: 'dark';
  modalOpen: boolean;
  selectedZodiac: string | null;
  loading: boolean;
}

const initialState: UIState = {
  theme: 'dark',
  modalOpen: false,
  selectedZodiac: null,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    setSelectedZodiac: (state, action: PayloadAction<string | null>) => {
      state.selectedZodiac = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setModalOpen, setSelectedZodiac, setLoading, setTheme } =
  uiSlice.actions;

export default uiSlice.reducer;
