"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading';
import { QuillEditor } from '@/components/ui/quill-editor';
import { Textarea } from '@/components/ui/textarea';
import { ToastContainer } from '@/components/ui/toast';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { useToast } from '@/lib/hooks/useToast';
import { categoriesService } from '@/lib/services/categoriesService';
import { classifyError } from '@/lib/utils/errorHandler';
import { postsService } from '@/services/postsService';
import type { Category } from '@/types/posts';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CreatePostFormData {
  title: string;
  excerpt?: string;
  content: string;
  status?: 'PUBLISHED' | 'DRAFT';
  categoryIds: string[];
  featuredImage?: string;
  isPinned?: boolean;
}

export default function CreatePostPage() {
  const t = useTranslations('AdminPosts.createPage');
  const paths = useLocalizedPaths();
  const router = useRouter();
  const { toasts, removeToast, success, error: showError } = useToast();

  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    categoryIds: [],
    featuredImage: '',
    isPinned: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await categoriesService.list({ size: 100 });
        setCategories(response.data);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (
    field: keyof CreatePostFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const categoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await postsService.createPost(formData);
      success(t('successTitle'), t('successDescription'));

      // Redirect after a short delay to show the success toast
      setTimeout(() => {
        router.push(paths.admin.posts);
      }, 1500);
    } catch (err: unknown) {
      const classifiedError = classifyError(err);
      const errorMessage = classifiedError.message || t('errorCreating');
      setError(errorMessage);
      showError(t('errorTitle'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                  <Label htmlFor="excerpt">{t('excerptLabel')}</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ''}
                    onChange={(e) =>
                      handleInputChange('excerpt', e.target.value)
                    }
                    placeholder={t('excerptPlaceholder')}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('excerptHelp')}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {t('categoriesLabel')}
                    </Label>
                    {formData.categoryIds.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {formData.categoryIds.length} {t('selected')}
                      </Badge>
                    )}
                  </div>

                  {/* Selected Categories Display */}
                  {formData.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border">
                      <span className="text-xs text-muted-foreground font-medium">
                        {t('selectedCategories')}:
                      </span>
                      {formData.categoryIds.map((categoryId) => {
                        const category = categories.find(
                          (c) => c.id === categoryId
                        );
                        return category ? (
                          <Badge
                            key={categoryId}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                            <button
                              type="button"
                              onClick={() => handleCategoryToggle(categoryId)}
                              className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                            >
                              <span className="sr-only">Remove category</span>×
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Categories Selection */}
                  {loadingCategories ? (
                    <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/20">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {t('loadingCategories')}
                      </span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="p-6 text-center border rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        {t('noCategories')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('createCategoryFirst')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-background">
                      {categories.map((category) => {
                        const isSelected = formData.categoryIds.includes(
                          category.id
                        );
                        return (
                          <div
                            key={category.id}
                            className={`flex items-center space-x-3 p-2 rounded-md border transition-all cursor-pointer hover:bg-muted/50 ${
                              isSelected
                                ? 'bg-primary/10 border-primary/30 shadow-sm'
                                : 'hover:border-muted-foreground/30'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryToggle(category.id);
                            }}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <span
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm font-medium truncate">
                                {category.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {t('categoriesHelp')}
                  </p>
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
                    <QuillEditor
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
                <div className="space-y-2">
                  <Label htmlFor="status">{t('status')}</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange(
                        'status',
                        e.target.value as 'PUBLISHED' | 'DRAFT'
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="DRAFT">{t('draft')}</option>
                    <option value="PUBLISHED">{t('published')}</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) =>
                      handleInputChange('isPinned', e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isPinned">{t('pinPost')}</Label>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('createPost')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>{t('media')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="featuredImage">
                    {t('featuredImageLabel')}
                  </Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage || ''}
                    onChange={(e) =>
                      handleInputChange('featuredImage', e.target.value)
                    }
                    placeholder={t('featuredImagePlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('featuredImageHelp')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
