import kundaliReducer, {
  setKundaliData,
  setKundaliLoading,
  setKundaliError,
  setAnimationComplete,
  clearKundaliData,
  KundaliState,
  BirthChart,
} from '../../redux/slices/kundaliSlice';

describe('kundaliSlice', () => {
  const initialState: KundaliState = {
    data: null,
    loading: false,
    error: null,
    animationComplete: false,
  };

  const mockBirthChart: BirthChart = {
    planets: [
      {
        name: 'Sun',
        sign: 'Capricorn',
        degree: 25.5,
        house: 1,
      },
      {
        name: 'Moon',
        sign: 'Taurus',
        degree: 12.3,
        house: 5,
      },
    ],
    houses: [
      { number: 1, sign: 'Capricorn', degree: 15.0 },
      { number: 2, sign: 'Aquarius', degree: 18.5 },
    ],
    ascendant: 'Capricorn',
    moonSign: 'Taurus',
  };

  describe('setKundaliData', () => {
    it('should set kundali data and clear error', () => {
      const state = kundaliReducer(initialState, setKundaliData(mockBirthChart));
      expect(state.data).toEqual(mockBirthChart);
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('should replace existing kundali data', () => {
      const stateWithData = {
        ...initialState,
        data: mockBirthChart,
      };
      const newBirthChart: BirthChart = {
        ...mockBirthChart,
        ascendant: 'Leo',
      };
      const state = kundaliReducer(stateWithData, setKundaliData(newBirthChart));
      expect(state.data?.ascendant).toBe('Leo');
    });
  });

  describe('setKundaliLoading', () => {
    it('should set loading to true', () => {
      const state = kundaliReducer(initialState, setKundaliLoading(true));
      expect(state.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateLoading = { ...initialState, loading: true };
      const state = kundaliReducer(stateLoading, setKundaliLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setKundaliError', () => {
    it('should set error message and set loading to false', () => {
      const errorMessage = 'Failed to generate kundali';
      const state = kundaliReducer(initialState, setKundaliError(errorMessage));
      expect(state.error).toBe(errorMessage);
      expect(state.loading).toBe(false);
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = kundaliReducer(stateWithError, setKundaliError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('setAnimationComplete', () => {
    it('should set animation complete to true', () => {
      const state = kundaliReducer(initialState, setAnimationComplete(true));
      expect(state.animationComplete).toBe(true);
    });

    it('should set animation complete to false', () => {
      const stateAnimated = { ...initialState, animationComplete: true };
      const state = kundaliReducer(stateAnimated, setAnimationComplete(false));
      expect(state.animationComplete).toBe(false);
    });
  });

  describe('clearKundaliData', () => {
    it('should clear all kundali data and reset state', () => {
      const stateWithData: KundaliState = {
        data: mockBirthChart,
        loading: true,
        error: 'Some error',
        animationComplete: true,
      };
      const state = kundaliReducer(stateWithData, clearKundaliData());
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.animationComplete).toBe(false);
    });
  });
});
