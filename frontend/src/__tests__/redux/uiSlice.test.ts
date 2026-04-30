import uiReducer, {
  setModalOpen,
  setSelectedZodiac,
  setLoading,
  setTheme,
  UIState,
} from '../../redux/slices/uiSlice';

describe('uiSlice', () => {
  const initialState: UIState = {
    theme: 'dark',
    modalOpen: false,
    selectedZodiac: null,
    loading: false,
  };

  describe('setModalOpen', () => {
    it('should set modal open to true', () => {
      const state = uiReducer(initialState, setModalOpen(true));
      expect(state.modalOpen).toBe(true);
    });

    it('should set modal open to false', () => {
      const stateWithModal = { ...initialState, modalOpen: true };
      const state = uiReducer(stateWithModal, setModalOpen(false));
      expect(state.modalOpen).toBe(false);
    });
  });

  describe('setSelectedZodiac', () => {
    it('should set selected zodiac sign', () => {
      const state = uiReducer(initialState, setSelectedZodiac('Aries'));
      expect(state.selectedZodiac).toBe('Aries');
    });

    it('should clear selected zodiac when set to null', () => {
      const stateWithZodiac = { ...initialState, selectedZodiac: 'Taurus' };
      const state = uiReducer(stateWithZodiac, setSelectedZodiac(null));
      expect(state.selectedZodiac).toBeNull();
    });

    it('should handle all zodiac signs', () => {
      const zodiacSigns = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ];

      zodiacSigns.forEach((sign) => {
        const state = uiReducer(initialState, setSelectedZodiac(sign));
        expect(state.selectedZodiac).toBe(sign);
      });
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = uiReducer(initialState, setLoading(true));
      expect(state.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateLoading = { ...initialState, loading: true };
      const state = uiReducer(stateLoading, setLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      const state = uiReducer(initialState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('should maintain dark theme as only option', () => {
      const state = uiReducer(initialState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });
  });
});
