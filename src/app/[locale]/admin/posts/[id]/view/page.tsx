"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { classifyError } from '@/lib/utils/errorHandler';
import { postsService } from '@/services/postsService';
import type { Post } from '@/types/posts';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Copy,
  Edit,
  Eye,
  FileText,
  Hash,
  Heart,
  MessageCircle,
  Pin,
  Share2,
  TrendingUp,
  User,
  Eye as Views
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';

function ViewPostPageContent({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('AdminPosts.viewPage');
  const paths = useLocalizedPaths();
  
  // Unwrap the params Promise
  const { id } = React.use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const postData = await postsService.getById(id);
        setPost(postData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error || t('postNotFound')}</p>
        <Button variant="ghost" asChild>
          <Link href={paths.admin.posts}>
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
        </Button>
      </div>
    );
  }

  const copyToClipboard = async (text: string, type: 'url' | 'slug') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(type === 'url' ? t('urlCopied') : t('slugCopied'));
      setTimeout(() => setCopyMessage(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyMessage(t('copyFailed'));
      setTimeout(() => setCopyMessage(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href={paths.admin.posts} className="hover:text-foreground transition-colors">
          {t('posts')}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Copy Message */}
      {copyMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
          {copyMessage}
        </div>
      )}

      {/* Header */}
      <div className="relative">
        {/* Featured Image Background (if exists) */}
        {post.featuredImage && (
          <div className="absolute inset-0 -mx-6 -mt-6 h-64 bg-gradient-to-b from-black/20 to-transparent rounded-t-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        )}
        
        <div className="relative bg-background/95 backdrop-blur-sm border rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={paths.admin.posts}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Link>
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold truncate">
                    {post.title}
                  </h1>
                  {post.isPinned && (
                    <Pin className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  )}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    post.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {post.status === 'PUBLISHED' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {post.status === 'PUBLISHED' ? t('published') : t('draft')}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  {post.excerpt || t('description')}
                </p>
                
                {/* Categories */}
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {post.categories.map((postCategory) => (
                      <span
                        key={postCategory.id}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border"
                        style={{
                          backgroundColor: postCategory.category.color + '15',
                          color: postCategory.category.color,
                          borderColor: postCategory.category.color + '30',
                        }}
                      >
                        <span className="text-sm">{postCategory.category.icon}</span>
                        {postCategory.category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 mt-16">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('content')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {post.excerpt && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    {t('excerpt')}
                  </h3>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </div>
              )}
              
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`${paths.admin.posts}/${id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t('edit')}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={paths.path(`posts/${post.slug}`)} target="_blank">
                    <Eye className="w-4 h-4 mr-2" />
                    {t('view')}
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(post.slug, 'slug')}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('copySlug')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(window.location.href, 'url')}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('share')}
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('postInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.email}</p>
                  </div>
                </div>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/20">
                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{t('slug')}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{post.slug}</code>
                  </div>
                </div>
              </div>

    
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('stats')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Views */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Views className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{t('views')}</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{post.viewCount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((post.viewCount / Math.max(post.viewCount, 100)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Likes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                      <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-medium">{t('likes')}</span>
                  </div>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">{post.likeCount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((post.likeCount / Math.max(post.viewCount, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">{t('comments')}</span>
                  </div>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{post.commentCount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((post.commentCount / Math.max(post.viewCount, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>

            </CardContent>
          </Card>
          {/* SEO */}
          {(post.metaTitle || post.metaDescription) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('seo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.metaTitle && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">{t('metaTitle')}</p>
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                      <p className="text-sm font-medium">{post.metaTitle}</p>
                    </div>
                  </div>
                )}
                {post.metaDescription && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">{t('metaDescription')}</p>
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-secondary">
                      <p className="text-sm">{post.metaDescription}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ViewPostPageContent params={params} />
    </Suspense>
  );
}
