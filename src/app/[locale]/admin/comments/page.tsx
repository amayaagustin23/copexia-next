"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { commentsService } from '@/lib/services/commentsService';
import { cn } from '@/lib/utils';
import { classifyError } from '@/lib/utils/errorHandler';
import type { Comment, Post } from '@/types/posts';
import {
  Calendar,
  CheckCircle2,
  EyeOff,
  FileText,
  MessageCircle,
  Reply,
  Search,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { postsService } from '@/lib/services/postsService';

type StatusFilter = 'ALL' | 'ACTIVE' | 'HIDDEN';

export default function AdminCommentsPage() {
  const t = useTranslations('AdminComments');

  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; hidden: number } | null>(null);
  const [posts, setPosts] = useState<Map<string, Post>>(new Map());
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(20);
  const [search, setSearch] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total, perPage]);

  // Búsqueda combinada de texto + autor
  const combinedSearch = useMemo(() => {
    const parts = [];
    if (search) parts.push(search);
    if (authorFilter) parts.push(authorFilter);
    return parts.join(' ') || undefined;
  }, [search, authorFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [commentsResponse, statsResponse] = await Promise.all([
        commentsService.listAdmin({
          page,
          size: perPage,
          search: combinedSearch,
          status: statusFilter,
          orderBy: 'createdAt',
          order: 'desc',
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
        commentsService.getStats(),
      ]);

      setComments(commentsResponse.data);
      setTotal(commentsResponse.total);
      // Casteo seguro: el backend devuelve active/hidden
      setStats(statsResponse as unknown as { total: number; active: number; hidden: number });

      // Fetch titles de posts asociados
      const uniquePostIds = [...new Set(commentsResponse.data.map((c) => c.postId))];
      const newPostsMap = new Map<string, Post>();
      for (const postId of uniquePostIds) {
        if (!posts.has(postId)) {
          try {
            const post = await postsService.getById(postId);
            newPostsMap.set(postId, post);
          } catch (e) {
            console.error(`Error fetching post ${postId}:`, e);
          }
        }
      }
      setPosts((prev) => new Map([...prev, ...newPostsMap]));
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, combinedSearch, statusFilter, startDate, endDate]);

  const handleToggleStatus = async (comment: Comment) => {
    const newStatus = comment.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    setActionLoading((prev) => new Set(prev).add(comment.id));
    try {
      await commentsService.updateStatus(comment.id, newStatus as 'ACTIVE' | 'HIDDEN');
      fetchData();
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorUpdating'));
    } finally {
      setActionLoading((prev) => {
        const s = new Set(prev);
        s.delete(comment.id);
        return s;
      });
    }
  };

  const getRelativeTime = (date: Date | string) => {
    const diffInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diffInSeconds < 60) return t('relativeTime.justNow');
    if (diffInSeconds < 3600) return t('relativeTime.minutesAgo', { minutes: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400) return t('relativeTime.hoursAgo', { hours: Math.floor(diffInSeconds / 3600) });
    if (diffInSeconds < 2592000) return t('relativeTime.daysAgo', { days: Math.floor(diffInSeconds / 86400) });
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t('stats.total')}</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">{t('stats.active')}</p>
                <p className="text-xl font-semibold text-green-500">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t('stats.hidden')}</p>
                <p className="text-xl font-semibold">{stats.hidden}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Búsqueda por texto */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filtro por autor */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={authorFilter}
                onChange={(e) => { setAuthorFilter(e.target.value); setPage(1); }}
                placeholder={t('filters.authorPlaceholder')}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('filters.allStatuses')}</option>
              <option value="ACTIVE">{t('filters.active')}</option>
              <option value="HIDDEN">{t('filters.hidden')}</option>
            </select>

            {/* Limpiar filtros */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(''); setAuthorFilter(''); setStatusFilter('ALL'); setStartDate(''); setEndDate(''); setPage(1); }}
            >
              {t('filters.clear')}
            </Button>
          </div>

          {/* Filtros de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {loading && (
          <Card>
            <CardContent className="p-8 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && comments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('empty')}</h3>
              <p className="text-muted-foreground">{t('emptyDescription')}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && comments.map((comment) => (
          <Card
            key={comment.id}
            className={cn(
              'transition-all',
              comment.status === 'HIDDEN' && 'opacity-60 border-dashed'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Info del comentario */}
                <div className="flex-1 min-w-0">
                  {/* Autor + estado + fecha */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{comment.authorName}</span>

                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      comment.status === 'ACTIVE'
                        ? 'bg-green-500/15 text-green-600 border border-green-200'
                        : 'bg-muted text-muted-foreground border border-border'
                    )}>
                      {comment.status === 'ACTIVE'
                        ? <><CheckCircle2 className="w-3 h-3" /> {t('status.active')}</>
                        : <><EyeOff className="w-3 h-3" /> {t('status.hidden')}</>
                      }
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(comment.createdAt)}
                    </span>

                    {comment.parentId && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Reply className="w-3 h-3" /> {t('comments.reply')}
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
                    {comment.content}
                  </p>

                  {/* Post relacionado */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>{posts.get(comment.postId)?.title || `Post: ${comment.postId}`}</span>
                  </div>
                </div>

                {/* Acción única: toggle ACTIVE/HIDDEN */}
                <Button
                  size="sm"
                  variant={comment.status === 'ACTIVE' ? 'outline' : 'default'}
                  onClick={() => handleToggleStatus(comment)}
                  disabled={actionLoading.has(comment.id)}
                  className="shrink-0"
                >
                  {actionLoading.has(comment.id) ? (
                    <LoadingSpinner size="sm" />
                  ) : comment.status === 'ACTIVE' ? (
                    <><EyeOff className="w-4 h-4 mr-1" /> {t('hide')}</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-1" /> {t('activate')}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {!loading && !error && comments.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">
            {t('selection.found', { count: total })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              {t('pagination.prev')}
            </Button>
            <span className="text-sm px-2">{page} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
