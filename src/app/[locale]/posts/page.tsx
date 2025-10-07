'use client';

import SEOHead from '@/components/SEO/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loading, LoadingImage, LoadingText } from '@/components/ui/loading';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { postsService } from '@/services/postsService';
import { Post, PostStatus } from '@/types/posts';
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Search,
  ThumbsUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function PostsPage() {
  const t = useTranslations('posts');
  const paths = useLocalizedPaths();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await postsService.getPublicPosts({
          page: currentPage,
          size: postsPerPage,
          q: debouncedSearchTerm || undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
        });

        setPosts(response.data);
        setTotalPosts(response.total);
        setTotalPages(Math.ceil(response.total / postsPerPage));
      } catch (err) {
        setError(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, debouncedSearchTerm, statusFilter, t]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

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
      console.error('Error toggling like:', err);
      toggleLike(postId);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={i === currentPage}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={totalPages === currentPage}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={1 === currentPage}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={i === currentPage}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={1 === currentPage}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={i === currentPage}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={totalPages === currentPage}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Loading className="h-12 w-96 mx-auto mb-4" />
          <Loading className="h-6 w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <LoadingImage className="h-48 w-full" />
              <CardHeader>
                <Loading className="h-6 w-3/4" />
                <LoadingText lines={2} className="space-y-2" />
              </CardHeader>
              <CardContent>
                <Loading className="h-4 w-1/4 mb-2" />
                <div className="flex gap-4">
                  <Loading className="h-4 w-16" />
                  <Loading className="h-4 w-16" />
                  <Loading className="h-4 w-16" />
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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={t('title')}
        description={t('description')}
        keywords={[
          'artículos',
          'blog',
          'transformación digital',
          'consultoría organizacional',
          'mejora continua',
          'adopción tecnológica',
          'gestión del cambio',
          'Power BI',
          'metodologías ágiles',
          'desarrollo organizacional',
        ]}
        url={paths.path('posts')}
        type="website"
      />
      <div className="container mx-auto px-4 py-16">
        <div
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4"
          data-animate
        >
          <div className="relative flex-1 max-w-md mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {posts.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">
              {t('noArticlesFound')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'ALL'
                ? t('noArticlesFoundDescription')
                : t('noArticlesAvailable')}
            </p>
            {(searchTerm || statusFilter !== 'ALL') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                variant="outline"
              >
                {t('clearFilters')}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Pinned Post */}
            {posts.filter((post) => post.isPinned).length > 0 && (
              <div className="mb-8 sm:mb-12" data-animate>
                {posts
                  .filter((post) => post.isPinned)
                  .slice(0, 1)
                  .map((pinnedPost) => (
                    <Card
                      key={pinnedPost.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                      <Link href={paths.path(`posts/${pinnedPost.slug}`)}>
                        {pinnedPost.featuredImage && (
                          <div className="relative overflow-hidden h-48 sm:h-64 md:h-80 lg:h-96">
                            <img
                              src={pinnedPost.featuredImage}
                              alt={pinnedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-wrap gap-1 sm:gap-2">
                              {pinnedPost.categories
                                .slice(0, 2)
                                .map((postCategory) => (
                                  <Badge
                                    key={postCategory.id}
                                    variant="secondary"
                                    className="bg-white/90 text-black text-xs sm:text-sm"
                                  >
                                    {postCategory.category.name}
                                  </Badge>
                                ))}
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                {pinnedPost.title}
                              </h2>
                              <p className="text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2 sm:line-clamp-3 opacity-90 leading-relaxed">
                                {pinnedPost.excerpt}
                              </p>
                            </div>
                          </div>
                        )}

                        <CardHeader className="p-4 sm:p-6">
                          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>
                                {pinnedPost.publishedAt &&
                                  formatDate(pinnedPost.publishedAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                              <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">
                                    {pinnedPost.viewCount} {t('views')}
                                  </span>
                                  <span className="sm:hidden">
                                    {pinnedPost.viewCount}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">
                                    {pinnedPost.commentCount} {t('comments')}
                                  </span>
                                  <span className="sm:hidden">
                                    {pinnedPost.commentCount}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline">
                                    {pinnedPost.likeCount} {t('likes')}
                                  </span>
                                  <span className="sm:hidden">
                                    {pinnedPost.likeCount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleLike(pinnedPost.id, e)}
                              disabled={
                                likingPosts.has(pinnedPost.id) || likesLoading
                              }
                              className={`flex items-center gap-1 sm:gap-2 transition-colors ${
                                isLiked(pinnedPost.id)
                                  ? 'text-red-500'
                                  : 'text-muted-foreground hover:text-red-500'
                              } ${
                                likingPosts.has(pinnedPost.id) || likesLoading
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                                  isLiked(pinnedPost.id) ? 'fill-current' : ''
                                } ${
                                  likingPosts.has(pinnedPost.id)
                                    ? 'animate-pulse'
                                    : ''
                                }`}
                              />
                              <span className="text-xs sm:text-sm font-medium">
                                {isLiked(pinnedPost.id)
                                  ? t('liked')
                                  : t('like')}
                              </span>
                            </button>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 sm:mt-4 bg-card/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background text-sm sm:text-base font-medium relative overflow-hidden group"
                          >
                            <span className="flex items-center justify-center gap-2 relative z-10">
                              {t('readMore')}
                              <svg
                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Button>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {posts
                .filter((post) => !post.isPinned)
                .map((post, index) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
                    data-animate
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      href={paths.path(`posts/${post.slug}`)}
                      className="flex flex-col h-full"
                    >
                      {post.featuredImage && (
                        <div className="relative overflow-hidden h-32 sm:h-48">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
                            {post.categories.slice(0, 2).map((postCategory) => (
                              <Badge
                                key={postCategory.id}
                                variant="secondary"
                                className="bg-white/90 text-black text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1"
                              >
                                {postCategory.category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <CardHeader className="flex-grow p-3 sm:p-6">
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-lg">
                          {post.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0 p-3 sm:p-6">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              {post.publishedAt && formatDate(post.publishedAt)}
                            </span>
                            <span className="sm:hidden">
                              {post.publishedAt &&
                                new Date(post.publishedAt).toLocaleDateString(
                                  'es-ES',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                  }
                                )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">
                                {post.viewCount} {t('views')}
                              </span>
                              <span className="sm:hidden">
                                {post.viewCount}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">
                                {post.commentCount} {t('comments')}
                              </span>
                              <span className="sm:hidden">
                                {post.commentCount}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">
                                {post.likeCount} {t('likes')}
                              </span>
                              <span className="sm:hidden">
                                {post.likeCount}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            disabled={likingPosts.has(post.id) || likesLoading}
                            className={`flex items-center gap-1 transition-colors ${
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
                              className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${
                                isLiked(post.id) ? 'fill-current' : ''
                              } ${
                                likingPosts.has(post.id) ? 'animate-pulse' : ''
                              }`}
                            />
                          </button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 sm:mt-4 bg-card/80 backdrop-blur-sm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background text-xs sm:text-sm font-medium relative overflow-hidden group"
                        >
                          <span className="flex items-center justify-center gap-2 relative z-10">
                            {t('readMore')}
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center" data-animate>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  >
                    {t('pagination.previous')}
                  </PaginationPrevious>
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  >
                    {t('pagination.next')}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}
