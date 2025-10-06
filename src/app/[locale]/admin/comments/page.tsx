"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading';
import { commentsService } from '@/lib/services/commentsService';
import { postsService } from '@/lib/services/postsService';
import { cn } from '@/lib/utils';
import { classifyError } from '@/lib/utils/errorHandler';
import type { Comment, CommentStats, Post } from '@/types/posts';
import {
  AlertCircle,
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Mail,
  MessageCircle,
  Reply,
  Search,
  Trash2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
type OrderBy = 'createdAt' | 'updatedAt';
type Order = 'asc' | 'desc';

export default function AdminCommentsPage() {
  const t = useTranslations('AdminComments');

  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [posts, setPosts] = useState<Map<string, Post>>(new Map());
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt');
  const [order, setOrder] = useState<Order>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [total, perPage]
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [commentsResponse, statsResponse] = await Promise.all([
        commentsService.listAdmin({
          page,
          size: perPage,
          search: search || undefined,
          orderBy,
          order,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
        commentsService.getStats(),
      ]);

      setComments(commentsResponse.data);
      setTotal(commentsResponse.total);
      setPage(commentsResponse.page);
      setPageSize(commentsResponse.size);
      setStats(statsResponse);

      // Fetch posts data for the comments
      const uniquePostIds = [...new Set(commentsResponse.data.map(comment => comment.postId))];
      const postsMap = new Map<string, Post>();
      
      for (const postId of uniquePostIds) {
        if (!posts.has(postId)) {
          try {
            const post = await postsService.getById(postId);
            postsMap.set(postId, post);
          } catch (e) {
            console.error(`Error fetching post ${postId}:`, e);
          }
        }
      }
      
      setPosts(prev => new Map([...prev, ...postsMap]));
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, perPage, search, statusFilter, orderBy, order, startDate, endDate]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleStatusUpdate = async (commentId: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading((prev) => new Set(prev).add(commentId));
    try {
      await commentsService.updateStatus(commentId, status);
      // Refresh the data
      fetchData();
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorUpdating'));
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm(t('confirmDelete'))) return;

    setActionLoading((prev) => new Set(prev).add(commentId));
    try {
      await commentsService.delete(commentId);
      // Refresh the data
      fetchData();
      // Remove from selected
      setSelectedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorDeleting'));
    } finally {
      setActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.size === 0) return;

    const confirmed = confirm(
      t('bulkActions.confirmBulk', { action, count: selectedComments.size })
    );
    if (!confirmed) return;

    setActionLoading(new Set(selectedComments));
    try {
      const promises = Array.from(selectedComments).map(async (commentId) => {
        switch (action) {
          case 'approve':
            return commentsService.updateStatus(commentId, 'APPROVED');
          case 'reject':
            return commentsService.updateStatus(commentId, 'REJECTED');
          case 'delete':
            return commentsService.delete(commentId);
        }
      });

      await Promise.all(promises);
      setSelectedComments(new Set());
      fetchData();
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('bulkActions.errorBulk', { action }));
    } finally {
      setActionLoading(new Set());
    }
  };

  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const selectAllComments = () => {
    if (selectedComments.size === comments.length) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map(c => c.id)));
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/15 text-green-600 border-green-200';
      case 'PENDING':
        return 'bg-yellow-500/15 text-yellow-600 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-500/15 text-red-600 border-red-200';
      case 'DELETED':
        return 'bg-gray-500/15 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-500/15 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'PENDING':
        return <Clock className="w-3 h-3" />;
      case 'REJECTED':
        return <Ban className="w-3 h-3" />;
      case 'DELETED':
        return <Trash2 className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('relativeTime.justNow');
    if (diffInSeconds < 3600) return t('relativeTime.minutesAgo', { minutes: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400) return t('relativeTime.hoursAgo', { hours: Math.floor(diffInSeconds / 3600) });
    if (diffInSeconds < 2592000) return t('relativeTime.daysAgo', { days: Math.floor(diffInSeconds / 86400) });
    
    return formatDate(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          size="sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('filters.title')}
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('stats.total')}</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('stats.approved')}</p>
                  <p className="text-xl font-semibold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('stats.pending')}</p>
                  <p className="text-xl font-semibold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Ban className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('stats.rejected')}</p>
                  <p className="text-xl font-semibold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('stats.deleted')}</p>
                  <p className="text-xl font-semibold">{stats.deleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedComments.size > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('bulkActions.selected', { count: selectedComments.size })}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading.size > 0}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {t('bulkActions.approve')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading.size > 0}
                >
                  <Ban className="w-4 h-4 mr-1" />
                  {t('bulkActions.reject')}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                  disabled={actionLoading.size > 0}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t('bulkActions.delete')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('filters.title')}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
              >
                {t('filters.clear')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <form onSubmit={onSubmitSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </form>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">{t('filters.allStatuses')}</option>
                <option value="PENDING">{t('filters.pending')}</option>
                <option value="APPROVED">{t('filters.approved')}</option>
                <option value="REJECTED">{t('filters.rejected')}</option>
              </select>

              <select
                value={orderBy}
                onChange={(e) => {
                  setOrderBy(e.target.value as OrderBy);
                  setPage(1);
                }}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="createdAt">{t('orderBy.createdAt')}</option>
                <option value="updatedAt">{t('orderBy.updatedAt')}</option>
              </select>

              <select
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value as Order);
                  setPage(1);
                }}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="desc">{t('order.desc')}</option>
                <option value="asc">{t('order.asc')}</option>
              </select>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  placeholder={t('startDate')}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  placeholder={t('endDate')}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <select
                  value={perPage}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {t('perPage', { n })}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!loading && !error && comments?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedComments.size === comments.length && comments.length > 0}
              onChange={selectAllComments}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">
              {selectedComments.size === comments.length 
                ? t('selection.deselectAll') 
                : t('selection.selectAll')
              }
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('selection.found', { count: comments.length })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
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

        {!loading && !error && comments?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('empty')}</h3>
              <p className="text-muted-foreground">{t('emptyDescription')}</p>
            </CardContent>
          </Card>
        )}

        {!loading &&
          !error &&
          comments?.map((comment) => (
            <Card 
              key={comment.id} 
              className={cn(
                "transition-shadow",
                selectedComments.has(comment.id) && "ring-2 ring-primary/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedComments.has(comment.id)}
                    onChange={() => toggleCommentSelection(comment.id)}
                    className="rounded border-input mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                                getStatusColor(comment.status)
                              )}
                            >
                              {getStatusIcon(comment.status)}
                              {t(`status.${comment.status.toLowerCase()}`)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {getRelativeTime(comment?.createdAt)}
                            {comment.authorEmail && (
                              <>
                                <Mail className="w-3 h-3" />
                                {comment.authorEmail}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      <span>
                        {t('comments.post')} {posts.get(comment.postId)?.title || `ID: ${comment.postId}`}
                      </span>
                      {comment.parentId && (
                        <>
                          <Reply className="w-3 h-3 ml-2" />
                          <span>{t('comments.reply')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {comment.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(comment.id, 'APPROVED')}
                          disabled={actionLoading.has(comment.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          {t('approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(comment.id, 'REJECTED')}
                          disabled={actionLoading.has(comment.id)}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          {t('reject')}
                        </Button>
                      </>
                    )}

                    {comment.status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(comment.id, 'REJECTED')}
                        disabled={actionLoading.has(comment.id)}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        {t('reject')}
                      </Button>
                    )}

                    {comment.status === 'REJECTED' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(comment.id, 'APPROVED')}
                        disabled={actionLoading.has(comment.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        {t('approve')}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(comment.id)}
                      disabled={actionLoading.has(comment.id)}
                    >
                      {actionLoading.has(comment.id) ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {!loading && !error && comments?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              {t('pagination.prev')}
            </Button>
            
            <span className="text-sm px-3">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
