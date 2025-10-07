import type {
  CommentListResponse,
  CommentResponse,
  CommentStats,
  CreateCommentData,
  UpdateCommentData
} from '@/schemas/posts';
import { BaseService } from './baseService';


export class CommentsService extends BaseService {
  // ==================== PUBLIC METHODS ====================

  async create(commentData: CreateCommentData): Promise<CommentResponse> {
    return this.post(
      this.routes.PUBLIC.COMMENTS.CREATE.replace(':postId', commentData.postId),
      commentData
    );
  }

  async getByPost(
    postId: string
  ): Promise<Comment[] | CommentListResponse | { data: Comment[] }> {
    const url = this.routes.PUBLIC.COMMENTS.LIST.replace(':postId', postId);

    const response = await this.get(url);

    return response;
  }

  // ==================== ADMIN METHODS ====================

  async listAdmin(
    params: {
      page?: number;
      size?: number;
      search?: string;
      orderBy?: 'createdAt' | 'updatedAt';
      order?: 'asc' | 'desc';
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<CommentListResponse> {
    const {
      page = 1,
      size = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate,
    } = params;

    return this.adminRequest(
      'GET',
      this.routes.ADMIN.COMMENTS.LIST,
      undefined,
      {
        page,
        size,
        search,
        orderBy,
        order,
        startDate,
        endDate,
      }
    );
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
  async update(
    id: string,
    commentData: UpdateCommentData
  ): Promise<CommentResponse> {
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
