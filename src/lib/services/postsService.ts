import type { GetPostsParams, GetPostsResponse } from '@/types/posts';
import { BaseService } from './baseService';

/**
 * Posts service for managing blog posts
 * Handles both admin and public operations
 */
export class PostsService extends BaseService {
  // ==================== ADMIN METHODS ====================

  /**
   * Get paginated list of posts (admin)
   */
  async list(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    return this.adminRequest('GET', this.routes.ADMIN.POSTS.LIST, undefined, {
      page: params.page ?? 1,
      size: params.size ?? 10,
      q: params.q,
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
    });
  }

  /**
   * Create a new post (admin)
   */
  async create(postData: any): Promise<any> {
    return this.adminRequest('POST', this.routes.ADMIN.POSTS.CREATE, postData);
  }

  /**
   * Update an existing post (admin)
   */
  async update(id: string, postData: any): Promise<any> {
    return this.adminRequest('PUT', this.routes.ADMIN.POSTS.UPDATE(id), postData);
  }

  /**
   * Delete a post (admin)
   */
  async deletePost(id: string): Promise<any> {
    return this.adminRequest('DELETE', this.routes.ADMIN.POSTS.DELETE(id));
  }

  /**
   * Get post by ID (admin)
   */
  async getById(id: string): Promise<any> {
    return this.adminRequest('GET', this.routes.ADMIN.POSTS.GET_BY_ID(id));
  }

  /**
   * Get dashboard data (admin)
   */
  async getDashboard(): Promise<any> {
    return this.adminRequest('GET', this.routes.ADMIN.POSTS.DASHBOARD);
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Get paginated list of public posts
   */
  async getPublicPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    return this.get<GetPostsResponse>(this.routes.PUBLIC.POSTS.LIST, {
      page: params.page ?? 1,
      size: params.size ?? 10,
      q: params.q,
      status: params.status,
    });
  }

  /**
   * Get public post by ID
   */
  async getPublicPostById(id: string): Promise<any> {
    return this.get(this.routes.PUBLIC.POSTS.GET_BY_ID(id));
  }

  /**
   * Get public post by slug
   */
  async getPublicPostBySlug(slug: string): Promise<any> {
    return this.get(this.routes.PUBLIC.POSTS.GET_BY_SLUG(slug));
  }

  /**
   * Like a post
   */
  async likePost(id: string): Promise<any> {
    return this.post(this.routes.PUBLIC.POSTS.LIKE(id));
  }

  /**
   * Unlike a post
   */
  async unlikePost(id: string): Promise<any> {
    return this.deleteRequest(this.routes.PUBLIC.POSTS.UNLIKE(id));
  }

  /**
   * Get comments for a post
   */
  async getComments(postId: string): Promise<any> {
    return this.get(this.routes.PUBLIC.POSTS.COMMENTS(postId));
  }

  /**
   * Create a comment on a post
   */
  async createComment(postId: string, commentData: any): Promise<any> {
    return this.post(this.routes.PUBLIC.POSTS.CREATE_COMMENT(postId), commentData);
  }

  // ==================== LEGACY METHODS (for backward compatibility) ====================

  /**
   * @deprecated Use create() instead
   */
  async createPost(postData: any): Promise<any> {
    return this.create(postData);
  }

  /**
   * @deprecated Use update() instead
   */
  async updatePost(id: string, postData: any): Promise<any> {
    return this.update(id, postData);
  }

  /**
   * @deprecated Use deletePost() instead
   */
  async delete(id: string): Promise<any> {
    return this.deletePost(id);
  }
}

// Export singleton instance
export const postsService = new PostsService();
