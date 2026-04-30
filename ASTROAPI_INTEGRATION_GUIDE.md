# AstroAPI Integration Guide

## Overview

This guide explains how to integrate AstroAPI (API key: `284797bc236d7373eadc0511a341a0ffe552bc573c1aef17f5da4ac3fac33f39`) into your Premium Astrology Web Application.

---

## Step 1: Setup Environment Variables

### Backend (.env file)

```env
# AstroAPI Configuration
ASTRO_API_KEY=284797bc236d7373eadc0511a341a0ffe552bc573c1aef17f5da4ac3fac33f39
ASTRO_API_BASE_URL=https://api.astroapi.com/v1
# or check the actual endpoint from AstroAPI documentation
```

### Update backend/src/config/environment.ts

```typescript
export const config = {
  astroApi: {
    apiKey: process.env.ASTRO_API_KEY || '',
    baseUrl: process.env.ASTRO_API_BASE_URL || 'https://api.astroapi.com/v1',
  },
  // ... other config
};
```

---

## Step 2: Create AstroAPI Service

### Create: backend/src/services/astroApiService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { config } from '../config/environment';

interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
}

interface KundaliResponse {
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
}

class AstroApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.astroApi.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.astroApi.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate Kundali (Birth Chart) from birth data
   */
  async generateKundali(birthData: BirthData): Promise<KundaliResponse> {
    try {
      const response = await this.client.post('/kundali/generate', {
        year: birthData.year,
        month: birthData.month,
        day: birthData.day,
        hour: birthData.hour,
        minute: birthData.minute,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
      });

      return response.data;
    } catch (error) {
      console.error('Error generating Kundali:', error);
      throw new Error('Failed to generate Kundali from AstroAPI');
    }
  }

  /**
   * Get daily horoscope for a zodiac sign
   */
  async getDailyHoroscope(zodiacSign: string): Promise<string> {
    try {
      const response = await this.client.get(`/horoscope/daily/${zodiacSign}`);
      return response.data.horoscope;
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      throw new Error('Failed to fetch horoscope from AstroAPI');
    }
  }

  /**
   * Get planetary positions for a specific date
   */
  async getPlanetaryPositions(date: Date): Promise<any> {
    try {
      const response = await this.client.post('/planets/positions', {
        date: date.toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching planetary positions:', error);
      throw new Error('Failed to fetch planetary positions');
    }
  }

  /**
   * Get zodiac sign from birth date
   */
  async getZodiacSign(month: number, day: number): Promise<string> {
    try {
      const response = await this.client.post('/zodiac/sign', {
        month,
        day,
      });
      return response.data.sign;
    } catch (error) {
      console.error('Error fetching zodiac sign:', error);
      throw new Error('Failed to fetch zodiac sign');
    }
  }
}

export default new AstroApiService();
```

---

## Step 3: Update Kundali Controller

### Update: backend/src/controllers/kundaliController.ts

```typescript
import { Request, Response } from 'express';
import astroApiService from '../services/astroApiService';
import Kundali from '../models/Kundali';

export const generateKundali = async (req: Request, res: Response) => {
  try {
    const { dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = req.body;

    // Parse birth data
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    const [hour, minute] = timeOfBirth.split(':').map(Number);

    // Call AstroAPI to generate Kundali
    const kundaliData = await astroApiService.generateKundali({
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude,
      timezone,
    });

    // Save to database
    const kundali = new Kundali({
      userId: req.user?.id,
      birthChart: kundaliData,
      birthData: {
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      },
    });

    await kundali.save();

    res.json({
      success: true,
      data: kundali,
    });
  } catch (error) {
    console.error('Error generating Kundali:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Kundali',
    });
  }
};

export const getKundali = async (req: Request, res: Response) => {
  try {
    const kundali = await Kundali.findOne({ userId: req.user?.id });

    if (!kundali) {
      return res.status(404).json({
        success: false,
        error: 'Kundali not found',
      });
    }

    res.json({
      success: true,
      data: kundali,
    });
  } catch (error) {
    console.error('Error fetching Kundali:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Kundali',
    });
  }
};
```

---

## Step 4: Update Horoscope Controller

### Update: backend/src/controllers/horoscopeController.ts

```typescript
import { Request, Response } from 'express';
import astroApiService from '../services/astroApiService';
import Horoscope from '../models/Horoscope';

