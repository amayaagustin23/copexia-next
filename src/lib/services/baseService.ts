import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/apiRoutes';

/**
 * Base service class for common HTTP operations
 */
export class BaseService {
  protected api = api;
  protected routes = API_ROUTES;

  /**
   * Generic GET request
   */
  protected async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  /**
   * Generic POST request
   */
  protected async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  protected async deleteRequest<T>(url: string, config?: any): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  /**
   * Admin request with credentials
   */
  protected async adminRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
    const config = {
      withCredentials: true,
      ...(params && { params }),
    };

    switch (method) {
      case 'GET':
        return this.get<T>(url, params);
      case 'POST':
        return this.post<T>(url, data, config);
      case 'PUT':
        return this.put<T>(url, data, config);
      case 'DELETE':
        return this.deleteRequest<T>(url, config);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
