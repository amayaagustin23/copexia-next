'use client';

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { runLogoutCallback } from './authManager';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000/api';

if (!process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL) {
  console.warn(
    "WARNING: La variable de entorno 'NEXT_PUBLIC_BACKEND_API_BASE_URL' no está definida. Usando URL por defecto: http://localhost:8000/api"
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      runLogoutCallback();
    }
    return Promise.reject(error);
  }
);

export default api;
