'use client';
  
import CommentsSection from '@/components/comments/CommentsSection';
import SEOHead from '@/components/SEO/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DefaultImage } from '@/components/ui/default-image';
import { LoadingSpinner } from '@/components/ui/loading';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Tag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const postCache = new Map<string, { post: Post; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const t = useTranslations('postDetail');
  const paths = useLocalizedPaths();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);

  const requestInProgress = useRef(false);

  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPost = async () => {
      if (requestInProgress.current) {
        return;
      }

      const cached = postCache.get(slug);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setPost(cached.post);
        setLoading(false);
        return;
      }

      try {
        requestInProgress.current = true;
        setLoading(true);
        setError(null);

        const response = await postsService.getPublicPostBySlug(slug);

        postCache.set(slug, { post: response, timestamp: Date.now() });

        setPost(response);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(t('notFound'));
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };

    if (slug && !requestInProgress.current) {
      fetchPost();
    }
  }, [slug, t]);

  useEffect(() => {
    const trackView = async () => {
      if (post && !viewTracked) {
        try {
          await postsService.incrementView(post.id);
          setViewTracked(true);

          // Update the post's view count locally
          setPost((prevPost) => {
            if (!prevPost) return null;
            const updatedPost = {
              ...prevPost,
              viewCount: prevPost.viewCount + 1,
            };

            // Update cache with new view count
            postCache.set(slug, { post: updatedPost, timestamp: Date.now() });

            return updatedPost;
          });
        } catch (err) {
          console.error('Error tracking view:', err);
        }
      }
    };

    trackView();
  }, [post, viewTracked]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!post || liking) return;

    const currentlyLiked = isLiked(post.id);

    try {
      setLiking(true);

      if (currentlyLiked) {
        await postsService.unlikePost(post.id);
        toggleLike(post.id);
      } else {
        await postsService.likePost(post.id);
        toggleLike(post.id);
      }

      postCache.delete(slug);
    } catch (err) {
      console.error('Error toggling like:', err);
      toggleLike(post.id);
    } finally {
      setLiking(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentCountChange = (delta: number) => {
    setPost((prevPost) => {
      if (!prevPost) return null;
      const updatedPost = {
        ...prevPost,
        commentCount: prevPost.commentCount + delta,
      };

      // Update cache with new comment count
      postCache.set(slug, { post: updatedPost, timestamp: Date.now() });

      return updatedPost;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t('notFound')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('notFoundDescription')}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        </div>
      </div>
    );
  }

  const postTags = post.categories.map((cat) => cat.category.name);

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt || post.title}
        keywords={postTags}
        image={post.featuredImage}
        url={paths.path(`posts/${post.slug}`)}
        type="article"
        author="Copexia Team"
        publishedTime={post.publishedAt || ''}
        modifiedTime={post.updatedAt}
        section={post.categories[0]?.category.name}
        tags={postTags}
        breadcrumbs={[
          { name: 'Inicio', url: paths.path('home') },
          { name: 'Artículos', url: paths.path('posts') },
          { name: post.title, url: paths.path(`posts/${post.slug}`) },
        ]}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>

            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((postCategory) => (
                  <Badge
                    key={postCategory.id}
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {postCategory.category.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    {post.viewCount} {t('views')}
                  </span>
                </div>
              </div>
            </header>

            <div className="mb-8">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              ) : (
                <DefaultImage
                  size="md"
                  translationKey="postDetail.noImage"
                  className="rounded-lg"
                />
              )}
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <button
                      onClick={handleToggleComments}
                      className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>
                        {post.commentCount} {t('comments')}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      disabled={liking || likesLoading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked(post.id)
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                      } ${
                        liking || likesLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 transition-transform ${
                          isLiked(post.id) ? 'fill-current' : ''
                        } ${liking ? 'animate-pulse' : ''}`}
                      />
                      <span className="font-medium">
                        {isLiked(post.id) ? t('liked') : t('like')}
                      </span>
                    </button>

                    <Button variant="outline" asChild>
                      <Link href={paths.path('posts')}>
                        {t('viewMoreArticles')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {showComments && (
              <div className="mt-8">
                <CommentsSection
                  postId={post.id}
                  onCommentCountChange={handleCommentCountChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
