export type PostStatus = "DRAFT" | "PUBLISHED";

export type Comment = {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  parentId?: string | null;
  postId: string;
  replies: Comment[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
};

export type PostCategory = {
  id: string;
  postId: string;
  categoryId: string;
  category: Category;
};

export type Author = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: PostStatus;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string | null;
  authorId: string;
  author: Author;
  categories: PostCategory[];
  comments: Comment[];
};

export type GetPostsParams = {
  q?: string;
  status?: PostStatus | "ALL";
  page?: number; // 1-based
  size?: number; // default 10
};

export type GetPostsResponse = {
  data: Post[];
  total: number;
  page: number;
  size: number;
};

export type GetCategoriesResponse = {
  data: Category[];
  total: number;
  page: number;
  size: number;
};
