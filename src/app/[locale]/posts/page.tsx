'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calendar, Eye, Heart, MessageCircle, Search, ThumbsUp, Users } from 'lucide-react';
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
        console.error('Error fetching posts:', err);
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
    return new Date(dateString).toLocaleDateString(t('locale') || 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-animate>
          {t('title')}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg" data-animate>
          {t('description')}
        </p>
      </div>

      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4" data-animate>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

      </div>

      {!loading && (
        <div className="mb-8 p-4 bg-muted/50 rounded-lg" data-animate>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {t('showingPosts', { count: posts.length, total: totalPosts })}
            </span>
            <span>
              {t('pageOf', { current: currentPage, total: totalPages })}
            </span>
          </div>
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold mb-2">{t('noArticlesFound')}</h3>
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
          {posts.filter(post => post.isPinned).length > 0 && (
            <div className="mb-12" data-animate>
              {posts.filter(post => post.isPinned).slice(0, 1).map((pinnedPost) => (
                <Card
                  key={pinnedPost.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <Link href={paths.path(`posts/${pinnedPost.slug}`)}>
                    {pinnedPost.featuredImage && (
                      <div className="relative overflow-hidden h-64 md:h-80 lg:h-96">
                        <img
                          src={pinnedPost.featuredImage}
                          alt={pinnedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                          {pinnedPost.categories.slice(0, 3).map((postCategory) => (
                            <Badge
                              key={postCategory.id}
                              variant="secondary"
                              className="bg-white/90 text-black text-sm"
                            >
                              {postCategory.category.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {pinnedPost.title}
                          </h2>
                          <p className="text-lg md:text-xl line-clamp-3 opacity-90">
                            {pinnedPost.excerpt}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {pinnedPost.publishedAt && formatDate(pinnedPost.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {pinnedPost.author.name}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{pinnedPost.viewCount} {t('views')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>{pinnedPost.commentCount} {t('comments')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{pinnedPost.likeCount} {t('likes')}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleLike(pinnedPost.id, e)}
                          disabled={likingPosts.has(pinnedPost.id) || likesLoading}
                          className={`flex items-center gap-2 transition-colors ${
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
                            className={`h-5 w-5 transition-transform ${
                              isLiked(pinnedPost.id) ? 'fill-current' : ''
                            } ${likingPosts.has(pinnedPost.id) ? 'animate-pulse' : ''}`}
                          />
                          <span className="text-sm font-medium">
                            {isLiked(pinnedPost.id) ? t('liked') : t('like')}
                          </span>
                        </button>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full mt-4 group-hover:bg-primary/10 text-base"
                      >
                        {t('readMore')}
                      </Button>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.filter(post => !post.isPinned).map((post, index) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
              data-animate
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={paths.path(`posts/${post.slug}`)} className="flex flex-col h-full">
                {post.featuredImage && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.categories.slice(0, 2).map((postCategory) => (
                        <Badge
                          key={postCategory.id}
                          variant="secondary"
                          className="bg-white/90 text-black text-xs"
                        >
                          {postCategory.category.name}
                        </Badge>
                      ))}
                    </div>
                    {post.isPinned && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="text-xs">
                          {t('pinned')}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="flex-grow">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt && formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      {post.author.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount} {t('views')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentCount} {t('comments')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likeCount} {t('likes')}</span>
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
                        className={`h-4 w-4 transition-transform ${
                          isLiked(post.id) ? 'fill-current' : ''
                        } ${likingPosts.has(post.id) ? 'animate-pulse' : ''}`}
                      />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 group-hover:bg-primary/10"
                  >
                    {t('readMore')}
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
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                >
                  <span>{t('previous')}</span>
                </PaginationPrevious>
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                >
                  <span>{t('next')}</span>
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