export const getDailyHoroscope = async (req: Request, res: Response) => {
  try {
    const { zodiacSign } = req.params;

    // Check cache first
    const cached = await Horoscope.findOne({
      zodiacSign,
      date: new Date().toDateString(),
    });

    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Fetch from AstroAPI
    const horoscope = await astroApiService.getDailyHoroscope(zodiacSign);

    // Save to database
    const horoscopeDoc = new Horoscope({
      zodiacSign,
      date: new Date(),
      content: horoscope,
      timeframe: 'today',
    });

    await horoscopeDoc.save();

    res.json({
      success: true,
      data: horoscopeDoc,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch horoscope',
    });
  }
};

export const getAllHoroscopes = async (req: Request, res: Response) => {
  try {
    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const horoscopes = await Promise.all(
      zodiacSigns.map(sign => astroApiService.getDailyHoroscope(sign))
    );

    res.json({
      success: true,
      data: zodiacSigns.map((sign, idx) => ({
        zodiacSign: sign,
        horoscope: horoscopes[idx],
      })),
    });
  } catch (error) {
    console.error('Error fetching all horoscopes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch horoscopes',
    });
  }
};
```

---

## Step 5: Create API Routes

### Create: backend/src/routes/astroRoutes.ts

```typescript
import express from 'express';
import { generateKundali, getKundali } from '../controllers/kundaliController';
import { getDailyHoroscope, getAllHoroscopes } from '../controllers/horoscopeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Kundali routes
router.post('/kundali/generate', authenticate, generateKundali);
router.get('/kundali/get', authenticate, getKundali);

// Horoscope routes
router.get('/horoscope/daily/:zodiacSign', getDailyHoroscope);
router.get('/horoscope/all', getAllHoroscopes);

export default router;
```

---

## Step 6: Update Backend Index

### Update: backend/src/index.ts

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import astroRoutes from './routes/astroRoutes';
import authRoutes from './routes/authRoutes';
import birthDataRoutes from './routes/birthDataRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/astro', astroRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', birthDataRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Step 7: Frontend Integration

### Create: frontend/src/services/astroApiClient.ts

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
    apiClient.post('/astro/kundali/generate', birthData),
  
  getKundali: () =>
    apiClient.get('/astro/kundali/get'),

  // Horoscope endpoints
  getDailyHoroscope: (zodiacSign: string) =>
    apiClient.get(`/astro/horoscope/daily/${zodiacSign}`),

  getAllHoroscopes: () =>
    apiClient.get('/astro/horoscope/all'),
};

export default apiClient;
```

---

## Step 8: Update Redux Slices

### Update: frontend/src/redux/slices/kundaliSlice.ts

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

### Update: frontend/src/redux/slices/horoscopeSlice.ts

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { astroApiClient } from '../../services/astroApiClient';

