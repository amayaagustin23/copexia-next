import PostDetailClient from '@/components/posts/PostDetailClient';
import StructuredData from '@/components/SEO/StructuredData';
import { postsService } from '@/services/postsService';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dev.copexia.amayadev.cloud';

  try {
    const post = await postsService.getPublicPostBySlug(slug);
    const currentUrl = `${baseUrl}/${locale}/posts/${slug}`;
    const tags = post.categories.map((cat) => cat.category.name);

    return {
      title: post.title,
      description: post.excerpt || post.title,
      keywords: tags,
      authors: [{ name: 'Copexia Team' }],
      openGraph: {
        type: 'article',
        url: currentUrl,
        title: post.title,
        description: post.excerpt || post.title,
        siteName: 'Copexia',
        locale: locale === 'es' ? 'es_ES' : 'en_US',
        images: [
          {
            url: post.featuredImage || `${baseUrl}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        section: post.categories[0]?.category.name,
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: [post.featuredImage || `${baseUrl}/og-image.jpg`],
      },
      alternates: {
        canonical: currentUrl,
        languages: {
          'es-ES': `${baseUrl}/es/posts/${slug}`,
          'en-US': `${baseUrl}/en/posts/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: t('title'),
      description: t('description'),
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params;

  try {
    const post = await postsService.getPublicPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const currentUrl = `https://copexia.com/${locale}/posts/${slug}`;
    const tags = post.categories.map((cat) => cat.category.name);

    return (
      <>
        <StructuredData
          type="article"
          data={{
            title: post.title,
            description: post.excerpt || post.title,
            image: post.featuredImage,
            url: currentUrl,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            category: post.categories[0]?.category.name,
            tags: tags,
            wordCount: post.content.length, // Approximate
          }}
          locale={locale}
        />
        <StructuredData
          type="breadcrumb"
          data={[
            { name: 'Inicio', url: `https://copexia.com/${locale}` },
            { name: 'Artículos', url: `https://copexia.com/${locale}/posts` },
            { name: post.title, url: currentUrl },
          ]}
          locale={locale}
        />
        <PostDetailClient initialPost={post} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
