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
  Eye,
  FileText,
  Globe,
  Heart,
  MessageCircle,
  Monitor,
  PieChart as PieChartIcon,
  Plus,
  Smartphone,
  Tablet,
  Users,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
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

const TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  borderColor: '#334155',
  color: '#f1f5f9',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  padding: '8px 12px',
};

const TOOLTIP_ITEM_STYLE = {
  color: '#cbd5e1', // Light slate text for items
};

export default function AdminDashboardPage() {
  const t = useTranslations('AdminDashboard');
  const locale = useLocale();
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
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale).format(num);
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
  const deviceData = (Array.isArray(analyticsData?.deviceBreakdown) ? analyticsData.deviceBreakdown : []).map((d) => ({
    ...d,
    name: ['desktop', 'mobile', 'tablet'].includes(d.type.toLowerCase())
      ? t(`charts.deviceTypes.${d.type.toLowerCase()}`)
      : d.type,
  }));
  const browserData = Array.isArray(analyticsData?.browserBreakdown) ? analyticsData.browserBreakdown : [];
  const osData = Array.isArray(analyticsData?.osBreakdown) ? analyticsData.osBreakdown : [];
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
    <div className={`space-y-6 md:space-y-8 p-3 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ${DARK_BG} min-h-screen text-slate-200`}>
      <header className="space-y-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent animate-in slide-in-from-left duration-500">
            {t('title')}
          </h1>
          <p className={`${TEXT_MUTED} animate-in slide-in-from-left duration-500 delay-100 text-sm md:text-lg`}>
            {t('description')}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20">
            <Link href={paths.admin.posts}>
              <Plus className="mr-2 h-4 w-4" />
              {t('newPost')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Posts */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText className="h-16 w-16 md:h-24 md:w-24 text-blue-500" />
          </div>
          <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>{t('stats.totalPosts')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-2xl md:text-3xl font-bold ${TEXT_MAIN}`}>{formatNumber(stats.totalPosts)}</div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED} gap-2`}>
              <span className="text-blue-400 font-medium flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {t('stats.publishedDrafts', { published: stats.publishedPosts, drafts: stats.draftPosts })}
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-blue-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 2: Total Views */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Eye className="h-16 w-16 md:h-24 md:w-24 text-cyan-500" />
          </div>
          <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>{t('stats.totalViews')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-2xl md:text-3xl font-bold ${TEXT_MAIN}`}>
              {formatNumber(stats.totalViews)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED}`}>
              <span className="text-cyan-400 font-medium flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {t('stats.globalReach')}
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-cyan-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 3: Total Comments */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageCircle className="h-16 w-16 md:h-24 md:w-24 text-purple-500" />
          </div>
          <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>{t('stats.totalComments')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-2xl md:text-3xl font-bold ${TEXT_MAIN}`}>
              {formatNumber(stats.totalComments)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED}`}>
              <span className="text-purple-400 font-medium flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {t('stats.communityInteractions')}
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-purple-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>

        {/* Card 4: Total Likes */}
        <Card className={`relative overflow-hidden hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 hover:-translate-y-1 border-slate-800 shadow-lg ${CARD_BG} group`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Heart className="h-16 w-16 md:h-24 md:w-24 text-orange-500" />
          </div>
          <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
            <CardTitle className={`text-sm font-medium ${TEXT_MUTED}`}>{t('stats.totalLikes')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-2xl md:text-3xl font-bold ${TEXT_MAIN}`}>
              {formatNumber(stats.totalLikes)}
            </div>
            <div className={`flex items-center mt-2 text-xs ${TEXT_MUTED} gap-2`}>
              <span className="text-orange-400 font-medium flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {t('stats.userAppreciation')}
              </span>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-orange-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Visits Chart */}
        <Card className={`col-span-1 lg:col-span-2 border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>{t('charts.visitsTrend')}</CardTitle>
            <CardDescription className={TEXT_MUTED}>{t('charts.dailyActivity')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px] w-full">
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
                    tickFormatter={(value) => new Date(value).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
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
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                    labelFormatter={(value) => new Date(value).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name={t('charts.sessions')}
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
          <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
            <CardTitle className={TEXT_MAIN}>{t('charts.devices')}</CardTitle>
            <CardDescription className={TEXT_MUTED}>{t('charts.distributionByType')}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="h-[200px] md:h-[200px] w-full flex items-center justify-center">
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
                    nameKey="name"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  {/* Legend removed from chart to use custom one below */}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {deviceData.map((device, index) => (
                <div key={index} className="flex flex-col items-center justify-center p-2 bg-slate-800/50 rounded-lg border border-slate-800 min-w-[80px] flex-1">
                  <div className={TEXT_MAIN}>{getDeviceIcon(device.type)}</div>
                  <span className={`text-xs font-medium mt-1 capitalize ${TEXT_MUTED}`}>{device.name || t('charts.other')}</span>
                  <span className={`text-xs ${TEXT_MAIN} font-bold`}>{device.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OS & Browsers Section */}
      <div className="grid gap-3 sm:gap-6 grid-cols-2">
        {/* OS Breakdown */}
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className={TEXT_MAIN}>{t('charts.operatingSystems')}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="h-[200px] md:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={osData} layout="vertical" margin={{ left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="os"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Bar dataKey="count" name={t('charts.count')} fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                    {osData.map((entry, index) => (
                      <Cell key={`cell-os-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Browser Stats */}
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className={TEXT_MAIN}>{t('charts.browsers')}</CardTitle>
            <CardDescription className={`hidden ${TEXT_MUTED}`}>{t('charts.userTech')}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="h-[200px] md:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browserData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="browser"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                  />
                  <Bar dataKey="count" name={t('charts.count')} fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Section */}
      <div className="grid gap-6 grid-cols-1">
        {/* Top Pages */}
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>{t('charts.topPages')}</CardTitle>
            <CardDescription className={TEXT_MUTED}>{t('charts.mostInterestedAreas')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPagesData.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-slate-800/30 rounded-lg border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                    <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 text-blue-400 font-bold text-xs md:text-sm border border-slate-700">
                      {index + 1}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`font-medium ${TEXT_MAIN} group-hover:text-blue-400 transition-colors truncate text-sm md:text-base`}>
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
                    <span className={`block font-bold ${TEXT_MAIN} text-sm md:text-base`}>{formatNumber(page.visits)}</span>
                    <span className={`text-xs ${TEXT_MUTED}`}>{t('charts.views')}</span>
                  </div>
                </div>
              ))}
              {topPagesData.length === 0 && (
                <div className={`text-center py-8 ${TEXT_MUTED}`}>{t('charts.noVisitsData')}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>{t('activity.recentPosts')}</CardTitle>
            <CardDescription className={TEXT_MUTED}>{t('activity.latestCreated')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recentPosts.slice(0, 5).map((post, index) => (
                <div key={post.id} className="flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-lg hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-blue-900/30">
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 text-blue-400 font-bold text-xs md:text-sm border border-slate-700 shadow-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${TEXT_MAIN} truncate group-hover:text-blue-400 transition-colors`}>{post.title}</p>
                    <div className="flex items-center gap-3 md:gap-4 mt-1 text-xs">
                      <span className={`flex items-center gap-1 ${TEXT_MUTED}`}>
                        <Heart className="h-3 w-3 text-red-500" /> {post.likeCount || 0}
                      </span>
                      <span className={`flex items-center gap-1 ${TEXT_MUTED}`}>
                        <MessageCircle className="h-3 w-3 text-purple-500" /> {post.commentCount || 0}
                      </span>
                      <span className={`flex items-center gap-1 ${TEXT_MUTED}`}>
                        <Eye className="h-3 w-3 text-cyan-500" /> {post.viewCount || 0}
                      </span>
                    </div>
                  </div>
                  <div className={`hidden sm:block text-xs px-2 py-1 rounded-full ${post.status === 'PUBLISHED'
                    ? 'bg-green-900/30 text-green-400 border border-green-900/50'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'
                    }`}>
                    {post.status === 'PUBLISHED' ? t('activity.published') : t('activity.draft')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-slate-800 shadow-lg ${CARD_BG}`}>
          <CardHeader>
            <CardTitle className={TEXT_MAIN}>{t('activity.recentComments')}</CardTitle>
            <CardDescription className={TEXT_MUTED}>{t('activity.latestInteractions')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {recentComments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 md:space-x-4 p-2 md:p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="p-1.5 md:p-2 bg-orange-900/20 rounded-lg text-orange-400">
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${TEXT_MAIN}`}>{comment.authorName}</p>
                    <p className={`text-xs ${TEXT_MUTED} line-clamp-2`}>{comment.content}</p>
                    <p className={`text-xs ${TEXT_MUTED} mt-1`}>
                      {new Date(comment.createdAt).toLocaleDateString(locale)} {t('activity.on')} <span className="text-blue-400">{comment.post?.title}</span>
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
