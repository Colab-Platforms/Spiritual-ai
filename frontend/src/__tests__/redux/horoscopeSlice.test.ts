import horoscopeReducer, {
  setHoroscopeData,
  setHoroscopeLoading,
  setHoroscopeError,
  clearHoroscopeData,
  HoroscopeState,
  HoroscopeEntry,
} from '../../redux/slices/horoscopeSlice';

describe('horoscopeSlice', () => {
  const initialState: HoroscopeState = {
    data: null,
    loading: false,
    error: null,
  };

  const mockHoroscopeEntry: HoroscopeEntry = {
    zodiacSign: 'Aries',
    date: '2024-01-15',
    timeframe: 'today',
    content: 'A great day for new beginnings and taking action.',
  };

  describe('setHoroscopeData', () => {
    it('should set horoscope data and clear error', () => {
      const state = horoscopeReducer(
        initialState,
        setHoroscopeData(mockHoroscopeEntry)
      );
      expect(state.data).toEqual(mockHoroscopeEntry);
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should replace existing horoscope data', () => {
      const stateWithData = {
        ...initialState,
        data: mockHoroscopeEntry,
      };
      const newEntry: HoroscopeEntry = {
        ...mockHoroscopeEntry,
        zodiacSign: 'Taurus',
      };
      const state = horoscopeReducer(stateWithData, setHoroscopeData(newEntry));
      expect(state.data?.zodiacSign).toBe('Taurus');
    });

    it('should handle different timeframes', () => {
      const timeframes: Array<'today' | 'tomorrow' | 'weekly'> = [
        'today',
        'tomorrow',
        'weekly',
      ];

      timeframes.forEach((timeframe) => {
        const entry: HoroscopeEntry = {
          ...mockHoroscopeEntry,
          timeframe,
        };
        const state = horoscopeReducer(initialState, setHoroscopeData(entry));
        expect(state.data?.timeframe).toBe(timeframe);
      });
    });
  });

  describe('setHoroscopeLoading', () => {
    it('should set loading to true', () => {
      const state = horoscopeReducer(initialState, setHoroscopeLoading(true));
      expect(state.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateLoading = { ...initialState, loading: true };
      const state = horoscopeReducer(stateLoading, setHoroscopeLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setHoroscopeError', () => {
    it('should set error message and set loading to false', () => {
      const errorMessage = 'Failed to fetch horoscope';
      const state = horoscopeReducer(
        initialState,
        setHoroscopeError(errorMessage)
      );
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = horoscopeReducer(stateWithError, setHoroscopeError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('clearHoroscopeData', () => {
    it('should clear all horoscope data and reset state', () => {
      const stateWithData: HoroscopeState = {
        data: mockHoroscopeEntry,
        loading: true,
        error: 'Some error',
      };
      const state = horoscopeReducer(stateWithData, clearHoroscopeData());
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
