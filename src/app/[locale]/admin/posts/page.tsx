"use client";

import { LoadingSpinner } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { useSearchDebounce } from '@/lib/hooks/useSearchDebounce';
import { cn } from '@/lib/utils';
import { classifyError } from '@/lib/utils/errorHandler';
import { postsService } from '@/services/postsService';
import type { Post } from '@/types/posts';
import { FilePlus2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type StatusFilter = 'PUBLISHED' | 'DRAFT' | 'ALL';

export default function PostsList() {
  const t = useTranslations('AdminPosts');
  const paths = useLocalizedPaths();

  const [items, setItems] = useState<Post[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPageSize] = useState<number>(10);
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / perPage)),
    [total, perPage]
  );

  const fetchData = useCallback(
    async (searchQuery: string = '') => {
      // Prevent duplicate concurrent requests
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        const data = await postsService.list({
          q: searchQuery || undefined,
          status: status === 'ALL' ? undefined : status,
          page,
          size: perPage,
        });
        setItems(data.data);
        setTotal(data.total);
        setPage(data.page);
        setPageSize(data.size);
      } catch (e: unknown) {
        const classifiedError = classifyError(e);
        setError(classifiedError.message || t('errorLoading'));
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [status, page, perPage, t]
  );

  // Search debounce hook
  const {
    searchQuery,
    isSearching,
    handleSearch,
    handleSearchSubmit,
    isValidQuery,
  } = useSearchDebounce({
    delay: 2000,
    minLength: 3,
    onSearch: fetchData,
  });

  useEffect(() => {
    fetchData(searchQuery);
  }, [fetchData, searchQuery, status, page, perPage]);

  const handleSearchWithPageReset = (query: string) => {
    setPage(1); // Reset to first page when searching
    handleSearch(query);
  };

  const handleSearchSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit();
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      setDeleting(postId);
      await postsService.delete(postId);
      await fetchData(searchQuery); // Refresh the list
    } catch (e: unknown) {
      const classifiedError = classifyError(e);
      setError(classifiedError.message || t('errorDeleting'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <Link
          href={`${paths.admin.posts}/create`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:bg-primary/90"
        >
          <FilePlus2 className="h-4 w-4" />
          {t('newPost')}
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={handleSearchSubmitForm}
          className="relative w-full sm:max-w-xs"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchWithPageReset(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </form>
        {searchQuery.length > 0 && !isValidQuery && (
          <p className="text-xs text-muted-foreground mt-1">
            Escribe al menos 3 caracteres para buscar
          </p>
        )}

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="rounded-md border border-input bg-background px-2 py-2 text-sm"
          >
            <option value="ALL">{t('status.all')}</option>
            <option value="PUBLISHED">{t('status.published')}</option>
            <option value="DRAFT">{t('status.draft')}</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-input bg-background px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {t('perPage', { n })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium w-[300px]">
                {t('table.title')}
              </th>

              <th className="px-4 py-3 text-left font-medium w-[200px]">
                {t('table.category')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[120px]">
                {t('table.status')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[120px]">
                {t('table.publishedAt')}
              </th>
              <th className="px-4 py-3 text-right font-medium w-[200px]">
                {t('table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center">
                  <LoadingSpinner size="sm" />
                </td>
              </tr>
            )}

            {!loading && items?.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  {searchQuery ? 'No se encontraron posts' : t('empty')}
                </td>
              </tr>
            )}

            {!loading &&
              items?.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-border/60 hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{p.title}</div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {p.viewCount} {t('views')} • {p.likeCount} {t('likes')} •{' '}
                      {p.commentCount} {t('comments')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {p.categories.slice(0, 2).map((postCategory) => (
                          <span
                            key={postCategory.id}
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor:
                                postCategory.category.color + '20',
                              color: postCategory.category.color,
                            }}
                          >
                            {postCategory.category.icon}{' '}
                            {postCategory.category.name}
                          </span>
                        ))}
                        {p.categories.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{p.categories.length - 2} {t('more')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
                        p.status === 'PUBLISHED'
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : 'bg-amber-500/15 text-amber-500'
                      )}
                    >
                      {p.status === 'PUBLISHED'
                        ? t('status.published')
                        : t('status.draft')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`${paths.admin.posts}/${p.id}/view`}
                        className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted/40 transition-colors"
                      >
                        {t('actions.view')}
                      </Link>
                      <Link
                        href={`${paths.admin.posts}/${p.id}/edit`}
                        className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted/40 transition-colors"
                      >
                        {t('actions.edit')}
                      </Link>
                      <button
                        onClick={() => handleDeletePost(p.id)}
                        disabled={deleting === p.id}
                        className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted/40 text-destructive transition-colors disabled:opacity-50"
                      >
                        {deleting === p.id ? '...' : t('actions.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-muted/40 transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            {t('pagination.prev')}
          </button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <button
            className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-muted/40 transition-colors"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            {t('pagination.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
