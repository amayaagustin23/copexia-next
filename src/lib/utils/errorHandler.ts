import { isApiErrorResponse } from '@/schemas/api';
import { AxiosError } from 'axios';

export type ErrorType = 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown';

export interface ClassifiedError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: any;
  timestamp: string;
}

export function classifyError(error: unknown): ClassifiedError {
  const timestamp = new Date().toISOString();
  // Network errors
  if (error instanceof AxiosError) {
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        timestamp,
      };
    }

    const statusCode = error.response.status;
    const responseData = error.response.data;

    // API error response
    if (isApiErrorResponse(responseData)) {
      return {
        type: statusCode >= 400 && statusCode < 500 ? 'validation' : 'server',
        message: responseData.message || 'Error del servidor',
        statusCode,
        details: responseData,
        timestamp,
      };
    }

    // HTTP status based classification
    if (statusCode === 401) {
      return {
        type: 'authentication',
        message: 'No autorizado. Inicia sesión nuevamente.',
        statusCode,
        timestamp,
      };
    }

    if (statusCode === 403) {
      return {
        type: 'authorization',
        message: 'Acceso denegado. No tienes permisos para esta acción.',
        statusCode,
        timestamp,
      };
    }

    if (statusCode >= 400 && statusCode < 500) {
      return {
        type: 'validation',
        message: responseData?.message || 'Error de validación',
        statusCode,
        details: responseData,
        timestamp,
      };
    }

    if (statusCode >= 500) {
      return {
        type: 'server',
        message: 'Error interno del servidor. Inténtalo más tarde.',
        statusCode,
        timestamp,
      };
    }
  }

  // Generic error
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || 'Ha ocurrido un error inesperado',
      timestamp,
    };
  }

  // Fallback
  return {
    type: 'unknown',
    message: 'Ha ocurrido un error inesperado',
    timestamp,
  };
}
