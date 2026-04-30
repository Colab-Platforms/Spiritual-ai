import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BirthDataForm from '../../components/BirthDataForm';
import userReducer from '../../redux/slices/userSlice';
import uiReducer from '../../redux/slices/uiSlice';
import kundaliReducer from '../../redux/slices/kundaliSlice';
import horoscopeReducer from '../../redux/slices/horoscopeSlice';
import {
  persistenceMiddleware,
  loadPersistedState,
  clearPersistedState,
} from '../../redux/middleware/persistenceMiddleware';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Integration tests for Redux state management with BirthDataForm
 * Validates Requirements: 1.2, 14.1, 14.4, 14.5, 17.1, 17.5
 */

// Create a test store with persistence middleware
const createTestStore = (preloadedState?: any) => {
  return configureStore({
    reducer: {
      user: userReducer,
      ui: uiReducer,
      kundali: kundaliReducer,
      horoscope: horoscopeReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(persistenceMiddleware),
  });
};

describe('Redux Birth Data Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Requirement 1.2: Redux State Storage', () => {
    it('should store valid birth data in Redux state when form is submitted', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      // Fill in the form
      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      // Verify Redux state was updated
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData).toBeDefined();
        expect(state.user.userData?.dateOfBirth).toBe('1990-05-15');
        expect(state.user.userData?.timeOfBirth).toBe('14:30');
        expect(state.user.userData?.placeOfBirth).toBe('New York, USA');
        expect(state.user.userData?.zodiacSign).toBe('Taurus');
      });
    });

    it('should calculate correct zodiac sign and store in Redux', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      // Test Aries (March 21 - April 19)
      fireEvent.change(dateInput, { target: { value: '1995-04-10' } });
      fireEvent.change(timeInput, { target: { value: '10:00' } });
      fireEvent.change(placeInput, { target: { value: 'London, UK' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData?.zodiacSign).toBe('Aries');
      });
    });
  });

  describe('Requirement 14.1: Redux Birth Data Management', () => {
    it('should manage user birth data in Redux store', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1988-12-25' } });
      fireEvent.change(timeInput, { target: { value: '09:15' } });
      fireEvent.change(placeInput, { target: { value: 'Paris, France' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData).toEqual({
          dateOfBirth: '1988-12-25',
          timeOfBirth: '09:15',
          placeOfBirth: 'Paris, France',
          zodiacSign: 'Capricorn',
        });
      });
    });
  });

  describe('Requirement 14.4: Redux Component Update Propagation', () => {
    it('should propagate Redux state changes to connected components', async () => {
      const store = createTestStore();

      const TestComponent = () => {
        const userData = store.getState().user.userData;
        return (
          <div>
            <BirthDataForm />
            {userData && (
              <div data-testid="user-data-display">
                <p>{userData.zodiacSign}</p>
              </div>
            )}
          </div>
        );
      };

      const { rerender } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '2000-07-04' } });
      fireEvent.change(timeInput, { target: { value: '16:45' } });
      fireEvent.change(placeInput, { target: { value: 'Tokyo, Japan' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        rerender(
          <Provider store={store}>
            <TestComponent />
          </Provider>
        );
        const state = store.getState();
        expect(state.user.userData?.zodiacSign).toBe('Cancer');
      });
    });
  });

  describe('Requirement 14.5: Redux LocalStorage Hydration', () => {
    it('should hydrate Redux state from localStorage on app load', async () => {
      // Set up localStorage with persisted state
      const persistedState = {
        user: {
          isAuthenticated: false,
          userData: {
            dateOfBirth: '1992-03-20',
            timeOfBirth: '11:30',
            placeOfBirth: 'Berlin, Germany',
            zodiacSign: 'Pisces',
          },
          error: null,
        },
        ui: {
          theme: 'dark',
          modalOpen: false,
          selectedZodiac: null,
          loading: false,
        },
      };

      localStorage.setItem('astrology_app_state', JSON.stringify(persistedState));

      // Load persisted state
      const loadedState = loadPersistedState();

      expect(loadedState).toBeDefined();
      expect(loadedState?.user.userData).toEqual(persistedState.user.userData);
      expect(loadedState?.ui).toEqual(persistedState.ui);
    });

    it('should create store with preloaded state from localStorage', () => {
      const persistedState = {
        user: {
          isAuthenticated: false,
          userData: {
            dateOfBirth: '1985-06-10',
            timeOfBirth: '08:00',
            placeOfBirth: 'Madrid, Spain',
            zodiacSign: 'Gemini',
          },
          error: null,
        },
        ui: {
          theme: 'dark',
          modalOpen: false,
          selectedZodiac: null,
          loading: false,
        },
      };

      localStorage.setItem('astrology_app_state', JSON.stringify(persistedState));

      const loadedState = loadPersistedState();
      const store = createTestStore(loadedState);

      const state = store.getState();
      expect(state.user.userData?.dateOfBirth).toBe('1985-06-10');
      expect(state.user.userData?.zodiacSign).toBe('Gemini');
    });
  });

  describe('Requirement 17.1: Immediate Redux State Storage', () => {
    it('should store birth data in Redux immediately upon form submission', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1998-11-22' } });
      fireEvent.change(timeInput, { target: { value: '15:20' } });
      fireEvent.change(placeInput, { target: { value: 'Sydney, Australia' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      // Verify state is updated immediately
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData).toBeDefined();
        expect(state.user.userData?.dateOfBirth).toBe('1998-11-22');
      });
    });
  });

  describe('Requirement 17.5: LocalStorage Fallback for Unauthenticated Users', () => {
    it('should persist birth data to localStorage for unauthenticated users', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1993-09-05' } });
      fireEvent.change(timeInput, { target: { value: '12:45' } });
      fireEvent.change(placeInput, { target: { value: 'Toronto, Canada' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      // Wait for state to be persisted
      await waitFor(() => {
        const persistedData = localStorage.getItem('astrology_app_state');
        expect(persistedData).toBeDefined();

        const parsed = JSON.parse(persistedData!);
        expect(parsed.user.userData).toBeDefined();
        expect(parsed.user.userData.dateOfBirth).toBe('1993-09-05');
        expect(parsed.user.userData.zodiacSign).toBe('Virgo');
      });
    });

    it('should retrieve persisted data from localStorage on app reload', async () => {
      // First render - submit form
      const store1 = createTestStore();

      const { unmount } = render(
        <Provider store={store1}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1987-02-14' } });
      fireEvent.change(timeInput, { target: { value: '07:30' } });
      fireEvent.change(placeInput, { target: { value: 'Amsterdam, Netherlands' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        const persistedData = localStorage.getItem('astrology_app_state');
        expect(persistedData).toBeDefined();
      });

      unmount();

      // Second render - verify data is restored from localStorage
      const loadedState = loadPersistedState();
      const store2 = createTestStore(loadedState);

      const state = store2.getState();
      expect(state.user.userData?.dateOfBirth).toBe('1987-02-14');
      expect(state.user.userData?.timeOfBirth).toBe('07:30');
      expect(state.user.userData?.placeOfBirth).toBe('Amsterdam, Netherlands');
      expect(state.user.userData?.zodiacSign).toBe('Aquarius');
    });

    it('should clear localStorage when clearPersistedState is called', async () => {
      const persistedState = {
        user: {
          isAuthenticated: false,
          userData: {
            dateOfBirth: '1990-01-01',
            timeOfBirth: '12:00',
            placeOfBirth: 'Test City',
            zodiacSign: 'Capricorn',
          },
          error: null,
        },
        ui: {
          theme: 'dark',
          modalOpen: false,
          selectedZodiac: null,
          loading: false,
        },
      };

      localStorage.setItem('astrology_app_state', JSON.stringify(persistedState));
      expect(localStorage.getItem('astrology_app_state')).toBeDefined();

      clearPersistedState();

      expect(localStorage.getItem('astrology_app_state')).toBeNull();
    });
  });

  describe('Redux Integration - Error Handling', () => {
    it('should handle invalid data gracefully and not persist to Redux', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;

      // Try to submit with future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: futureDateString } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      // Verify Redux state was not updated
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData).toBeNull();
        expect(state.user.error).toBeDefined();
      });
    });
  });

  describe('Redux Integration - Multiple Submissions', () => {
    it('should update Redux state with new data on subsequent submissions', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <BirthDataForm />
        </Provider>
      );

      // First submission
      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData?.placeOfBirth).toBe('New York, USA');
      });

      // Second submission with different data
      fireEvent.change(dateInput, { target: { value: '1995-08-20' } });
      fireEvent.change(timeInput, { target: { value: '10:00' } });
      fireEvent.change(placeInput, { target: { value: 'London, UK' } });

      fireEvent.click(screen.getByRole('button', { name: /Generate My Kundali/i }));

      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData?.placeOfBirth).toBe('London, UK');
        expect(state.user.userData?.zodiacSign).toBe('Leo');
      });
    });
  });
});
