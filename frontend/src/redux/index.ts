// Store
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Slices and actions
export {
  setUserData,
  setAuthenticated,
  setUserError,
  clearUserData,
  updateZodiacSign,
} from './slices/userSlice';
export type { UserState, UserData } from './slices/userSlice';

export {
  setModalOpen,
  setSelectedZodiac,
  setLoading,
  setTheme,
} from './slices/uiSlice';
export type { UIState } from './slices/uiSlice';

export {
  setKundaliData,
  setKundaliLoading,
  setKundaliError,
  setAnimationComplete,
  clearKundaliData,
} from './slices/kundaliSlice';
export type { KundaliState, BirthChart, Planet, House } from './slices/kundaliSlice';

export {
  setHoroscopeData,
  setHoroscopeLoading,
  setHoroscopeError,
  clearHoroscopeData,
} from './slices/horoscopeSlice';
export type { HoroscopeState, HoroscopeData } from './slices/horoscopeSlice';

// Middleware
export {
  persistenceMiddleware,
  loadPersistedState,
  clearPersistedState,
} from './middleware/persistenceMiddleware';