export const fetchDailyHoroscope = createAsyncThunk(
  'horoscope/fetchDaily',
  async (zodiacSign: string, { rejectWithValue }) => {
    try {
      const response = await astroApiClient.getDailyHoroscope(zodiacSign);
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

## Step 9: Update Frontend Components

### Update: frontend/src/components/BirthDataForm.tsx

```typescript
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateKundali } from '../redux/slices/kundaliSlice';
import { useNavigate } from 'react-router-dom';

export const BirthDataForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    latitude: 0,
    longitude: 0,
    timezone: 5.5, // IST default
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.dateOfBirth || !formData.timeOfBirth || !formData.placeOfBirth) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Dispatch action to generate Kundali
      const result = await dispatch(generateKundali(formData) as any);

      if (result.payload?.data) {
        // Navigate to Kundali page
        navigate('/kundali');
      } else {
        setError(result.payload || 'Failed to generate Kundali');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-cosmic-text mb-2">Date of Birth</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="w-full px-4 py-2 bg-cosmic-dark border border-cosmic-orange/30 rounded-lg text-cosmic-text"
        />
      </div>

      <div>
        <label className="block text-cosmic-text mb-2">Time of Birth</label>
        <input
          type="time"
          value={formData.timeOfBirth}
          onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
          className="w-full px-4 py-2 bg-cosmic-dark border border-cosmic-orange/30 rounded-lg text-cosmic-text"
        />
      </div>

      <div>
        <label className="block text-cosmic-text mb-2">Place of Birth</label>
        <input
          type="text"
          placeholder="City, Country"
          value={formData.placeOfBirth}
          onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
          className="w-full px-4 py-2 bg-cosmic-dark border border-cosmic-orange/30 rounded-lg text-cosmic-text"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-cosmic-orange text-cosmic-black font-bold rounded-full hover:bg-cosmic-orange-light disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate My Kundali'}
      </button>
    </form>
  );
};
```

---

## Step 10: Install Required Packages

### Backend

```bash
npm install axios dotenv
```

### Frontend

```bash
npm install axios
```

---

## Step 11: Environment Setup

### Create: backend/.env

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/premium-astrology-app

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# AstroAPI
ASTRO_API_KEY=284797bc236d7373eadc0511a341a0ffe552bc573c1aef17f5da4ac3fac33f39
ASTRO_API_BASE_URL=https://api.astroapi.com/v1

# Server
PORT=5000
NODE_ENV=development
```

### Create: frontend/.env

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 12: Testing the Integration

### Test Kundali Generation

```bash
curl -X POST http://localhost:5000/api/astro/kundali/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "dateOfBirth": "1990-01-15",
    "timeOfBirth": "14:30",
    "placeOfBirth": "Mumbai, India",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "timezone": 5.5
  }'
```

### Test Horoscope Fetch

```bash
curl http://localhost:5000/api/astro/horoscope/daily/Aries
```

---

## Step 13: Error Handling

### Add Error Handling Middleware

```typescript
// backend/src/middleware/errorHandler.ts
export const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  if (err.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid API key',
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded - Please try again later',
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};
```

---

## Step 14: Caching Strategy

### Add Redis Caching (Optional)

```typescript
import redis from 'redis';

const redisClient = redis.createClient();

export const cacheHoroscope = async (zodiacSign: string, horoscope: string) => {
  const key = `horoscope:${zodiacSign}:${new Date().toDateString()}`;
  await redisClient.setex(key, 86400, horoscope); // Cache for 24 hours
};

export const getCachedHoroscope = async (zodiacSign: string) => {
  const key = `horoscope:${zodiacSign}:${new Date().toDateString()}`;
  return await redisClient.get(key);
};
```

---

## Troubleshooting

### Issue: "Invalid API Key"
- Check that `ASTRO_API_KEY` is correctly set in `.env`
- Verify the API key format

### Issue: "Rate Limit Exceeded"
- Implement caching to reduce API calls
- Add request throttling

### Issue: "CORS Error"
- Ensure backend has CORS enabled
- Check frontend API URL matches backend

### Issue: "Kundali Generation Failed"
- Verify birth data format (YYYY-MM-DD for date)
- Check latitude/longitude are valid
- Ensure timezone is correct

---

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create AstroAPI service
3. ✅ Update controllers and routes
4. ✅ Create frontend API client
5. ✅ Update Redux slices
6. ✅ Update components
7. ✅ Test integration
8. ✅ Deploy to production

---

## API Response Examples

### Kundali Response
```json
{
  "success": true,
  "data": {
    "_id": "123456",
    "userId": "user123",
    "birthChart": {
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
  }
}
```

### Horoscope Response
```json
{
  "success": true,
  "data": {
    "_id": "123456",
    "zodiacSign": "Aries",
    "date": "2024-01-28",
    "content": "Today is a great day for new beginnings...",
    "timeframe": "today"
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Ready for Implementation
