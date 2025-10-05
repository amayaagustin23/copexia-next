import { getPosts } from '@/lib/services/postsService';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://copexia.com';
  const currentDate = new Date();

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/es`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/es/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/posts`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  try {
    // Dynamic pages - Posts
    const posts = await getPosts({ limit: 1000, page: 1 });
    const postPages = posts.data?.map((post) => ({
      url: `${baseUrl}/es/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    // English versions of posts
    const englishPostPages = posts.data?.map((post) => ({
      url: `${baseUrl}/en/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    return [...staticPages, ...postPages, ...englishPostPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static pages if there's an error
    return staticPages;
  }
}
