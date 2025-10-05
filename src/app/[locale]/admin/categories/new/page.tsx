'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { categoriesService } from '@/lib/services/categoriesService';
import { classifyError } from '@/lib/utils/errorHandler';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const colorOptions = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
];

const iconOptions = [
  '📚',
  '💡',
  '🔧',
  '💻',
  '🎨',
  '📊',
  '🌱',
  '🚀',
  '⚡',
  '🎯',
  '🔍',
  '📝',
  '💼',
  '🌟',
  '🎪',
  '🏆',
];

export default function NewCategoryPage() {
  const t = useTranslations('AdminCategories');
  const paths = useLocalizedPaths();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: colorOptions[0],
    icon: iconOptions[0],
    isActive: true,
    sortOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (!formData.slug.trim()) {
      newErrors.slug = t('validation.slugRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('validation.descriptionRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await categoriesService.create(formData);
      router.push(paths.admin.categories);
    } catch (error: unknown) {
      console.error('Error creating category:', error);
      const classifiedError = classifyError(error);
      setErrors({ general: classifiedError.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={paths.admin.categories}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToCategories')}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('createTitle')}</h1>
          <p className="mt-1 text-muted-foreground">{t('createDescription')}</p>
        </div>
      </header>

      {errors.general && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <X className="w-4 h-4" />
              <span>{errors.general}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('basicInfo')}</CardTitle>
              <CardDescription>{t('basicInfoDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">{t('slug')}</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder={t('slugPlaceholder')}
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder={t('descriptionPlaceholder')}
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">{t('sortOrder')}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    handleInputChange(
                      'sortOrder',
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('appearance')}</CardTitle>
              <CardDescription>{t('appearanceDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('color')}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color
                          ? 'border-foreground'
                          : 'border-muted'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleInputChange('color', color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('icon')}</Label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-10 h-10 rounded-lg border-2 text-lg ${
                        formData.icon === icon
                          ? 'border-foreground'
                          : 'border-muted'
                      }`}
                      onClick={() => handleInputChange('icon', icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('status')}</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange('isActive', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    {t('active')}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('preview')}</CardTitle>
            <CardDescription>{t('previewDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                style={{
                  backgroundColor: formData.color + '20',
                  color: formData.color,
                }}
              >
                {formData.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {formData.name || t('categoryName')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  #{formData.slug || 'category-slug'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.description || t('categoryDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={paths.admin.categories}>{t('cancel')}</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('create')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
