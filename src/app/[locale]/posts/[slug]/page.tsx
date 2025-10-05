'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLikedPosts } from '@/lib/hooks/useLikedPosts';
import { postsService } from '@/services/postsService';
import { Post } from '@/types/posts';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Tag, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('postDetail');
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  
  // Hook personalizado para manejar likes con localStorage
  const { isLiked, toggleLike, isLoading: likesLoading } = useLikedPosts();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsService.getPublicPostBySlug(slug);
        setPost(response);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
    } catch (err) {
      console.error('Error toggling like:', err);
      // En caso de error, revertir el cambio local
      toggleLike(post.id);
    } finally {
      setLiking(false);
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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

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
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Por {post.author.name}</span>
            </div>
            
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
            <img
              src={post.featuredImage}
              alt={post.title}
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
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentCount} comentarios</span>
                </div>
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
      </div>
    </div>
  );
}
