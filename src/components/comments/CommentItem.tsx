"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Comment } from '@/types/posts';
import { Calendar, ExternalLink, MessageCircle, Reply } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorName: string) => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  onReply,
  depth = 0,
}: CommentItemProps) {
  const t = useTranslations('Comments');
  const [showReplies, setShowReplies] = useState(true);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}`}>
      <Card className={`${depth > 0 ? 'bg-muted/30' : ''}`}>
        <CardContent className="p-4">
          {/* Comment Header */}
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
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      comment.status
                    )}`}
                  >
                    {t(`status.${comment.status.toLowerCase()}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt && (
                    <span>({t('edited')})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="mb-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-2">
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id, comment.authorName)}
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

          {/* Replies */}
          {hasReplies && showReplies && (
            <div className="mt-4 space-y-3">
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
