import api from '@/lib/axios';
import type {
	AnalyticsEvent,
	AnalyticsResponse,
	AnalyticsSummary,
	CreatePageVisitRequest,
	PageSession,
	PageVisit,
	UpdatePageSessionRequest,
} from '@/types/analytics';

class AnalyticsService {
  private readonly basePath = '/analytics';

  /**
   * Registra una nueva visita a la página
   */
  async trackPageVisit(
    data: CreatePageVisitRequest
  ): Promise<AnalyticsResponse<PageVisit>> {
    try {
      const url = `${this.basePath}/visits`;
      console.log('[AnalyticsService] POST request to:', url);
      console.log('[AnalyticsService] Request data:', data);
      
      const response = await api.post<PageVisit>(url, data);
      console.log('[AnalyticsService] Response:', response.data);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('[AnalyticsService] Error tracking page visit:', error);
      
      // Crear objeto de detalles de error de forma segura
      const errorDetails: any = {};
      
      if (error?.message) errorDetails.message = error.message;
      if (error?.response?.status) errorDetails.status = error.response.status;
      if (error?.response?.data) errorDetails.data = error.response.data;
      if (error?.config) {
        errorDetails.config = {
          url: error.config.url || 'unknown',
          method: error.config.method || 'unknown',
          baseURL: error.config.baseURL || 'unknown',
        };
      }
      
      // Solo loggear si hay detalles
      if (Object.keys(errorDetails).length > 0) {
        console.error('[AnalyticsService] Error details:', errorDetails);
      }
      
      return {
        success: false,
        error: error?.message || 'Failed to track page visit',
      };
    }
  }

  /**
   * Actualiza la sesión de la página (duración, scroll, etc.)
   */
  async updatePageSession(
    data: UpdatePageSessionRequest
  ): Promise<AnalyticsResponse<PageSession>> {
    try {
      const url = `${this.basePath}/sessions/${data.sessionId}`;
      const fullUrl = `${api.defaults.baseURL}${url}`;
      
      console.log('[AnalyticsService] PUT request to:', url);
      console.log('[AnalyticsService] Full URL:', fullUrl);
      console.log('[AnalyticsService] Request data:', data);
      console.log('[AnalyticsService] API base URL:', api.defaults.baseURL);
      
      const response = await api.put<PageSession>(url, data);
      console.log('[AnalyticsService] Response status:', response.status);
      console.log('[AnalyticsService] Response data:', response.data);
      console.log('[AnalyticsService] Full response:', response);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('[AnalyticsService] Error updating page session:', error);
      
      // Crear objeto de detalles de error de forma segura
      const errorDetails: any = {};
      
      if (error?.message) errorDetails.message = error.message;
      if (error?.response?.status) errorDetails.status = error.response.status;
      if (error?.response?.data) errorDetails.data = error.response.data;
      if (error?.config) {
        errorDetails.config = {
          url: error.config.url || 'unknown',
          method: error.config.method || 'unknown',
          baseURL: error.config.baseURL || 'unknown',
        };
      }
      
      // Solo loggear si hay detalles
      if (Object.keys(errorDetails).length > 0) {
        console.error('[AnalyticsService] Error details:', errorDetails);
      }
      
      return {
        success: false,
        error: error?.message || 'Failed to update page session',
      };
    }
  }

  /**
   * Registra un evento de analytics
   */
  async trackEvent(
    data: AnalyticsEvent
  ): Promise<AnalyticsResponse<AnalyticsEvent>> {
    try {
      const response = await api.post<AnalyticsEvent>(
        `${this.basePath}/events`,
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error tracking event:', error);
      return {
        success: false,
        error: error.message || 'Failed to track event',
      };
    }
  }

  /**
   * Obtiene el resumen de analíticas (solo para admin)
   */
  async getAnalyticsSummary(
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsResponse<AnalyticsSummary>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get<AnalyticsSummary>(
        `${this.basePath}/summary?${params.toString()}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error getting analytics summary:', error);
      return {
        success: false,
        error: error.message || 'Failed to get analytics summary',
      };
    }
  }

  /**
   * Obtiene todas las visitas (solo para admin)
   */
  async getAllVisits(
    page: number = 1,
    limit: number = 50
  ): Promise<AnalyticsResponse<{ visits: PageVisit[]; total: number }>> {
    try {
      const response = await api.get<{ visits: PageVisit[]; total: number }>(
        `${this.basePath}/visits?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error getting visits:', error);
      return {
        success: false,
        error: error.message || 'Failed to get visits',
      };
    }
  }

  /**
   * Obtiene todas las sesiones (solo para admin)
   */
  async getAllSessions(
    page: number = 1,
    limit: number = 50
  ): Promise<AnalyticsResponse<{ sessions: PageSession[]; total: number }>> {
    try {
      const response = await api.get<{ sessions: PageSession[]; total: number }>(
        `${this.basePath}/sessions?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error getting sessions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get sessions',
      };
    }
  }
}

// Exportar instancia única del servicio
export const analyticsService = new AnalyticsService();

