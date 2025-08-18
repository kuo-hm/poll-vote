import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add IP headers for development
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Add headers for IP-based voting in development
    config.headers['X-Forwarded-For'] = '127.0.0.1';
    config.headers['X-Real-IP'] = '127.0.0.1';
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
