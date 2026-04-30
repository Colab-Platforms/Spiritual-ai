import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import kundaliReducer from './slices/kundaliSlice';
import horoscopeReducer from './slices/horoscopeSlice';
import {
  persistenceMiddleware,
  loadPersistedState,
} from './middleware/persistenceMiddleware';

// Define RootState type first
export type RootState = {
  user: ReturnType<typeof userReducer>;
  ui: ReturnType<typeof uiReducer>;
  kundali: ReturnType<typeof kundaliReducer>;
  horoscope: ReturnType<typeof horoscopeReducer>;
};

// Load persisted state from localStorage
const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
    kundali: kundaliReducer,
    horoscope: horoscopeReducer,
  },
  preloadedState: preloadedState as PreloadedState<RootState> | undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export type AppDispatch = typeof store.dispatch;
