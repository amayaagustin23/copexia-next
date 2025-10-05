import { BaseService } from './baseService';

/**
 * Categories service for managing blog categories
 * Handles both admin and public operations
 */
export class CategoriesService extends BaseService {
  // ==================== ADMIN METHODS ====================

  /**
   * Get paginated categories (admin) - matches backend: GET /admin/categories
   */
  async list(params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<any> {
    return this.adminRequest(
      'GET',
      this.routes.ADMIN.CATEGORIES.LIST,
      undefined,
      {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        search: params?.search,
      }
    );
  }

  /**
   * Create a new category (admin) - matches backend: POST /admin/categories
   */
  async create(categoryData: any): Promise<any> {
    return this.adminRequest(
      'POST',
      this.routes.ADMIN.CATEGORIES.CREATE,
      categoryData
    );
  }

  /**
   * Update an existing category (admin) - matches backend: PATCH /admin/categories/:id
   */
  async update(id: string, categoryData: any): Promise<any> {
    return this.adminRequest(
      'PATCH',
      this.routes.ADMIN.CATEGORIES.UPDATE(id),
      categoryData
    );
  }

  /**
   * Delete a category (admin) - matches backend: DELETE /admin/categories/:id
   */
  async delete(id: string): Promise<any> {
    return this.adminRequest('DELETE', this.routes.ADMIN.CATEGORIES.DELETE(id));
  }

  /**
   * Get category by ID (admin) - matches backend: GET /admin/categories/:id
   */
  async getById(id: string): Promise<any> {
    return this.adminRequest('GET', this.routes.ADMIN.CATEGORIES.GET_BY_ID(id));
  }

  /**
   * Get category by slug (admin) - matches backend: GET /admin/categories/slug/:slug
   */
  async getBySlug(slug: string): Promise<any> {
    return this.adminRequest('GET', `/admin/categories/slug/${slug}`);
  }

  /**
   * Get category statistics (admin) - matches backend: GET /admin/categories/stats
   */
  async getStats(): Promise<any> {
    return this.adminRequest('GET', `/admin/categories/stats`);
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Get paginated list of public categories
   */
  async getPublicCategories(params?: {
    page?: number;
    size?: number;
  }): Promise<any> {
    return this.get(this.routes.PUBLIC.CATEGORIES.LIST, {
      page: params?.page ?? 1,
      size: params?.size ?? 10,
    });
  }

  /**
   * Get public category by ID
   */
  async getPublicCategoryById(id: string): Promise<any> {
    return this.get(this.routes.PUBLIC.CATEGORIES.GET_BY_ID(id));
  }

  /**
   * Get public category by slug
   */
  async getPublicCategoryBySlug(slug: string): Promise<any> {
    return this.get(this.routes.PUBLIC.CATEGORIES.GET_BY_SLUG(slug));
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();
