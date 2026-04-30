# AstroAPI Integration - Quick Start Guide

## Your API Details

**Base URL:** `https://astro-api-1qnc.onrender.com`  
**API Key:** `284797bc236d7373eadc0511a341a0ffe552bc573c1aef17f5da4ac3fac33f39`

### Available Endpoints

1. **Vedic Chart (Birth Chart)**
   - `POST /api/v1/vedic/chart`
   - Generates complete birth chart with planetary positions

2. **Yogas (Astrological Combinations)**
   - `GET /api/v1/vedic/yogas`
   - Returns yogas from birth chart

3. **Daily Horoscope**
   - `GET /api/v1/horoscope/daily/{sign}`
   - Example: `/api/v1/horoscope/daily/aries`

4. **Weekly Horoscope**
   - `GET /api/v1/horoscope/weekly/{sign}`

5. **Monthly Horoscope**
   - `GET /api/v1/horoscope/monthly/{sign}`

---

## Files Created/Updated

### ✅ Backend Service Layer
**File:** `backend/src/services/astroApiService.ts`
- Handles all AstroAPI calls
- Methods:
  - `generateVedicChart()` - Birth chart generation
  - `getYogas()` - Get yogas
  - `getDailyHoroscope()` - Daily horoscope
  - `getWeeklyHoroscope()` - Weekly horoscope
  - `getMonthlyHoroscope()` - Monthly horoscope
  - `getAllDailyHoroscopes()` - All zodiac signs
  - `getZodiacSignFromDate()` - Calculate zodiac from date

### ✅ Backend Controllers
**File:** `backend/src/controllers/kundaliController.ts`
- `generateKundali()` - Generate and save Kundali
- `getKundali()` - Retrieve user's Kundali
- `deleteKundali()` - Delete Kundali

**File:** `backend/src/controllers/horoscopeController.ts`
- `getDailyHoroscope()` - Get daily horoscope
- `getWeeklyHoroscope()` - Get weekly horoscope
- `getMonthlyHoroscope()` - Get monthly horoscope
- `getAllDailyHoroscopes()` - Get all horoscopes

### ✅ Environment Variables
**File:** `backend/.env`
```env
ASTRO_API_BASE_URL=https://astro-api-1qnc.onrender.com
ASTRO_API_KEY=284797bc236d7373eadc0511a341a0ffe552bc573c1aef17f5da4ac3fac33f39
```

---

## Testing the Integration

### Test 1: Generate Vedic Chart

```bash
curl -X POST https://astro-api-1qnc.onrender.com/api/v1/vedic/chart \
  -H "Content-Type: application/json" \
  -d '{
    "day": 15,
    "month": 1,
    "year": 1990,
    "hour": 14,
    "minute": 30,
    "latitude": 19.0760,
    "longitude": 72.8777,
    "timezone": 5.5
  }'
```

### Test 2: Get Daily Horoscope

```bash
curl https://astro-api-1qnc.onrender.com/api/v1/horoscope/daily/aries
```

### Test 3: Get Weekly Horoscope

```bash
curl https://astro-api-1qnc.onrender.com/api/v1/horoscope/weekly/taurus
```

### Test 4: Get Monthly Horoscope

```bash
curl https://astro-api-1qnc.onrender.com/api/v1/horoscope/monthly/gemini
```

---

## Backend API Endpoints (Your App)

### Kundali Endpoints

**Generate Kundali**
```
POST /api/kundali/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "dateOfBirth": "1990-01-15",
  "timeOfBirth": "14:30",
  "placeOfBirth": "Mumbai, India",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "timezone": 5.5
}
```

**Get Kundali**
```
GET /api/kundali/get
Authorization: Bearer {token}
```

### Horoscope Endpoints

**Get Daily Horoscope**
```
GET /api/horoscope/daily/aries
```

**Get Weekly Horoscope**
```
GET /api/horoscope/weekly/taurus
```

**Get Monthly Horoscope**
```
GET /api/horoscope/monthly/gemini
```

**Get All Daily Horoscopes**
```
GET /api/horoscope/all
```

---

