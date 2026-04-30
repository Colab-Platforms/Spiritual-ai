import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const astroApiClient = {
  // Kundali endpoints
  generateKundali: (birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    latitude: number;
    longitude: number;
    timezone?: number;
  }) => apiClient.post('/kundali/generate', birthData),

  getKundali: () => apiClient.get('/kundali/get'),

  // Horoscope endpoints
  getDailyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/daily/${sign}`),

  getWeeklyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/weekly/${sign}`),

  getMonthlyHoroscope: (sign: string) =>
    apiClient.get(`/horoscope/monthly/${sign}`),

  getAllHoroscopes: () => apiClient.get('/horoscope/all'),
};

export default apiClient;
