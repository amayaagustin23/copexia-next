'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DefaultImage } from '@/components/ui/default-image';
import { Loading, LoadingImage, LoadingText } from '@/components/ui/loading';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';
import { Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PostsSection() {
  const t = useTranslations('posts');
  const paths = useLocalizedPaths();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPublicPosts({ size: 3 });
        setPosts(response.data);
      } catch (err) {
        setError(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLike = async (postId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (likingPosts.has(postId)) return;

    const currentlyLiked = isLiked(postId);

    try {
      setLikingPosts((prev) => new Set(prev).add(postId));

      if (currentlyLiked) {
        await postsService.unlikePost(postId);
        toggleLike(postId);
      } else {
        await postsService.likePost(postId);
        toggleLike(postId);
      }
    } catch (err) {
      toggleLike(postId);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-4 py-12 xs:py-16">
        <div className="text-center mb-8 xs:mb-12">
          <Loading className="h-8 xs:h-12 w-48 xs:w-96 mx-auto mb-3 xs:mb-4" />
          <Loading className="h-4 xs:h-6 w-32 xs:w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <LoadingImage className="h-32 xs:h-40 lg:h-48 w-full" />
              <CardHeader className="p-3 xs:p-6">
                <Loading className="h-4 xs:h-6 w-3/4" />
                <LoadingText lines={2} className="space-y-1 xs:space-y-2" />
              </CardHeader>
              <CardContent className="p-3 xs:p-6 pt-0">
                <Loading className="h-3 xs:h-4 w-1/4 mb-1 xs:mb-2" />
                <div className="flex gap-2 xs:gap-4">
                  <Loading className="h-3 xs:h-4 w-12 xs:w-16" />
                  <Loading className="h-3 xs:h-4 w-12 xs:w-16" />
                  <Loading className="h-3 xs:h-4 w-12 xs:w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-4 py-12 xs:py-16">
        <div className="text-center">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 xs:mb-4">
            {t('title')}
          </h2>
          <p className="text-xs xs:text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-2 xs:px-4 py-12 xs:py-16">
        <div className="text-center">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 xs:mb-4">
            {t('title')}
          </h2>
          <p className="text-xs xs:text-sm text-muted-foreground">
            {t('noPosts')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 xs:px-4 py-10 xs:py-12 sm:py-16">
      <div className="text-center mb-6 xs:mb-8 sm:mb-12">
        <h2
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 xs:mb-3 sm:mb-4 leading-tight"
          data-animate
        >
          {t('title')}
        </h2>
        <p
          className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
          data-animate
        >
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
        {posts.map((post, index) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            data-animate
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link href={paths.path(`posts/${post.slug}`)}>
              <div className="relative overflow-hidden h-28 xs:h-32 sm:h-40 lg:h-48">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <DefaultImage
                    size="sm"
                    translationKey="posts.noImage"
                    className="h-full"
                  />
                )}
                <div className="absolute top-2 xs:top-4 left-2 xs:left-4 flex flex-wrap gap-1 xs:gap-2">
                  {post.categories.slice(0, 2).map((postCategory) => (
                    <Badge
                      key={postCategory.id}
                      variant="secondary"
                      className="bg-white/90 text-black text-[10px] xs:text-xs px-1 xs:px-2 py-0.5"
                    >
                      {postCategory.category.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardHeader className="p-2 xs:p-3 sm:p-6">
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors py-1 xs:py-2 sm:py-4 text-xs xs:text-sm sm:text-base leading-tight">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 xs:line-clamp-3 text-[10px] xs:text-xs sm:text-sm leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-2 xs:p-3 sm:p-6 pt-0">
                <div className="flex items-center justify-between text-xs xs:text-sm text-muted-foreground mb-2 xs:mb-4 py-2 xs:py-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 xs:h-4 xs:w-4" />
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 xs:gap-4 text-xs xs:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 xs:h-4 xs:w-4" />
                      {post.viewCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 xs:h-4 xs:w-4" />
                      {post.commentCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 xs:gap-2">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      disabled={likingPosts.has(post.id) || likesLoading}
                      className={`flex items-center gap-1 transition-colors touch-manipulation ${
                        isLiked(post.id)
                          ? 'text-red-500'
                          : 'text-muted-foreground hover:text-red-500'
                      } ${
                        likingPosts.has(post.id) || likesLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <Heart
                        className={`h-3 w-3 xs:h-4 xs:w-4 transition-transform ${
                          isLiked(post.id) ? 'fill-current' : ''
                        } ${likingPosts.has(post.id) ? 'animate-pulse' : ''}`}
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary/10 text-xs xs:text-sm h-6 xs:h-8 px-2 xs:px-3"
                    >
                      {t('readMore')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 xs:mt-12" data-animate>
        <Button variant="outline" size="sm" className="xs:size-lg" asChild>
          <Link href={paths.path('posts')} className="text-xs xs:text-sm">
            {t('viewAllPosts')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
