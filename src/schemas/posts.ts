import { z } from 'zod';

// ==================== ENUMS ====================

export const PostStatusSchema = z.enum(['PUBLISHED', 'DRAFT']);
export type PostStatus = z.infer<typeof PostStatusSchema>;

export const CommentStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'DELETED']);
export type CommentStatus = z.infer<typeof CommentStatusSchema>;

// ==================== BASE TYPES ====================

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  color: z.string(),
  icon: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PostCategorySchema = z.object({
  id: z.string(),
  category: CategorySchema,
});

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorName: z.string(),
  authorEmail: z.string().email().optional(),
  authorWebsite: z.string().url().optional(),
  status: CommentStatusSchema,
  parentId: z.string().optional(),
  postId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  replies: z.array(z.lazy(() => CommentSchema)).optional(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional(),
  content: z.string(),
  status: PostStatusSchema,
  isPinned: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  viewCount: z.number().default(0),
  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: AuthorSchema,
  categories: z.array(PostCategorySchema).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ==================== REQUEST/RESPONSE TYPES ====================

export const CreatePostDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  categoryId: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const UpdatePostDataSchema = CreatePostDataSchema.partial();

export const GetPostsParamsSchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).max(100).default(10),
  q: z.string().optional(),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ALL']).optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  orderBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'viewCount', 'likeCount']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const GetPostsResponseSchema = z.object({
  data: z.array(PostSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// ==================== COMMENT TYPES ====================

export const CreateCommentDataSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorEmail: z.string().email().optional(),
  authorWebsite: z.string().url().optional(),
  postId: z.string().min(1, 'Post ID is required'),
  parentId: z.string().optional(),
});

export const UpdateCommentDataSchema = z.object({
  content: z.string().optional(),
  authorName: z.string().optional(),
  authorEmail: z.string().email().optional(),
  authorWebsite: z.string().url().optional(),
  status: CommentStatusSchema.optional(),
});

export const CommentResponseSchema = CommentSchema;
export const CommentListResponseSchema = z.object({
  data: z.array(CommentResponseSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  stats: z.object({
    total: z.number(),
    approved: z.number(),
    pending: z.number(),
    rejected: z.number(),
    deleted: z.number(),
  }).optional(),
});

export const CommentStatsSchema = z.object({
  total: z.number(),
  approved: z.number(),
  pending: z.number(),
  rejected: z.number(),
  deleted: z.number(),
});

// ==================== CATEGORY TYPES ====================

export const CreateCategoryDataSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
  description: z.string().optional(),
  color: z.string().min(1, 'Category color is required'),
  icon: z.string().min(1, 'Category icon is required'),
});

export const UpdateCategoryDataSchema = CreateCategoryDataSchema.partial();

export const GetCategoriesResponseSchema = z.array(CategorySchema);
export const PaginatedCategoriesResponseSchema = z.object({
  data: z.array(CategorySchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
});

// ==================== TYPE EXPORTS ====================

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type PostCategory = z.infer<typeof PostCategorySchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type Post = z.infer<typeof PostSchema>;

export type CreatePostData = z.infer<typeof CreatePostDataSchema>;
export type UpdatePostData = z.infer<typeof UpdatePostDataSchema>;
export type GetPostsParams = z.infer<typeof GetPostsParamsSchema>;
export type GetPostsResponse = z.infer<typeof GetPostsResponseSchema>;

export type CreateCommentData = z.infer<typeof CreateCommentDataSchema>;
export type UpdateCommentData = z.infer<typeof UpdateCommentDataSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type CommentListResponse = z.infer<typeof CommentListResponseSchema>;
export type CommentStats = z.infer<typeof CommentStatsSchema>;

export type CreateCategoryData = z.infer<typeof CreateCategoryDataSchema>;
export type UpdateCategoryData = z.infer<typeof UpdateCategoryDataSchema>;
export type GetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
export type PaginatedCategoriesResponse = z.infer<typeof PaginatedCategoriesResponseSchema>;
