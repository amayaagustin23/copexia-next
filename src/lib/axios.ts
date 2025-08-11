// src/lib/axios.ts
"use client";

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "ERROR: La variable de entorno 'NEXT_PUBLIC_BACKEND_API_BASE_URL' no está definida."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
