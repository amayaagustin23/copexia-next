'use client';

import { classifyError } from '@/lib/utils/errorHandler';
import { getUserFriendlyMessage } from '@/lib/utils/errorUtils';
import type { ErrorInfo as AppErrorInfo } from '@/schemas/error';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ErrorDisplay } from './error-display';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    
    // Notificar al callback si existe
    this.props.onError?.(error, errorInfo);
    
    // Actualizar el estado con la información del error
    this.setState({
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const appError = classifyError(this.state.error);
      
      // Usar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback(appError, this.handleRetry);
      }

      // Fallback por defecto
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Error de Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ErrorDisplay
                error={appError}
                onRetry={this.handleRetry}
                showDetails={process.env.NODE_ENV === 'development'}
              />
              
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">
                    Detalles técnicos (desarrollo)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Recargar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar el ErrorBoundary de forma declarativa
 */
export function useErrorBoundary() {
  const throwError = (error: Error) => {
    throw error;
  };

  const throwErrorFromUnknown = (error: unknown) => {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(getUserFriendlyMessage(error));
  };

  return {
    throwError,
    throwErrorFromUnknown,
  };
}

/**
 * Componente wrapper para manejo de errores en operaciones asíncronas
 */
interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppErrorInfo, retry: () => void) => ReactNode;
}

export function AsyncErrorBoundary({ children, fallback }: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        // Log específico para errores asíncronos
        console.error('Error asíncrono capturado:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * HOC para envolver componentes con ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
