import { useCallback, useEffect, useState } from 'react';

const LIKED_POSTS_KEY = 'copexia-liked-posts';

interface UseLikedPostsReturn {
  likedPosts: Set<string>;
  isLiked: (postId: string) => boolean;
  toggleLike: (postId: string) => void;
  isLoading: boolean;
}

/**
 * Hook personalizado para manejar likes/dislikes de posts con persistencia en localStorage
 */
export function useLikedPosts(): UseLikedPostsReturn {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Cargar likes desde localStorage al montar el componente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_POSTS_KEY);
      if (stored) {
        const parsedLikes = JSON.parse(stored) as string[];
        setLikedPosts(new Set(parsedLikes));
      }
    } catch (error) {
      console.error('Error loading liked posts from localStorage:', error);
      // Si hay error, empezar con un Set vacío
      setLikedPosts(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar en localStorage cada vez que cambie el estado
  useEffect(() => {
    if (!isLoading) {
      try {
        const likesArray = Array.from(likedPosts);
        localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likesArray));
      } catch (error) {
        console.error('Error saving liked posts to localStorage:', error);
      }
    }
  }, [likedPosts, isLoading]);

  // Función para verificar si un post está liked
  const isLiked = useCallback((postId: string): boolean => {
    return likedPosts.has(postId);
  }, [likedPosts]);

  // Función para toggle de like
  const toggleLike = useCallback((postId: string): void => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  return {
    likedPosts,
    isLiked,
    toggleLike,
    isLoading,
  };
}
