"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { ToastContainer } from '@/components/ui/toast';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/lib/hooks/useToast';
import { commentsService } from '@/lib/services/commentsService';
import { getMyProfile, isLoggedIn } from '@/services/authService';
import type { Comment } from '@/types/posts';
import { MessageCircle, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  postId: string;
  onCommentCountChange?: (delta: number) => void;
}

export default function CommentsSection({
  postId,
  onCommentCountChange,
}: CommentsSectionProps) {
  const t = useTranslations('Comments');
  const { user, setDataUser, login } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    authorName: string;
  } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    hasMore: false,
  });

  const loadComments = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await commentsService.getByPost(postId);

      let commentsData: Comment[] = [];

      if (Array.isArray(response)) {
        commentsData = response as Comment[];
      } else if (response && response.data && Array.isArray(response.data)) {
        commentsData = response.data as Comment[];
      }
      setComments(commentsData);

      setPagination((prev) => ({
        ...prev,
        total: commentsData.length,
      }));
    } catch (err: unknown) {
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => {
      // Si es una respuesta (tiene parentId), insertarla en el comentario padre
      if (newComment.parentId) {
        return prev.map((comment) => {
          if (comment.id === newComment.parentId) {
            // Agregar la nueva respuesta al principio de las respuestas del comentario padre
            const updatedReplies = [newComment, ...(comment.replies || [])];
            return {
              ...comment,
              replies: updatedReplies,
            };
          }
          return comment;
        });
      } else {
        // Si es un comentario principal, agregarlo al principio de la lista
        return [newComment, ...prev];
      }
    });

    setShowCommentForm(false);
    setReplyTo(null);

    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));

    // Notificar al componente padre que se agregó un comentario
    if (onCommentCountChange) {
      onCommentCountChange(1);
    }
  };

  const handleReply = async (commentId: string, authorName: string) => {
    try {
      const isUserLoggedIn = !!user;

      if (isUserLoggedIn) {
      } else {
        const isAuthenticated = await isLoggedIn();

        if (isAuthenticated) {
          try {
            const profile = await getMyProfile();
            if (profile) {
              login(profile);
            }
          } catch (profileError) {}
        }
      }
    } catch (error) {
      console.error('Error checking authentication or loading profile:', error);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const loadMoreComments = () => {
    loadComments(pagination.page + 1, true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!showCommentForm && (
          <Button
            onClick={() => setShowCommentForm(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('addComment')}
          </Button>
        )}
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadComments()}
              className="mt-2"
            >
              {t('retry')}
            </Button>
          </CardContent>
        </Card>
      )}

      {showCommentForm && (
        <CommentForm
          postId={postId}
          parentId={replyTo?.commentId}
          replyTo={replyTo?.authorName}
          onCommentAdded={handleCommentAdded}
          onCancelReply={handleCancelReply}
          successToast={success}
          errorToast={showError}
        />
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {(() => {
        if (comments && comments.length > 0) {
          return (
            <div className="space-y-4">
              {comments.map((comment, index) => {
                return (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onCommentAdded={handleCommentAdded}
                    postId={postId}
                    successToast={success}
                    errorToast={showError}
                  />
                );
              })}
            </div>
          );
        } else if (!error && !showCommentForm) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('noComments')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('noCommentsDescription')}
                </p>
                <Button
                  onClick={() => setShowCommentForm(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('beFirst')}
                </Button>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}
    </div>
  );
}
