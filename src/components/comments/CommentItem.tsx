"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Comment } from '@/types/posts';
import { Calendar, ExternalLink, MessageCircle, Reply } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorName: string) => void;
  onCommentAdded: (newComment: Comment) => void;
  postId: string;
  depth?: number;
}

export default function CommentItem({
  comment,
  onReply,
  onCommentAdded,
  postId,
  depth = 0,
}: CommentItemProps) {
  const t = useTranslations('Comments');
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;
  const isMainComment = !comment.parentId; // Solo comentarios principales (sin parentId)
  const canReply = depth < maxDepth && isMainComment; // Solo permitir responder a comentarios principales

  const handleReplyClick = () => {
    setShowReplyForm(true);
    onReply(comment.id, comment.authorName);
  };

  const handleCommentAdded = (newComment: Comment) => {
    onCommentAdded(newComment);
    setShowReplyForm(false);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const commentContent = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {comment.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {comment.authorWebsite ? (
                  <a
                    href={comment.authorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    {comment.authorName}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  comment.authorName
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {canReply && !showReplyForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplyClick}
            className="text-xs"
          >
            <Reply className="w-3 h-3 mr-1" />
            {t('reply')}
          </Button>
        )}

        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {showReplies ? t('hideReplies') : t('showReplies')} (
            {comment.replies?.length})
          </Button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            replyTo={comment.authorName}
            onCommentAdded={handleCommentAdded}
            onCancelReply={handleCancelReply}
          />
        </div>
      )}

      {hasReplies && showReplies && (
        <div className="mt-4 space-y-3">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onCommentAdded={onCommentAdded}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div
      className={`${
        isMainComment ? '' : 'ml-6 border-l-2 border-primary pl-4 pt-3'
      }`}
    >
      {isMainComment ? (
        <Card>
          <CardContent className="p-4">{commentContent}</CardContent>
        </Card>
      ) : (
        <div className="pb-3">{commentContent}</div>
      )}
    </div>
  );
}
