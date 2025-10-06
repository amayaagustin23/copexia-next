"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { commentsService } from '@/lib/services/commentsService';
import type { Comment } from '@/types/posts';
import { MessageCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: (comment: Comment) => void;
  replyTo?: string;
  onCancelReply?: () => void;
}

export default function CommentForm({
  postId,
  parentId,
  onCommentAdded,
  replyTo,
  onCancelReply,
}: CommentFormProps) {
  const t = useTranslations('Comments');
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isReply = !!replyTo;

  // Si es una respuesta y el usuario está logueado, solo mostrar textarea
  const showFullForm = !isReply || !isLoggedIn;

  const [formData, setFormData] = useState({
    content: '',
    authorName: isLoggedIn ? user?.name || '' : '',
    authorEmail: isLoggedIn ? user?.email || '' : '',
    authorWebsite: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar datos del formulario cuando cambie el usuario
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData((prev) => ({
        ...prev,
        authorName: user.name || '',
        authorEmail: user.email || '',
      }));
    }
  }, [isLoggedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Si el usuario está logueado, usar sus datos
      const commentData = {
        content: formData.content,
        postId,
        parentId,
        authorName: isLoggedIn ? user?.name || '' : formData.authorName,
        authorEmail: isLoggedIn ? user?.email || '' : formData.authorEmail,
        authorWebsite: formData.authorWebsite,
      };

      const comment = await commentsService.create(commentData);

      onCommentAdded(comment);

      // Reset form
      setFormData({
        content: '',
        authorName: isLoggedIn ? user?.name || '' : '',
        authorEmail: isLoggedIn ? user?.email || '' : '',
        authorWebsite: '',
      });

      // Cancel reply mode if it was a reply
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (err: unknown) {
      console.error('Error creating comment:', err);
      setError(t('errorCreating'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {replyTo ? t('replyTo', { author: replyTo }) : t('addComment')}
          {isLoggedIn && isReply && (
            <span className="text-sm text-muted-foreground font-normal">
              ({t('asUser', { name: user?.name || 'Usuario' })})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="content">{t('content')}</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={t('contentPlaceholder')}
              rows={4}
              required
            />
          </div>

          {/* Mostrar campos de usuario solo si es necesario */}
          {showFullForm && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authorName">{t('authorName')}</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      handleInputChange('authorName', e.target.value)
                    }
                    placeholder={t('authorNamePlaceholder')}
                    required={!isLoggedIn}
                    disabled={isLoggedIn}
                  />
                </div>

                <div>
                  <Label htmlFor="authorEmail">{t('authorEmail')}</Label>
                  <Input
                    id="authorEmail"
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) =>
                      handleInputChange('authorEmail', e.target.value)
                    }
                    placeholder={t('authorEmailPlaceholder')}
                    disabled={isLoggedIn}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="authorWebsite">{t('authorWebsite')}</Label>
                <Input
                  id="authorWebsite"
                  type="url"
                  value={formData.authorWebsite}
                  onChange={(e) =>
                    handleInputChange('authorWebsite', e.target.value)
                  }
                  placeholder={t('authorWebsitePlaceholder')}
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {replyTo ? t('reply') : t('submit')}
            </Button>

            {onCancelReply && (
              <Button type="button" variant="outline" onClick={onCancelReply}>
                {t('cancel')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
