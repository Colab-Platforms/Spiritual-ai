import {
  loadPersistedState,
  clearPersistedState,
} from '../../redux/middleware/persistenceMiddleware';

describe('persistenceMiddleware', () => {
  const STORAGE_KEY = 'astrology_app_state';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loadPersistedState', () => {
    it('should return undefined when no state is persisted', () => {
      const result = loadPersistedState();
      expect(result).toBeUndefined();
    });

    it('should load persisted state from localStorage', () => {
      const mockState = {
        user: {
          isAuthenticated: true,
          userData: {
            dateOfBirth: '1990-01-15',
            timeOfBirth: '14:30',
            placeOfBirth: 'New York',
            zodiacSign: 'Capricorn',
          },
          error: null,
        },
        ui: {
          theme: 'dark' as const,
          modalOpen: false,
          selectedZodiac: null,
          loading: false,
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState));
      const result = loadPersistedState();

      expect(result).toEqual(mockState);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json {');
      const result = loadPersistedState();
      expect(result).toBeUndefined();
    });

    it('should return undefined when localStorage is not available', () => {
      const originalLocalStorage = global.localStorage;
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage not available');
          },
        },
        writable: true,
      });

      const result = loadPersistedState();
      expect(result).toBeUndefined();

      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });
  });

  describe('clearPersistedState', () => {
    it('should remove persisted state from localStorage', () => {
      const mockState = {
        user: {
          isAuthenticated: true,
          userData: null,
          error: null,
        },
        ui: {
          theme: 'dark' as const,
          modalOpen: false,
          selectedZodiac: null,
          loading: false,
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState));
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

      clearPersistedState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle clearing when no state is persisted', () => {
      expect(() => clearPersistedState()).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      const originalLocalStorage = global.localStorage;
      Object.defineProperty(global, 'localStorage', {
        value: {
          removeItem: () => {
            throw new Error('localStorage not available');
          },
        },
        writable: true,
      });

      expect(() => clearPersistedState()).not.toThrow();

      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });
  });
});
