/**
 * Utility functions for error handling
 */

/**
 * Gets a user-friendly error message from an unknown error
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  return 'Ha ocurrido un error inesperado';
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('NetworkError');
  }
  return false;
}

/**
 * Checks if an error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('timeout') || 
           error.message.includes('Timeout');
  }
  return false;
}
