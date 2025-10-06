"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { useLocalizedPaths } from '@/lib/hooks/useLocalizedPaths';
import { postsService } from '@/services/postsService';
import {
  BarChart3,
  Eye,
  FileText,
  FolderTree,
  MessageCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipos para el dashboard
interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalCategories: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentPosts: {
    id: string;
    title: string;
    publishedAt: string;
    viewCount: number;
  }[];
  topPosts: { id: string; title: string; viewCount: number }[];
  categories: { id: string; name: string; postCount: number }[];
  recentComments: {
    id: string;
    content: string;
    authorName: string;
    createdAt: string;
  }[];
  monthlyStats: { month: string; posts: number; views: number }[];
}

export default function AdminDashboardPage() {
  const t = useTranslations('AdminDashboard');
  const paths = useLocalizedPaths();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await postsService.getDashboard();
        setDashboardData(response as DashboardData);
      } catch {
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <header className="space-y-2">
          <Loading className="h-6 sm:h-8 w-40 sm:w-48" />
          <Loading className="h-3 sm:h-4 w-80 sm:w-96" />
        </header>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <Loading className="h-3 sm:h-4 w-16 sm:w-20" />
                <Loading className="h-3 sm:h-4 w-3 sm:w-4" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <Loading className="h-6 sm:h-8 w-12 sm:w-16" />
                <Loading className="h-2 sm:h-3 w-20 sm:w-24 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardHeader className="p-0 pb-4">
                <Loading className="h-5 sm:h-6 w-24 sm:w-32" />
                <Loading className="h-3 sm:h-4 w-32 sm:w-48" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <Loading className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                      <div className="flex-1 space-y-1 min-w-0">
                        <Loading className="h-3 sm:h-4 w-24 sm:w-32" />
                        <Loading className="h-2 sm:h-3 w-16 sm:w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Row Skeleton */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardHeader className="p-0 pb-4">
                <Loading className="h-5 sm:h-6 w-28 sm:w-36" />
                <Loading className="h-3 sm:h-4 w-40 sm:w-48" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between space-x-3"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Loading className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                        <Loading className="h-3 sm:h-4 w-20 sm:w-28 flex-1" />
                      </div>
                      <Loading className="h-5 sm:h-6 w-12 sm:w-16 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <header className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('description')}
          </p>
        </header>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = dashboardData?.stats;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          {t('title')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('description')}
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total de Posts
            </CardTitle>
            <FileText className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {formatNumber(stats?.totalPosts || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.publishedPosts || 0} publicados, {stats?.draftPosts || 0}{' '}
              borradores
            </p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Categorías
            </CardTitle>
            <FolderTree className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {dashboardData.categories.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Categorías activas</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total de Vistas
            </CardTitle>
            <Eye className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {formatNumber(stats?.totalViews || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Vistas acumuladas</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Interacciones
            </CardTitle>
            <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">
              {formatNumber(
                (stats?.totalLikes || 0) + (stats?.totalComments || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalLikes || 0} likes, {stats?.totalComments || 0}{' '}
              comentarios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">
              Acciones Rápidas
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Acciones rápidas para gestionar el contenido
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-2 sm:space-y-3">
            <Button asChild className="w-full text-xs sm:text-sm">
              <Link href={paths.admin.posts}>
                <Plus className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                Nuevo Post
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full text-xs sm:text-sm"
            >
              <Link href={paths.admin.categories}>
                <FolderTree className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                Gestionar Categorías
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full text-xs sm:text-sm"
              disabled
            >
              <BarChart3 className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
              Ver Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">
              Posts Recientes
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Últimas publicaciones creadas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 sm:space-y-3">
              {dashboardData?.recentPosts?.length > 0 ? (
                dashboardData.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <FileText className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)} • {post.viewCount} vistas
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No hay posts recientes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">
              Posts Populares
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Posts con más vistas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 sm:space-y-3">
              {dashboardData?.topPosts?.length > 0 ? (
                dashboardData.topPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.viewCount} vistas
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No hay datos de posts populares
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Categories */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">
              Categorías
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Categorías con conteo de posts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 sm:space-y-3">
              {dashboardData?.categories?.length > 0 ? (
                dashboardData.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between space-x-2 sm:space-x-3"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <FolderTree className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                      {category.postCount} posts
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No hay categorías
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm sm:text-base lg:text-lg">
              Comentarios Recientes
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Últimos comentarios recibidos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 sm:space-y-3">
              {dashboardData?.recentComments?.length > 0 ? (
                dashboardData.recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <MessageCircle className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium">
                        {comment.authorName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {comment.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 sm:py-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No hay comentarios recientes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
