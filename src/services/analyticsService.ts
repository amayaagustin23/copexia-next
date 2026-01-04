import api from '@/lib/axios';

export interface AnalyticsSummary {
    totalVisits: number;
    totalSessions: number;
    totalEvents: number;
    avgSessionDuration: number;
    bounceRate: number;
    topPages: Array<{
        page: string;
        visits: number;
    }>;
    deviceBreakdown: Array<{
        type: string;
        count: number;
    }>;
    browserBreakdown: Array<{
        browser: string;
        count: number;
    }>;
    dailyVisits: Array<{
        date: string;
        visits: number;
    }>;
}

export interface Visit {
    id: string;
    sessionId: string;
    page: string;
    referrer: string | null;
    userAgent: string;
    deviceType: string;
    browser: string;
    os: string;
    language: string;
    screenResolution: string;
    viewportSize: string;
    timestamp: string;
}

class AnalyticsService {
    async getSummary(): Promise<AnalyticsSummary> {
        const response = await api.get<AnalyticsSummary>('/analytics/summary');
        return response.data;
    }

    async getVisits(params?: { page?: number; size?: number }): Promise<{ data: Visit[]; total: number }> {
        const response = await api.get('/analytics/visits', { params });
        return response.data;
    }

    async getSessions(params?: { page?: number; size?: number }): Promise<any> {
        const response = await api.get('/analytics/sessions', { params });
        return response.data;
    }
}

export const analyticsService = new AnalyticsService();
