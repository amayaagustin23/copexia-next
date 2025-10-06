"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HTMLEditor } from '@/components/ui/html-editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { classifyError } from '@/lib/utils/errorHandler';
import { postsService } from '@/services/postsService';
import type { Post, UpdatePostData } from '@/types/posts';
import { ArrowLeft, Eye, Save, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

interface EditPostFormData extends UpdatePostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  categoryId?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}

function EditPostPageContent({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('AdminPosts.editPage');
  const paths = useLocalizedPaths();
  const router = useRouter();
  
  // Unwrap the params Promise
  const { id } = React.use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<EditPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    categoryId: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    tags: [],
  });

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Load post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const postData = await postsService.getById(id);
        setPost(postData);
        setFormData({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt || '',
          content: postData.content,
          published: postData.status === 'PUBLISHED',
          categoryId: postData.categories[0]?.category.id || '',
          featuredImage: postData.featuredImage || '',
          metaTitle: postData.metaTitle || '',
          metaDescription: postData.metaDescription || '',
          tags: postData.tags || [],
        });
      } catch (err: unknown) {
        console.error('Error loading post:', err);
        const classifiedError = classifyError(err);
        setError(classifiedError.message || t('errorLoading'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, t]);

  const handleInputChange = (
    field: keyof EditPostFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug when title changes
      if (field === 'title' && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: UpdatePostData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        published: formData.published,
        isPinned: post?.isPinned || false,
        categoryId: formData.categoryId,
        featuredImage: formData.featuredImage,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        tags: formData.tags,
      };

      await postsService.update(id, updateData);
      router.push(paths.admin.posts);
    } catch (err: unknown) {
      console.error('Error updating post:', err);
      const classifiedError = classifyError(err);
      setError(classifiedError.message || t('errorUpdating'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      setDeleteLoading(true);
      await postsService.deletePost(id);
      router.push(paths.admin.posts);
    } catch (err: unknown) {
      console.error('Error deleting post:', err);
      const classifiedError = classifyError(err);
      setError(classifiedError.message || t('errorDeleting'));
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !post) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('postNotFound')}</p>
        <Link href={paths.admin.posts} className="text-primary hover:underline">
          {t('backToPosts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={paths.admin.posts}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back')}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? t('edit') : t('preview')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {t('delete')}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('basicInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('titleLabel')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('titlePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">{t('slugLabel')}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder={t('slugPlaceholder')}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('slugHelp')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">{t('excerptLabel')}</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder={t('excerptPlaceholder')}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>{t('content')}</CardTitle>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="prose max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="content">{t('contentLabel')}</Label>
                    <HTMLEditor
                      value={formData.content}
                      onChange={(value) => handleInputChange('content', value)}
                      placeholder={t('contentPlaceholder')}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t('publish')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      handleInputChange('published', e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor="published">{t('publishImmediately')}</Label>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('updatePost')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>{t('seo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">{t('metaTitleLabel')}</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      handleInputChange('metaTitle', e.target.value)
                    }
                    placeholder={t('metaTitlePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">
                    {t('metaDescriptionLabel')}
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleInputChange('metaDescription', e.target.value)
                    }
                    placeholder={t('metaDescriptionPlaceholder')}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="featuredImage">
                    {t('featuredImageLabel')}
                  </Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      handleInputChange('featuredImage', e.target.value)
                    }
                    placeholder={t('featuredImagePlaceholder')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tags')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="tags">{t('tagsLabel')}</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                      handleInputChange('tags', tags);
                    }}
                    placeholder={t('tagsPlaceholder')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t('stats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('views')}</span>
                  <span className="text-sm font-medium">{post.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('likes')}</span>
                  <span className="text-sm font-medium">{post.likeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('comments')}</span>
                  <span className="text-sm font-medium">{post.commentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('created')}</span>
                  <span className="text-sm font-medium">
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('updated')}</span>
                  <span className="text-sm font-medium">
                    {new Date(post.updatedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <EditPostPageContent params={params} />
    </Suspense>
  );
}