## Frontend Integration

### 1. Create API Client

**File:** `frontend/src/services/astroApiClient.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const astroApiClient = {
  // Kundali endpoints
  generateKundali: (birthData: any) =>
    apiClient.post('/kundali/generate', birthData),
  
  getKundali: () =>
    apiClient.get('/kundali/get'),

  // Horoscope endpoints
  getDailyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/daily/${sign}`),

  getWeeklyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/weekly/${sign}`),

  getMonthlyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/monthly/${sign}`),

  getAllHoroscopes: () =>
    apiClient.get('/horoscope/all'),
};

export default apiClient;
```

### 2. Update Redux Slices

**File:** `frontend/src/redux/slices/kundaliSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { astroApiClient } from '../../services/astroApiClient';

export const generateKundali = createAsyncThunk(
  'kundali/generate',
  async (birthData: any, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.generateKundali(birthData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate Kundali');
    }
  }
);

export const fetchKundali = createAsyncThunk(
  'kundali/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getKundali();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch Kundali');
    }
  }
);

interface KundaliState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: KundaliState = {
  data: null,
  loading: false,
  error: null,
};

const kundaliSlice = createSlice({
  name: 'kundali',
  initialState,
  reducers: {
    clearKundali: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateKundali.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(generateKundali.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchKundali.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKundali.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchKundali.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearKundali } = kundaliSlice.actions;
export default kundaliSlice.reducer;
```

**File:** `frontend/src/redux/slices/horoscopeSlice.ts`

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { astroApiClient } from '../../services/astroApiClient';

export const fetchDailyHoroscope = createAsyncThunk(
  'horoscope/fetchDaily',
  async (sign: string, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getDailyHoroscope(sign);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch horoscope');
    }
  }
);

export const fetchAllHoroscopes = createAsyncThunk(
  'horoscope/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getAllHoroscopes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch horoscopes');
    }
  }
);

interface HoroscopeState {
  daily: any | null;
  all: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: HoroscopeState = {
  daily: null,
  all: null,
  loading: false,
  error: null,
};

const horoscopeSlice = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    clearHoroscope: (state) => {
      state.daily = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload.data;
      })
      .addCase(fetchDailyHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllHoroscopes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllHoroscopes.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload.data;
      })
      .addCase(fetchAllHoroscopes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHoroscope } = horoscopeSlice.actions;
export default horoscopeSlice.reducer;
```

---

## Next Steps

1. ✅ Backend service created (`astroApiService.ts`)
2. ✅ Controllers updated with AstroAPI integration
3. ✅ Environment variables configured
4. 📝 Create frontend API client (`astroApiClient.ts`)
5. 📝 Update Redux slices
6. 📝 Update components to use new API
7. 📝 Test integration end-to-end

---

## Troubleshooting

### Issue: "Cannot find module 'astroApiService'"
- Make sure `backend/src/services/astroApiService.ts` exists
- Check import path is correct

### Issue: "API Key not found"
- Verify `.env` file has `ASTRO_API_KEY` set
- Restart backend server after updating `.env`

### Issue: "CORS Error"
- Ensure backend has CORS enabled
- Check frontend API URL matches backend

### Issue: "Invalid birth data"
- Verify date format: `YYYY-MM-DD`
- Verify time format: `HH:MM` (24-hour)
- Check latitude/longitude are valid numbers
- Ensure timezone is correct (IST = 5.5)

---

## API Response Examples

### Vedic Chart Response
```json
{
  "ascendant": "Libra",
  "moonSign": "Taurus",
  "sunSign": "Capricorn",
  "planets": [
    {
      "name": "Sun",
      "sign": "Capricorn",
      "degree": 25.5,
      "house": 10
    }
  ],
  "houses": [
    {
      "number": 1,
      "sign": "Libra",
      "degree": 15.2
    }
  ]
}
```

### Horoscope Response
```json
{
  "sign": "aries",
  "date": "2024-01-28",
  "horoscope": "Today is a great day for new beginnings..."
}
```

---

**Status:** ✅ Ready for Implementation  
**Last Updated:** January 2026
