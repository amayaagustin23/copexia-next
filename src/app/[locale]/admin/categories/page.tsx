'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { useSearchDebounce } from '@/lib/hooks/useSearchDebounce';
import { categoriesService } from '@/lib/services/categoriesService';
import { Category } from '@/types/posts';
import { Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function AdminCategoriesPage() {
  const t = useTranslations('AdminCategories');
  const paths = useLocalizedPaths();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchCategories = useCallback(
    async (searchQuery: string = '') => {
      // Prevent duplicate concurrent requests
      if (isFetchingRef.current) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        const categoriesResponse = await categoriesService.list({
          page: currentPage,
          size: pageSize,
          search: searchQuery || undefined,
        });

        // Handle response
        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data || []);
          setTotalPages(Math.ceil((categoriesResponse.total || 0) / pageSize));
          setTotalItems(categoriesResponse.total || 0);
        } else {
          setCategories([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [currentPage, pageSize]
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
    onSearch: fetchCategories,
  });

  useEffect(() => {
    fetchCategories(searchQuery);
  }, [fetchCategories, searchQuery]);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      await categoriesService.delete(categoryToDelete.id);
      await fetchCategories(searchQuery); // Refresh the list
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      // Handle error - could show a toast notification
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchWithPageReset = (query: string) => {
    setCurrentPage(1); // Reset to first page when searching
    handleSearch(query);
  };

  const handleSearchSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit();
  };
  // Remove client-side filtering since we're using server-side pagination
  // const filteredCategories = (categories || []).filter(
  //   (category) =>
  //     category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     category.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <Link
          href={`${paths.admin.categories}/new`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t('newCategory')}
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
            placeholder={t('searchInputPlaceholder')}
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
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-input bg-background px-2 py-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} por página
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
              <th className="px-4 py-3 text-left font-medium w-[80px]">
                {t('table.icon')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[200px]">
                {t('table.name')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[150px]">
                {t('table.slug')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[300px]">
                {t('table.description')}
              </th>
              <th className="px-4 py-3 text-left font-medium w-[120px]">
                {t('table.status')}
              </th>
              <th className="px-4 py-3 text-right font-medium w-[150px]">
                {t('table.actions')}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center">
                  <LoadingSpinner size="sm" />
                </td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  {searchQuery ? t('noResults') : t('noCategories')}
                </td>
              </tr>
            )}

            {!loading &&
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-border/60 hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: category.color + '20',
                        color: category.color,
                      }}
                    >
                      {category.icon}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{category.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{t('active')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`${paths.admin.categories}/${category.id}/edit`}
                        className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted/40 transition-colors"
                      >
                        {t('actions.edit')}
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted/40 text-destructive transition-colors"
                      >
                        {t('actions.delete')}
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
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || loading}
          >
            {t('pagination.prev')}
          </button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            className="rounded-md border border-input px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-muted/40 transition-colors"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage >= totalPages || loading}
          >
            {t('pagination.next')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirm.description', { name: categoryToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {t('deleteConfirm.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting
                ? t('deleteConfirm.deleting')
                : t('deleteConfirm.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
