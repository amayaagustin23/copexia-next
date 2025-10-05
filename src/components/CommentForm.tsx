'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { postsService } from '@/services/postsService';
import { MessageCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onCommentCreated: (comment: any) => void;
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const t = useTranslations('postDetail.commentsSection.form');
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorWebsite: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError(t('validation.contentRequired'));
      return;
    }

    if (!formData.authorName.trim()) {
      setError(t('validation.nameRequired'));
      return;
    }

    if (!formData.authorEmail.trim()) {
      setError(t('validation.emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      setError(t('validation.emailInvalid'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const commentData = {
        content: formData.content.trim(),
        authorName: formData.authorName.trim(),
        authorEmail: formData.authorEmail.trim(),
        authorWebsite: formData.authorWebsite.trim() || null,
      };

      const newComment = await postsService.createComment(postId, commentData);
      
      // Reset form
      setFormData({
        authorName: '',
        authorEmail: '',
        authorWebsite: '',
        content: '',
      });

      // Notify parent component
      onCommentCreated(newComment);
    } catch (err) {
      console.error('Error creating comment:', err);
      setError(t('validation.errorSending'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authorName">{t('name')}</Label>
              <Input
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder={t('namePlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="authorEmail">{t('email')}</Label>
              <Input
                id="authorEmail"
                name="authorEmail"
                type="email"
                value={formData.authorEmail}
                onChange={handleInputChange}
                placeholder={t('emailPlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="authorWebsite">{t('website')}</Label>
            <Input
              id="authorWebsite"
              name="authorWebsite"
              type="url"
              value={formData.authorWebsite}
              onChange={handleInputChange}
              placeholder={t('websitePlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="content">{t('comment')}</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder={t('commentPlaceholder')}
              rows={4}
              required
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('submitting')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
