import { AxiosError } from "axios";

export { isApiErrorResponse } from '@/schemas/api';
export type { ApiErrorResponse, ApiResponse } from '@/schemas/api';

export function isAxiosErrorType<T>(error: unknown): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
