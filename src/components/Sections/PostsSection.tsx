'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';
import { Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PostsSection() {
  const t = useTranslations('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  
  // Hook personalizado para manejar likes con localStorage
  const { likedPosts, isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPublicPosts({ size: 6 });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
      setLikingPosts(prev => new Set(prev).add(postId));
      
      if (currentlyLiked) {
        await postsService.unlikePost(postId);
        toggleLike(postId);
      } else {
        await postsService.likePost(postId);
        toggleLike(postId);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // En caso de error, revertir el cambio local
      toggleLike(postId);
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
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
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground">{t('noPosts')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" data-animate>
          {t('title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto" data-animate>
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {posts.map((post, index) => (
          <Card 
            key={post.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
            data-animate
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link href={`/posts/${post.slug}`}>
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
                        className="bg-white/90 text-black"
                      >
                        {postCategory.category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors py-4">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 py-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 " />
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.viewCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.commentCount}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      disabled={likingPosts.has(post.id) || likesLoading}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked(post.id)
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      } ${likingPosts.has(post.id) || likesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart 
                        className={`h-4 w-4 transition-transform ${
                          isLiked(post.id) ? 'fill-current' : ''
                        } ${likingPosts.has(post.id) ? 'animate-pulse' : ''}`} 
                      />
                    </button>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      {t('readMore')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12" data-animate>
        <Button variant="outline" size="lg" asChild>
          <Link href="/posts">
            {t('viewAllPosts')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
