'use client';

import type { ErrorInfo } from '@/schemas/error';
import { AlertTriangle, Network, Shield, X } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false,
}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'server':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'network':
        return <Network className="h-5 w-5 text-orange-500" />;
      case 'validation':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'authentication':
      case 'authorization':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'server':
        return 'Error del Servidor';
      case 'network':
        return 'Error de Conexión';
      case 'validation':
        return 'Error de Validación';
      case 'authentication':
        return 'Error de Autenticación';
      case 'authorization':
        return 'Error de Autorización';
      default:
        return 'Error';
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'server':
      case 'authentication':
      case 'authorization':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'network':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'validation':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <Card className={`border ${getErrorColor()} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {getErrorIcon()}
            {getErrorTitle()}
          </CardTitle>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm">{error.message}</p>

          {/* Mostrar errores de campo para errores de validación */}
          {error.type === 'validation' && 'field' in error && error.field && (
            <div className="text-xs opacity-75">
              Campo: <span className="font-medium">{String(error.field)}</span>
            </div>
          )}

          {/* Mostrar errores de servidor específicos */}
          {error.type === 'server' && error.details && (
            <div className="space-y-1">
              <div className="text-xs">
                <span className="font-medium">Detalles:</span>
                <div className="ml-2">{JSON.stringify(error.details)}</div>
              </div>
            </div>
          )}

          {/* Mostrar detalles técnicos si están habilitados */}
          {showDetails && (
            <div className="text-xs opacity-60 space-y-1">
              {(error.type === 'server' || error.type === 'network') && 'statusCode' in error && error.statusCode && (
                <div>Código de estado: {String(error.statusCode)}</div>
              )}
              {error.code && <div>Código: {error.code}</div>}
              {error.type === 'unknown' && error.details && (
                <div>
                  Error original: {JSON.stringify(error.details, null, 2)}
                </div>
              )}
            </div>
          )}

          {/* Botón de reintento */}
          {onRetry && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs"
              >
                Reintentar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente simplificado para mostrar errores inline
 */
interface InlineErrorProps {
  error: ErrorInfo | null;
  className?: string;
}

export function InlineError({ error, className = '' }: InlineErrorProps) {
  if (!error) return null;

  const getErrorColor = () => {
    switch (error.type) {
      case 'server':
      case 'authentication':
      case 'authorization':
        return 'text-red-600';
      case 'network':
        return 'text-orange-600';
      case 'validation':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`text-sm ${getErrorColor()} ${className}`}>
      {error.message}
    </div>
  );
}

/**
 * Componente para mostrar errores de campo específicos
 */
interface FieldErrorProps {
  error: ErrorInfo | null;
  field: string;
  className?: string;
}

export function FieldError({ error, field, className = '' }: FieldErrorProps) {
  if (!error || error.type !== 'validation' || !('field' in error) || error.field !== field) {
    return null;
  }

  return (
    <div className={`text-xs text-red-600 mt-1 ${className}`}>
      {error.message}
    </div>
  );
}
