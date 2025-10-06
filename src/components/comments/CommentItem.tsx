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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}`}>
      <Card className={`${depth > 0 ? 'bg-muted/30' : ''}`}>
        <CardContent className="p-4">
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
