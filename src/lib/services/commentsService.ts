import type {
  CommentListResponse,
  CommentResponse,
  CommentStats,
  CreateCommentData,
  UpdateCommentData
} from '@/schemas/posts';
import { BaseService } from './baseService';

/**
 * Comments service for managing comments
 * Handles both admin and public operations
 */
export class CommentsService extends BaseService {
  // ==================== PUBLIC METHODS ====================

  /**
   * Create a new comment (public)
   */
  async create(commentData: CreateCommentData): Promise<CommentResponse> {
    return this.post(this.routes.PUBLIC.COMMENTS.CREATE, commentData);
  }

  /**
   * Get comments for a specific post (public)
   */
  async getByPost(
    postId: string,
    params: {
      page?: number;
      size?: number;
    } = {}
  ): Promise<CommentListResponse> {
    const { page = 1, size = 10 } = params;
    return this.get(
      this.routes.PUBLIC.COMMENTS.LIST.replace(':postId', postId),
      { page, size }
    );
  }

  // ==================== ADMIN METHODS ====================

  /**
   * Get all comments (admin) with filters
   */
  async listAdmin(params: {
    page?: number;
    size?: number;
    search?: string;
    orderBy?: 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
  } = {}): Promise<CommentListResponse> {
    const {
      page = 1,
      size = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate,
    } = params;

    return this.adminRequest('GET', this.routes.ADMIN.COMMENTS.LIST, undefined, {
      page,
      size,
      search,
      orderBy,
      order,
      startDate,
      endDate,
    });
  }

  /**
   * Get comment by ID (admin)
   */
  async getById(id: string): Promise<CommentResponse> {
    return this.adminRequest('GET', this.routes.ADMIN.COMMENTS.GET_BY_ID(id));
  }

  /**
   * Update comment (admin)
   */
  async update(id: string, commentData: UpdateCommentData): Promise<CommentResponse> {
    return this.adminRequest(
      'PATCH',
      this.routes.ADMIN.COMMENTS.UPDATE(id),
      commentData
    );
  }

  /**
   * Update comment status (admin)
   */
  async updateStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED'
  ): Promise<CommentResponse> {
    return this.adminRequest(
      'PATCH',
      this.routes.ADMIN.COMMENTS.UPDATE_STATUS(id),
      { status }
    );
  }

  /**
   * Delete comment (admin)
   */
  async delete(id: string): Promise<void> {
    return this.adminRequest('DELETE', this.routes.ADMIN.COMMENTS.DELETE(id));
  }

  /**
   * Get comment statistics (admin)
   */
  async getStats(): Promise<CommentStats> {
    return this.adminRequest('GET', this.routes.ADMIN.COMMENTS.STATS);
  }
}

// Export singleton instance
export const commentsService = new CommentsService();
