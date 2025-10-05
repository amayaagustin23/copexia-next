import { classifyError } from '@/lib/utils/errorHandler';
import type { ErrorInfo } from '@/schemas/error';
import { useCallback, useState } from 'react';

interface UseErrorHandlerOptions {
  onError?: (error: ErrorInfo) => void;
  logError?: boolean;
}

interface UseErrorHandlerReturn {
  error: ErrorInfo | null;
  isLoading: boolean;
  setError: (error: ErrorInfo | null) => void;
  setLoading: (loading: boolean) => void;
  handleError: (error: unknown) => void;
  clearError: () => void;
  executeWithErrorHandling: <T>(
    operation: () => Promise<T>,
    options?: { onSuccess?: (result: T) => void; onError?: (error: ErrorInfo) => void }
  ) => Promise<T | null>;
}

/**
 * Hook para manejo consistente de errores en componentes
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { onError, logError = true } = options;

  const handleError = useCallback((error: unknown) => {
    const classifiedError = classifyError(error);
    
    if (logError) {
      console.error('Error clasificado:', classifiedError);
    }
    
    setError(classifiedError);
    onError?.(classifiedError);
  }, [onError, logError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const executeWithErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options?: { onSuccess?: (result: T) => void; onError?: (error: ErrorInfo) => void }
    ): Promise<T | null> => {
      try {
        setIsLoading(true);
        clearError();
        
        const result = await operation();
        
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const classifiedError = classifyError(error);
        handleError(classifiedError);
        options?.onError?.(classifiedError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, clearError]
  );

  return {
    error,
    isLoading,
    setError,
    setLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  };
}

/**
 * Hook específico para formularios
 */
export function useFormErrorHandler() {
  const { error, setError, clearError, handleError } = useErrorHandler();

  const setFieldError = useCallback((field: string, message: string) => {
    setError({
      type: 'validation',
      message,
      field,
    });
  }, [setError]);

  const setApiError = useCallback((message: string, errors?: Record<string, string[]>) => {
    setError({
      type: 'api',
      message,
      errors,
    });
  }, [setError]);

  const hasFieldError = useCallback((field: string) => {
    return error?.type === 'validation' && error.field === field;
  }, [error]);

  const getFieldError = useCallback((field: string) => {
    if (error?.type === 'validation' && error.field === field) {
      return error.message;
    }
    return null;
  }, [error]);

  return {
    error,
    setError,
    clearError,
    handleError,
    setFieldError,
    setApiError,
    hasFieldError,
    getFieldError,
  };
}

/**
 * Hook para operaciones asíncronas con manejo de errores
 */
export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await operation();
      setData(result);
      return result;
    } catch (error) {
      const classifiedError = classifyError(error);
      setError(classifiedError);
      console.error('Error en operación asíncrona:', classifiedError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
    setData,
    setError,
    setIsLoading,
  };
}
