"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { commentsService } from '@/lib/services/commentsService';
import type { Comment } from '@/types/posts';
import { MessageCircle, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const t = useTranslations('Comments');
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
      console.log('🔄 Loading comments for postId:', postId);
      console.log('📄 Page:', page, 'Append:', append);

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log('🌐 Calling commentsService.getByPost...');
      const response = await commentsService.getByPost(postId);

      console.log('📦 Raw response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Response keys:', Object.keys(response || {}));
      console.log('📦 Response is array:', Array.isArray(response));

      let commentsData: Comment[] = [];

      // Handle both array response and object with data property
      if (Array.isArray(response)) {
        console.log('✅ Response is direct array');
        console.log('📊 Array length:', response.length);
        commentsData = response as Comment[];
        console.log('🔄 Processed commentsData from array:', commentsData);
      } else if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Response has data property with array');
        console.log('📊 Response.data:', response.data);
        console.log('📊 Response.data length:', response.data.length);
        commentsData = response.data as Comment[];
        console.log(
          '🔄 Processed commentsData from response.data:',
          commentsData
        );
      } else {
        console.log('❌ Response is neither array nor has data property');
        console.log('❌ Response:', response);
      }

      console.log('💾 Setting comments state with:', commentsData);
      setComments(commentsData);

      // Update pagination total
      setPagination((prev) => ({
        ...prev,
        total: commentsData.length,
      }));

      console.log('✅ Comments loaded successfully');
    } catch (err: unknown) {
      console.error('❌ Error loading comments:', err);
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
    // Add the new comment to the beginning of the list
    setComments((prev) => [newComment, ...prev]);
    setShowCommentForm(false);
    setReplyTo(null);

    // Update pagination total
    setPagination((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ commentId, authorName });
    setShowCommentForm(true);
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

  // Debug logs for render
  console.log('🎨 Rendering CommentsSection');
  console.log('📊 Current comments state:', comments);
  console.log('📊 Comments length:', comments?.length);
  console.log('📊 Loading state:', loading);
  console.log('📊 Error state:', error);
  console.log('📊 Pagination total:', pagination.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {t('title')} ({pagination.total})
          </CardTitle>
        </CardHeader>
      </Card>

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

      {/* Comment Form */}
      {showCommentForm && (
        <CommentForm
          postId={postId}
          parentId={replyTo?.commentId}
          replyTo={replyTo?.authorName}
          onCommentAdded={handleCommentAdded}
          onCancelReply={handleCancelReply}
        />
      )}

      {/* Add Comment Button */}

      {/* Comments List */}
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
                  />
                );
              })}
            </div>
          );
        } else if (!error) {
          return (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('noComments')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('noCommentsDescription')}
                </p>
                {!showCommentForm && (
                  <Button onClick={() => setShowCommentForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('beFirst')}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}
      {!showCommentForm && comments.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={() => setShowCommentForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addComment')}
          </Button>
        </div>
      )}
    </div>
  );
}
