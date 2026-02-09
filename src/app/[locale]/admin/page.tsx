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
import { analyticsService, type AnalyticsSummary } from '@/services/analyticsService';
import { postsService } from '@/services/postsService';
import {
  Activity,
  BarChart3,
  Clock,
  Eye,
  FileText,
  FolderTree,
  Globe,
  Laptop,
  MessageCircle,
  Monitor,
  MousePointer,
  PieChart as PieChartIcon,
  Plus,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
  recentPosts: any[];
  topPosts: any[];
  categories: any[];
  recentComments: any[];
  monthlyStats: any[];
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
const DARK_BG = 'bg-slate-950';
const CARD_BG = 'bg-slate-900';
const TEXT_MAIN = 'text-slate-100';
const TEXT_MUTED = 'text-slate-400';

export default function AdminDashboardPage() {
  const t = useTranslations('AdminDashboard');
  const paths = useLocalizedPaths();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, analytics] = await Promise.all([
          postsService.getDashboard(),
          analyticsService.getSummary().catch(() => null),
        ]);
        setDashboardData(postsData as DashboardData);
        setAnalyticsData(analytics);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Prepare data for charts with strict array checks
  const visitsData = Array.isArray(analyticsData?.dailyVisits) ? analyticsData.dailyVisits : [];
  const deviceData = Array.isArray(analyticsData?.deviceBreakdown) ? analyticsData.deviceBreakdown : [];
  const browserData = Array.isArray(analyticsData?.browserBreakdown) ? analyticsData.browserBreakdown : [];
  const topPagesData = Array.isArray(analyticsData?.topPages) ? analyticsData.topPages.slice(0, 5) : [];

  // Ensure stats objects exist
  const stats = dashboardData?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalCategories: 0
  };

  // Safe accessors for lists
  const recentPosts = Array.isArray(dashboardData?.recentPosts) ? dashboardData.recentPosts : [];
  const topPosts = Array.isArray(dashboardData?.topPosts) ? dashboardData.topPosts : [];
  const recentComments = Array.isArray(dashboardData?.recentComments) ? dashboardData.recentComments : [];

  if (loading) {
    return (
      <div className={`space-y-6 p-6 animate-in fade-in duration-500 ${DARK_BG} min-h-screen`}>
        <header className="space-y-2">
          <Loading className="h-8 w-48 bg-slate-800" />
          <Loading className="h-4 w-96 bg-slate-800" />
        </header>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={`p-4 animate-pulse border-slate-800 ${CARD_BG}`}>
              <CardContent className="p-0 pt-2">
                <Loading className="h-8 w-16 bg-slate-800" />
                <Loading className="h-3 w-24 mt-1 bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ${DARK_BG} min-h-screen text-slate-200`}>
      <header className="space-y-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-in slide-in-from-left duration-500">
            {t('title')}
          </h1>
          <p className={`${TEXT_MUTED} animate-in slide-in-from-left duration-500 delay-100 text-lg`}>
            {t('description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
            <Link href={paths.admin.posts}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Post
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Sesiones Totales */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="h-24 w-24 text-blue-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>Sesiones Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${TEXT_MAIN}`}>{formatNumber(analyticsData?.totalSessions || 0)}</div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED} gap-2`}>
              <span className="text-blue-400 font-medium flex items-center">
                <MousePointer className="h-3 w-3 mr-1" />
                Interacciones activas
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-blue-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 2: Usuarios Únicos */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="h-24 w-24 text-cyan-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>Usuarios Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${TEXT_MAIN}`}>
              {formatNumber(analyticsData?.uniqueVisitors || 0)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED}`}>
              <span className="text-cyan-400 font-medium flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                Visitantes distintos
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-cyan-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 3: Páginas Vistas (Total Page Loads) */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText className="h-24 w-24 text-purple-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>Páginas Vistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${TEXT_MAIN}`}>
              {formatNumber(analyticsData?.totalVisits || 0)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED}`}>
              <span className="text-purple-400 font-medium flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                Secciones navegadas
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-purple-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 4: Tiempo Medio */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="h-24 w-24 text-orange-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>Tiempo Medio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${TEXT_MAIN}`}>
              {formatDuration(analyticsData?.avgSessionDuration || 0)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED} gap-2`}>
              <span className="text-orange-400 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Por sesión
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-orange-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Visits Chart */}
        <Card className={`col-span-1 lg:col-span-2 border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Tendencia de Sesiones</CardTitle>
            <CardDescription className={TEXT_MUTED}>Actividad diaria en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitsData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#f1f5f9' }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="Sesiones"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Dispositivos</CardTitle>
            <CardDescription className={TEXT_MUTED}>Distribución por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#f1f5f9' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {deviceData.map((device, index) => (
                <div key={index} className="flex flex-col items-center p-2 bg-slate-800/50 rounded-lg border border-slate-800">
                  <div className={TEXT_MAIN}>{getDeviceIcon(device.type)}</div>
                  <span className={`text-xs font-medium mt-1 capitalize ${TEXT_MUTED}`}>{device.type || 'Otro'}</span>
                  <span className={`text-xs ${TEXT_MAIN} font-bold`}>{device.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Top Pages */}
        <Card className={`col-span-1 lg:col-span-2 border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Secciones Más Visitadas</CardTitle>
            <CardDescription className={TEXT_MUTED}>Áreas con mayor interés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPagesData.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-blue-400 font-bold text-sm border border-slate-700">
                      {index + 1}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`font-medium ${TEXT_MAIN} group-hover:text-blue-400 transition-colors truncate`}>
                        {page.page}
                      </span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 max-w-[200px]">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(page.visits / (topPagesData[0]?.visits || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <span className={`block font-bold ${TEXT_MAIN}`}>{formatNumber(page.visits)}</span>
                    <span className={`text-xs ${TEXT_MUTED}`}>vistas</span>
                  </div>
                </div>
              ))}
              {topPagesData.length === 0 && (
                <div className={`text-center py-8 ${TEXT_MUTED}`}>No hay datos de visitas aún</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Stats */}
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Navegadores</CardTitle>
            <CardDescription className={TEXT_MUTED}>Tecnología de usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browserData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="browser"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', color: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <div className="text-2xl font-bold text-blue-400">{analyticsData?.bounceRate ? analyticsData.bounceRate.toFixed(1) : '0'}%</div>
                  <div className={`text-xs ${TEXT_MUTED}`}>Rebote</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <div className="text-2xl font-bold text-green-400">
                    {analyticsData?.avgSessionDuration ? Math.round(analyticsData.avgSessionDuration / 60) : '0'}m
                  </div>
                  <div className={`text-xs ${TEXT_MUTED}`}>Duración Media</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Posts Recientes</CardTitle>
            <CardDescription className={TEXT_MUTED}>Últimas publicaciones creadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${TEXT_MAIN} truncate`}>{post.title}</p>
                    <p className={`text-xs ${TEXT_MUTED}`}>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()} • {post.viewCount || 0} vistas
                    </p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${post.status === 'PUBLISHED'
                    ? 'bg-green-900/30 text-green-400 border border-green-900/50'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'
                    }`}>
                    {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>Comentarios Recientes</CardTitle>
            <CardDescription className={TEXT_MUTED}>Últimas interacciones de usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="p-2 bg-orange-900/20 rounded-lg text-orange-400">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${TEXT_MAIN}`}>{comment.authorName}</p>
                    <p className={`text-xs ${TEXT_MUTED} line-clamp-2`}>{comment.content}</p>
                    <p className={`text-xs ${TEXT_MUTED} mt-1`}>
                      {new Date(comment.createdAt).toLocaleDateString()} en <span className="text-blue-400">{comment.post?.title}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
