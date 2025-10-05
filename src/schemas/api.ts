import { z } from 'zod';

// Schema for API error responses
export const ApiErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number().optional(),
  details: z.any().optional(),
});

// Schema for generic API responses
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.any().optional(),
});

// Type exports
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
};

// Type guard function
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return ApiErrorResponseSchema.safeParse(value).success;
}
