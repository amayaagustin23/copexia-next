/**
 * Error schemas and types for the application
 */

export interface ErrorInfo {
  type: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown';
  message: string;
  details?: string;
  code?: string | number;
  timestamp: string;
  stack?: string;
}

export interface NetworkErrorInfo extends ErrorInfo {
  type: 'network';
  status?: number;
  url?: string;
}

export interface ValidationErrorInfo extends ErrorInfo {
  type: 'validation';
  field?: string;
  value?: unknown;
}

export interface AuthenticationErrorInfo extends ErrorInfo {
  type: 'authentication';
  action?: string;
}

export interface AuthorizationErrorInfo extends ErrorInfo {
  type: 'authorization';
  resource?: string;
  permission?: string;
}

export interface ServerErrorInfo extends ErrorInfo {
  type: 'server';
  status: number;
  endpoint?: string;
}

export type AppErrorInfo = 
  | NetworkErrorInfo 
  | ValidationErrorInfo 
  | AuthenticationErrorInfo 
  | AuthorizationErrorInfo 
  | ServerErrorInfo 
  | ErrorInfo;
