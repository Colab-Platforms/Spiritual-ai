import { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const STORAGE_KEY = 'astrology_app_state';

/**
 * Middleware to persist Redux state to localStorage
 * Persists user and ui slices for offline support
 */
export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Persist only user and ui slices to localStorage
    const persistedState = {
      user: state.user,
      ui: state.ui,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
    } catch (error) {
      console.error('Failed to persist state to localStorage:', error);
    }

    return result;
  };

/**
 * Load persisted state from localStorage
 */
export const loadPersistedState = (): Partial<RootState> | undefined => {
  try {
    const persistedState = localStorage.getItem(STORAGE_KEY);
    if (persistedState) {
      return JSON.parse(persistedState) as Partial<RootState>;
    }
  } catch (error) {
    console.error('Failed to load persisted state from localStorage:', error);
  }
  return undefined;
};

/**
 * Clear persisted state from localStorage
 */
export const clearPersistedState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted state from localStorage:', error);
  }
};
