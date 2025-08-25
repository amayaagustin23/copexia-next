"use client";

import api from "@/lib/axios";

export type PostStatus = "DRAFT" | "PUBLISHED";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  category: Category | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type GetPostsParams = {
  q?: string;
  status?: PostStatus | "ALL";
  page?: number; // 1-based
  perPage?: number; // default 10
};

export type GetPostsResponse = {
  items: PostListItem[];
  total: number;
  page: number;
  perPage: number;
};

export const postsService = {
  async list(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    // Ajusta el endpoint a tu backend (ej: /admin/posts)
    const res = await api.get<GetPostsResponse>("/posts", {
      params: {
        q: params.q || undefined,
        status:
          params.status && params.status !== "ALL" ? params.status : undefined,
        page: params.page ?? 1,
        perPage: params.perPage ?? 10,
      },
      withCredentials: true,
    });
    return res.data;
  },
};
