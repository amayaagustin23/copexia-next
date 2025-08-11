import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: {
    [key: string]: string[];
  };
  code?: string;
  type?: string;
}

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiErrorResponse).message === "string"
  );
}

export function isAxiosErrorType<T>(error: unknown): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
