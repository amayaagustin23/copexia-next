import { BaseService } from './baseService';

/**
 * Categories service for managing blog categories
 * Handles both admin and public operations
 */
export class CategoriesService extends BaseService {
  // ==================== ADMIN METHODS ====================

  /**
   * Get paginated list of categories (admin)
   */
  async list(params?: { page?: number; size?: number; q?: string }): Promise<any> {
    return this.adminRequest('GET', this.routes.ADMIN.CATEGORIES.LIST, undefined, {
      page: params?.page ?? 1,
      size: params?.size ?? 10,
      q: params?.q,
    });
  }

  /**
   * Create a new category (admin)
   */
  async create(categoryData: any): Promise<any> {
    return this.adminRequest('POST', this.routes.ADMIN.CATEGORIES.CREATE, categoryData);
  }

  /**
   * Update an existing category (admin)
   */
  async update(id: string, categoryData: any): Promise<any> {
    return this.adminRequest('PUT', this.routes.ADMIN.CATEGORIES.UPDATE(id), categoryData);
  }

  /**
   * Delete a category (admin)
   */
  async delete(id: string): Promise<any> {
    return this.adminRequest('DELETE', this.routes.ADMIN.CATEGORIES.DELETE(id));
  }

  /**
   * Get category by ID (admin)
   */
  async getById(id: string): Promise<any> {
    return this.adminRequest('GET', this.routes.ADMIN.CATEGORIES.GET_BY_ID(id));
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Get paginated list of public categories
   */
  async getPublicCategories(params?: { page?: number; size?: number }): Promise<any> {
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
