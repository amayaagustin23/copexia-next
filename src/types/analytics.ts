export interface PageVisit {
  id?: string;
  sessionId: string;
  page: string;
  referrer: string | null;
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  language: string;
  screenResolution: string;
  viewportSize: string;
  timestamp: string;
}

export interface PageSession {
  id?: string;
  sessionId: string;
  page: string;
  entryTime: string;
  exitTime?: string;
  duration?: number; // en segundos
  scrollDepth: number; // porcentaje máximo de scroll
  sectionsViewed: string[]; // IDs de secciones visitadas
  interactions: PageInteraction[];
  engagement: 'low' | 'medium' | 'high';
}

export interface PageInteraction {
  type: 'click' | 'scroll' | 'section_view' | 'form_submit' | 'button_click';
  target: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: string;
  page: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  averageDuration: number;
  averageScrollDepth: number;
  topSections: Array<{ section: string; views: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
}

// Request/Response types
export interface CreatePageVisitRequest {
  sessionId: string;
  page: string;
  referrer: string | null;
  userAgent: string;
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
  };
  screenInfo: {
    resolution: string;
    viewport: string;
  };
  language: string;
}

export interface UpdatePageSessionRequest {
  sessionId: string;
  exitTime: string;
  duration: number;
  scrollDepth: number;
  sectionsViewed: string[];
  interactions: PageInteraction[];
}

export interface AnalyticsResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

