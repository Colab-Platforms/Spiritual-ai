import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  zodiacSign: string;
}

export interface UserState {
  isAuthenticated: boolean;
  userData: UserData | null;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userData: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateZodiacSign: (state, action: PayloadAction<string>) => {
      if (state.userData) {
        state.userData.zodiacSign = action.payload;
      }
    },
  },
});

export const {
  setUserData,
  setAuthenticated,
  setUserError,
  clearUserData,
  updateZodiacSign,
} = userSlice.actions;

export default userSlice.reducer;
