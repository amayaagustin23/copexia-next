'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Cache simple para evitar requests duplicados
const postCache = new Map<string, { post: Post; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ id: string; authorName: string; content: string; createdAt: string }[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  const requestInProgress = useRef(false);
  
  // Hook personalizado para manejar likes con localStorage
  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPost = async () => {
      if (requestInProgress.current) {
        return;
      }

      // Verificar cache primero
      const cached = postCache.get(slug);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached post:', slug);
        setPost(cached.post);
        setLoading(false);
        return;
      }

      try {
        requestInProgress.current = true;
        setLoading(true);
        setError(null);
        
        console.log('Fetching post from API:', slug);
        const response = await postsService.getPublicPostBySlug(slug);
        
        // Guardar en cache
        postCache.set(slug, { post: response, timestamp: Date.now() });
        
        setPost(response);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };

    if (slug && !requestInProgress.current) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
      
      // Invalidar cache para forzar refresh si es necesario
      postCache.delete(slug);
    } catch (err) {
      console.error('Error toggling like:', err);
      // En caso de error, revertir el cambio local
      toggleLike(post.id);
    } finally {
      setLiking(false);
    }
  };

  const handleToggleComments = async () => {
    if (!post) return;

    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    
    if (comments.length === 0) {
      try {
        setLoadingComments(true);
        const response = await postsService.getComments(post.id);
        setComments(response);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          
          <Skeleton className="h-64 w-full mb-8" />
          
          <div className="prose max-w-none">
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-5/6 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post no encontrado</h1>
          <p className="text-muted-foreground mb-8">El post que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          {/* Post Header */}
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
                <span>{post.viewCount} vistas</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Post Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Post Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-muted-foreground">
                  <button
                    onClick={handleToggleComments}
                    className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentCount} comentarios</span>
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
                    } ${liking || likesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-transform ${
                        isLiked(post.id) ? 'fill-current' : ''
                      } ${liking ? 'animate-pulse' : ''}`} 
                    />
                    <span className="font-medium">
                      {isLiked(post.id) ? 'Te gusta' : 'Me gusta'}
                    </span>
                  </button>
                  
                  <Button variant="outline" asChild>
                    <Link href="/#blog">
                      Ver más artículos
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Comments Section */}
          {showComments && (
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold">Comentarios</h3>
              </CardHeader>
              <CardContent>
                {loadingComments ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
