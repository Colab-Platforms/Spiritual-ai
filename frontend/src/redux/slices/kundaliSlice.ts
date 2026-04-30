import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { astroApiClient } from '../../services/astroApiClient';

export interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone?: number;
}

export interface KundaliData {
  _id: string;
  userId: string;
  birthChart: {
    ascendant: string;
    moonSign: string;
    sunSign: string;
    planets: Array<{
      name: string;
      sign: string;
      degree: number;
      house: number;
    }>;
    houses: Array<{
      number: number;
      sign: string;
      degree: number;
    }>;
    yogas: string[];
    zodiacSign: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface KundaliState {
  data: KundaliData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: KundaliState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const generateKundali = createAsyncThunk(
  'kundali/generate',
  async (birthData: BirthData, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.generateKundali(birthData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to generate Kundali'
      );
    }
  }
);

export const fetchKundali = createAsyncThunk(
  'kundali/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getKundali();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch Kundali'
      );
    }
  }
);

const kundaliSlice = createSlice({
  name: 'kundali',
  initialState,
  reducers: {
    clearKundali: (state) => {
      state.data = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Kundali
      .addCase(generateKundali.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(generateKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.success = true;
      })
      .addCase(generateKundali.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Fetch Kundali
      .addCase(fetchKundali.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchKundali.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearKundali, clearError } = kundaliSlice.actions;
export default kundaliSlice.reducer;
