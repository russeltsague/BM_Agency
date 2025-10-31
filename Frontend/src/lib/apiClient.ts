import axios, { AxiosResponse, AxiosError } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // For cookie-based auth
  timeout: 10000,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // If using localStorage token instead of cookies:
    // const token = localStorage.getItem('admin-token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;

// API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface ApiError {
  status: 'error' | 'fail';
  message: string;
}

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.status === 'success') {
    return response.data.data as T;
  }

  if (response.data.status === 'error' || response.data.status === 'fail') {
    throw new Error(response.data.message || 'API request failed');
  }

  throw new Error('Unexpected API response format');
};
