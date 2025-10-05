import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/apiRoutes';

// Request deduplication map
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Base service class for common HTTP operations
 */
export class BaseService {
  protected api = api;
  protected routes = API_ROUTES;

  /**
   * Create a unique key for request deduplication
   */
  private createRequestKey(
    method: string,
    url: string,
    params?: Record<string, unknown>
  ): string {
    const sortedParams = params
      ? Object.keys(params)
          .sort()
          .map((key) => `${key}=${params[key]}`)
          .join('&')
      : '';
    return `${method}:${url}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  /**
   * Generic GET request with deduplication
   */
  protected async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const requestKey = this.createRequestKey('GET', url, params);

    // Check if there's already a pending request for this key
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey)! as Promise<T>;
    }

    // Create new request and store it
    const requestPromise = this.api
      .get<T>(url, { params })
      .then((response) => {
        // Remove from pending requests when completed
        pendingRequests.delete(requestKey);
        return response.data;
      })
      .catch((error) => {
        // Remove from pending requests on error
        pendingRequests.delete(requestKey);
        throw error;
      });

    pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  /**
   * Generic POST request
   */
  protected async post<T>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  protected async deleteRequest<T>(url: string, config?: unknown): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  /**
   * Admin request with credentials and deduplication for GET requests
   */
  protected async adminRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: unknown,
    params?: Record<string, unknown>
  ): Promise<T> {
    const config = {
      withCredentials: true,
      ...(params && { params }),
    };

    switch (method) {
      case 'GET':
        // Use deduplicated GET request
        return this.get<T>(url, params);
      case 'POST':
        return this.post<T>(url, data, config);
      case 'PUT':
        return this.put<T>(url, data, config);
      case 'PATCH':
        return this.patch<T>(url, data, config);
      case 'DELETE':
        return this.deleteRequest<T>(url, config);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
