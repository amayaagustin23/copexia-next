'use client';

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
  'http://localhost:4005/api/v1';

if (!process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL) {
  console.warn(
    "WARNING: La variable de entorno 'NEXT_PUBLIC_BACKEND_API_BASE_URL' no está definida. Usando URL por defecto: http://localhost:4005/api/v1"
  );
}

console.log('[Axios] API Base URL:', API_BASE_URL);

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
    // Removido el logout automático en 401/403
    // Solo el logout manual redirige al login
    return Promise.reject(error);
  }
);

export default api;
