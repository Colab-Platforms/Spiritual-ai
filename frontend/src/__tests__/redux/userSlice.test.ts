import userReducer, {
  setUserData,
  setAuthenticated,
  setUserError,
  clearUserData,
  updateZodiacSign,
  UserState,
  UserData,
} from '../../redux/slices/userSlice';

describe('userSlice', () => {
  const initialState: UserState = {
    isAuthenticated: false,
    userData: null,
    error: null,
  };

  const mockUserData: UserData = {
    dateOfBirth: '1990-01-15',
    timeOfBirth: '14:30',
    placeOfBirth: 'New York',
    zodiacSign: 'Capricorn',
  };

  describe('setUserData', () => {
    it('should set user data and clear error', () => {
      const state = userReducer(initialState, setUserData(mockUserData));
      expect(state.userData).toEqual(mockUserData);
      expect(state.error).toBeNull();
    });

    it('should replace existing user data', () => {
      const stateWithData = {
        ...initialState,
        userData: mockUserData,
      };
      const newUserData: UserData = {
        dateOfBirth: '1995-06-20',
        timeOfBirth: '10:00',
        placeOfBirth: 'Los Angeles',
        zodiacSign: 'Gemini',
      };
      const state = userReducer(stateWithData, setUserData(newUserData));
      expect(state.userData).toEqual(newUserData);
    });
  });

  describe('setAuthenticated', () => {
    it('should set authentication state to true', () => {
      const state = userReducer(initialState, setAuthenticated(true));
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set authentication state to false', () => {
      const stateAuthenticated = { ...initialState, isAuthenticated: true };
      const state = userReducer(stateAuthenticated, setAuthenticated(false));
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setUserError', () => {
    it('should set error message', () => {
      const errorMessage = 'Invalid birth date';
      const state = userReducer(initialState, setUserError(errorMessage));
      expect(state.error).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = userReducer(stateWithError, setUserError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('clearUserData', () => {
    it('should clear all user data and reset state', () => {
      const stateWithData: UserState = {
        isAuthenticated: true,
        userData: mockUserData,
        error: 'Some error',
      };
      const state = userReducer(stateWithData, clearUserData());
      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('updateZodiacSign', () => {
    it('should update zodiac sign when user data exists', () => {
      const stateWithData: UserState = {
        ...initialState,
        userData: mockUserData,
      };
      const state = userReducer(stateWithData, updateZodiacSign('Leo'));
      expect(state.userData?.zodiacSign).toBe('Leo');
    });

    it('should not update if user data is null', () => {
      const state = userReducer(initialState, updateZodiacSign('Leo'));
      expect(state.userData).toBeNull();
    });
  });
});
