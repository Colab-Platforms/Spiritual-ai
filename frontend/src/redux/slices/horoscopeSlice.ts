import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { astroApiClient } from '../../services/astroApiClient';

export interface HoroscopeData {
  sign: string;
  date: string;
  horoscope: string;
}

interface HoroscopeState {
  daily: HoroscopeData | null;
  weekly: HoroscopeData | null;
  monthly: HoroscopeData | null;
  all: HoroscopeData[] | null;
  loading: boolean;
  error: string | null;
  selectedSign: string | null;
}

const initialState: HoroscopeState = {
  daily: null,
  weekly: null,
  monthly: null,
  all: null,
  loading: false,
  error: null,
  selectedSign: null,
};

// Async thunks
export const fetchDailyHoroscope = createAsyncThunk(
  'horoscope/fetchDaily',
  async (sign: string, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getDailyHoroscope(sign);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch daily horoscope'
      );
    }
  }
);

export const fetchWeeklyHoroscope = createAsyncThunk(
  'horoscope/fetchWeekly',
  async (sign: string, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getWeeklyHoroscope(sign);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch weekly horoscope'
      );
    }
  }
);

export const fetchMonthlyHoroscope = createAsyncThunk(
  'horoscope/fetchMonthly',
  async (sign: string, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getMonthlyHoroscope(sign);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch monthly horoscope'
      );
    }
  }
);

export const fetchAllHoroscopes = createAsyncThunk(
  'horoscope/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getAllHoroscopes();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch all horoscopes'
      );
    }
  }
);

const horoscopeSlice = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    clearHoroscope: (state) => {
      state.daily = null;
      state.weekly = null;
      state.monthly = null;
      state.error = null;
    },
    setSelectedSign: (state, action) => {
      state.selectedSign = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Daily Horoscope
      .addCase(fetchDailyHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload;
      })
      .addCase(fetchDailyHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Weekly Horoscope
      .addCase(fetchWeeklyHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.weekly = action.payload;
      })
      .addCase(fetchWeeklyHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Monthly Horoscope
      .addCase(fetchMonthlyHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.monthly = action.payload;
      })
      .addCase(fetchMonthlyHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // All Horoscopes
      .addCase(fetchAllHoroscopes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHoroscopes.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllHoroscopes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHoroscope, setSelectedSign, clearError } = horoscopeSlice.actions;
export default horoscopeSlice.reducer;
