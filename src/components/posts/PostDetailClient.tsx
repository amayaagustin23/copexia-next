'use client';

import CommentsSection from '@/components/comments/CommentsSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DefaultImage } from '@/components/ui/default-image';
import { usePostView } from '@/lib/hooks/usePostView';
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PostDetailClientProps {
  initialPost: Post;
}

export default function PostDetailClient({ initialPost }: PostDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('postDetail');
  const paths = useLocalizedPaths();

  const [post, setPost] = useState<Post>(initialPost);
  const [liking, setLiking] = useState(false);
  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  // Use custom hook to track views (once per session)
  const { viewCount: updatedViewCount } = usePostView(post.id, post.viewCount);

  // Update local state when view count changes from the hook
  useEffect(() => {
    if (updatedViewCount && updatedViewCount > post.viewCount) {
      setPost(prev => ({
        ...prev,
        viewCount: updatedViewCount
      }));
    }
  }, [updatedViewCount, post.viewCount]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (liking) return;

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
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update if needed, but useLikedPosts handles local state
      toggleLike(post.id);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentCountChange = (delta: number) => {
    setPost((prevPost) => ({
      ...prevPost,
      commentCount: prevPost.commentCount + delta,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 xs:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-muted transition-colors text-sm xs:text-base font-medium px-2 xs:px-4"
            >
              <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5 mr-2" />
              {t('back')}
            </Button>
          </div>

          <header className="mb-6 xs:mb-8 sm:mb-10">
            <div className="flex flex-wrap gap-2 mb-4 xs:mb-6">
              {post.categories.map((postCategory) => (
                <Badge
                  key={postCategory.id}
                  variant="secondary"
                  className="bg-primary/10 text-primary px-2 xs:px-3 py-1 text-xs xs:text-sm font-bold"
                >
                  <Tag className="h-3 w-3 xs:h-4 xs:w-4 mr-1.5" />
                  {postCategory.category.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 xs:mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 xs:gap-6 text-xs xs:text-sm sm:text-base text-muted-foreground mb-4">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 xs:h-5 xs:w-5" />
                  <span className="font-medium">{formatDate(post.publishedAt)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
                <span className="font-medium">
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
                priority
              />
            ) : (
              <DefaultImage
                size="md"
                translationKey="postDetail.noImage"
                className="rounded-lg"
              />
            )}
          </div>

          <Card className="mb-8 overflow-hidden shadow-sm border-border/60">
            <CardContent className="p-4 xs:p-6 sm:p-10">
              <div
                className="prose prose-sm xs:prose-base sm:prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex-col">
                <div className="flex justify-between gap-6 text-muted-foreground">
                  <button
                    className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>
                      {post.commentCount} {t('comments')}
                    </span>
                  </button>
                  <button
                    onClick={handleLike}
                    disabled={liking || likesLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked(post.id)
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                      } ${liking || likesLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                      }`}
                  >
                    <Heart
                      className={`h-4 w-4 transition-transform ${isLiked(post.id) ? 'fill-current' : ''
                        } ${liking ? 'animate-pulse' : ''}`}
                    />
                    <span className="font-medium">
                      {isLiked(post.id) ? t('liked') : t('like')}
                    </span>
                  </button>
                </div>

                <div className="flex justify-end py-4">
                  <Button variant="outline" asChild>
                    <Link href={paths.path('posts')}>
                      {t('viewMoreArticles')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="mt-8">
            <CommentsSection
              postId={post.id}
              onCommentCountChange={handleCommentCountChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
