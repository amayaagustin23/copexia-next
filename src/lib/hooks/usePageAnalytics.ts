'use client';

import { analyticsService } from '@/lib/services/analyticsService';
import type { PageInteraction } from '@/types/analytics';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Claves para localStorage
const SESSION_ID_KEY = 'analytics_session_id';
const SESSION_START_TIME_KEY = 'analytics_session_start_time';

// Funciones para manejar localStorage
const getStoredSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_ID_KEY);
};

const setStoredSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
};

const getStoredSessionStartTime = (): number | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_START_TIME_KEY);
  return stored ? parseInt(stored, 10) : null;
};

const setStoredSessionStartTime = (timestamp: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_START_TIME_KEY, timestamp.toString());
};

const clearStoredSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(SESSION_START_TIME_KEY);
};

interface UsePageAnalyticsOptions {
  enabled?: boolean;
  trackScrollDepth?: boolean;
  trackSections?: boolean;
  scrollThreshold?: number;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export function usePageAnalytics(options: UsePageAnalyticsOptions = {}) {
  const {
    enabled = true,
    trackScrollDepth = true,
    trackSections = true,
    scrollThreshold = 25,
  } = options;

  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [lastPathname, setLastPathname] = useState<string>('');
  const [isPageReload, setIsPageReload] = useState<boolean>(false);

  // Función para limpiar la sesión
  const clearSession = useCallback(() => {
    clearStoredSession();
    setSessionId('');
    setIsTracking(false);
    console.log('[Analytics] Session cleared');
  }, []);

  // Detectar si es una recarga de página
  useEffect(() => {
    // Detectar recarga de página usando performance.navigation
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isReload = navigationEntry?.type === 'reload';
    setIsPageReload(isReload);
    console.log('[Analytics] Page load type:', isReload ? 'reload' : 'navigation');
  }, []);

  // Inicializar con sessionId del localStorage si existe, o generar uno nuevo
  useEffect(() => {
    const storedSessionId = getStoredSessionId();
    const storedStartTime = getStoredSessionStartTime();
    
    if (storedSessionId && storedStartTime) {
      const currentTime = Date.now();
      const sessionDuration = currentTime - storedStartTime;
      const maxSessionDuration = 30 * 60 * 1000; // 30 minutos
      
      // Si la sesión es muy antigua, limpiarla
      if (sessionDuration > maxSessionDuration) {
        console.log('[Analytics] Session expired, clearing old session');
        clearSession();
        return;
      }
      
      // Usar el sessionId existente
      setSessionId(storedSessionId);
      startTimeRef.current = storedStartTime;
      console.log('[Analytics] Using existing sessionId from localStorage:', {
        sessionId: storedSessionId,
        startTime: new Date(storedStartTime).toLocaleString(),
        duration: Math.round(sessionDuration / 1000)
      });
    } else {
      // Generar nuevo sessionId
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      setStoredSessionId(newSessionId);
      setStoredSessionStartTime(Date.now());
      startTimeRef.current = Date.now();
      console.log('[Analytics] Generated new sessionId:', newSessionId);
    }
  }, [clearSession]);

  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const sectionsViewedRef = useRef<Set<string>>(new Set());
  const interactionsRef = useRef<PageInteraction[]>([]);
  const lastScrollRef = useRef<number>(0);
  const lastSessionUpdateRef = useRef<number>(0);

  // Detectar información del dispositivo
  const getDeviceInfo = useCallback((): DeviceInfo => {
    const ua = navigator.userAgent;
    
    // Detectar tipo de dispositivo
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);
    const type = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    // Detectar browser
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    // Detectar OS
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad'))
      os = 'iOS';

    return { type, browser, os };
  }, []);

  // Calcular scroll depth
  const calculateScrollDepth = useCallback((): number => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const trackLength = documentHeight - windowHeight;
    
    if (trackLength <= 0) return 100;
    
    const scrollPercentage = Math.round((scrollTop / trackLength) * 100);
    return Math.min(scrollPercentage, 100);
  }, []);

  // Detectar secciones visibles
  const detectVisibleSections = useCallback(() => {
    if (!trackSections) return;

    const sections = document.querySelectorAll('[id]');
    const windowHeight = window.innerHeight;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible =
        rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.25;

      if (isVisible && section.id && !sectionsViewedRef.current.has(section.id)) {
        sectionsViewedRef.current.add(section.id);
        trackInteraction('section_view', section.id);
      }
    });
  }, [trackSections]);

  // Registrar interacción
  const trackInteraction = useCallback(
    (type: PageInteraction['type'], target: string, metadata?: Record<string, any>) => {
      const interaction: PageInteraction = {
        type,
        target,
        timestamp: new Date().toISOString(),
        metadata,
      };
      interactionsRef.current.push(interaction);
    },
    []
  );

  // Iniciar tracking
  const startTracking = useCallback(async () => {
    if (!enabled || isTracking || !sessionId) {
      console.log('[Analytics] Skipping start tracking:', { enabled, isTracking, sessionId });
      return;
    }

    try {
      console.log('[Analytics] Starting tracking for page:', pathname, 'with sessionId:', sessionId);
      
      // Solo enviar visit data si es una recarga de página
      if (isPageReload) {
        console.log('[Analytics] Page reload detected, sending visit data');
        const deviceInfo = getDeviceInfo();
        
        const visitData = {
          sessionId, // Enviar el sessionId que generamos/obtuvimos
          page: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
          deviceInfo,
          screenInfo: {
            resolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          },
          language: navigator.language,
        };

        console.log('[Analytics] Sending visit data:', visitData);
        const result = await analyticsService.trackPageVisit(visitData);
        console.log('[Analytics] Visit tracking result:', result);
        
        if (result.success) {
          setIsTracking(true);
          console.log('[Analytics] Tracking started successfully with sessionId:', sessionId);
        } else {
          console.error('[Analytics] Failed to start tracking:', result.error);
        }
      } else {
        // Solo iniciar tracking sin enviar visit data
        console.log('[Analytics] Navigation detected, starting tracking without visit data');
        setIsTracking(true);
        console.log('[Analytics] Tracking started for navigation with sessionId:', sessionId);
      }
    } catch (error) {
      console.error('[Analytics] Error starting analytics tracking:', error);
    }
  }, [enabled, isTracking, pathname, sessionId, isPageReload]);

  // Finalizar tracking y enviar datos
  const endTracking = useCallback(async () => {
    if (!isTracking || !sessionId) {
      console.log('[Analytics] Skipping end tracking - not currently tracking or no sessionId:', { isTracking, sessionId });
      return;
    }

    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const scrollDepth = maxScrollDepthRef.current;
      const sectionsViewed = Array.from(sectionsViewedRef.current);
      const interactions = interactionsRef.current;

      const sessionData = {
        sessionId,
        exitTime: new Date().toISOString(),
        duration,
        scrollDepth,
        sectionsViewed,
        interactions,
      };

      console.log('[Analytics] Sending session update:', sessionData);
      const result = await analyticsService.updatePageSession(sessionData);
      console.log('[Analytics] Session update result:', result);

      if (result.success) {
        setIsTracking(false);
        console.log('[Analytics] Tracking ended successfully');
      } else {
        console.error('[Analytics] Failed to end tracking:', result.error);
      }
    } catch (error) {
      console.error('[Analytics] Error ending analytics tracking:', error);
    }
  }, [isTracking, sessionId]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!trackScrollDepth) return;

    const now = Date.now();
    if (now - lastScrollRef.current < 100) return; // Throttle
    lastScrollRef.current = now;

    const currentScrollDepth = calculateScrollDepth();
    if (currentScrollDepth > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = currentScrollDepth;

      // Track milestone
      if (currentScrollDepth >= scrollThreshold && 
          currentScrollDepth % scrollThreshold === 0) {
        trackInteraction('scroll', `${currentScrollDepth}%`);
      }
    }

    detectVisibleSections();
  }, [trackScrollDepth, calculateScrollDepth, scrollThreshold, trackInteraction, detectVisibleSections]);

  // Track button clicks
  const trackButtonClick = useCallback((buttonId: string, buttonText?: string) => {
    trackInteraction('button_click', buttonId, { text: buttonText });
  }, [trackInteraction]);

  // Track form submission
  const trackFormSubmit = useCallback((formId: string) => {
    trackInteraction('form_submit', formId);
  }, [trackInteraction]);

  // Detectar cambios de URL y actualizar sesión
  useEffect(() => {
    // Solo procesar si el pathname realmente cambió (no es la primera carga)
    if (lastPathname && lastPathname !== pathname) {
      console.log('[Analytics] URL changed from', lastPathname, 'to', pathname);
      
      // Finalizar tracking de la página anterior
      if (isTracking) {
        endTracking();
      }
      
      // Iniciar tracking para la nueva página
      startTracking();
    }
    
    // Actualizar el último pathname
    setLastPathname(pathname);
  }, [pathname, lastPathname, isTracking, startTracking, endTracking]);

  // Iniciar tracking en la primera carga
  useEffect(() => {
    if (sessionId && !isTracking) {
      console.log('[Analytics] Initial page load, starting tracking');
      startTracking();
    }
  }, [sessionId, isTracking, startTracking]);

  // Setup scroll listener
  useEffect(() => {
    if (!enabled || !trackScrollDepth) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, trackScrollDepth, handleScroll]);

  // Función para enviar datos de sesión usando sendBeacon
  const sendSessionData = useCallback((data: any) => {
    try {
      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json',
      });
      
      // Usar la URL base del API desde la configuración
      const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:9000/api/v1';
      const url = `${apiBaseUrl}/analytics/sessions/${data.sessionId}`;
      
      console.log('[Analytics] Sending session data via sendBeacon to:', url);
      console.log('[Analytics] Session data:', data);
      
      const sent = navigator.sendBeacon(url, blob);
      console.log('[Analytics] sendBeacon result:', sent);
      
      return sent;
    } catch (error) {
      console.error('[Analytics] Error sending session data via sendBeacon:', error);
      return false;
    }
  }, []);

  // Función para actualizar la sesión periódicamente
  const updateSessionPeriodically = useCallback(async () => {
    if (!isTracking || !sessionId) {
      console.log('[Analytics] Skipping periodic update - not tracking or no sessionId:', { isTracking, sessionId });
      return;
    }

    const now = Date.now();
    // Actualizar cada 30 segundos
    if (now - lastSessionUpdateRef.current < 30000) {
      console.log('[Analytics] Skipping periodic update - too soon');
      return;
    }

    try {
      const duration = Math.round((now - startTimeRef.current) / 1000);
      const sessionData = {
        sessionId,
        exitTime: new Date().toISOString(),
        duration,
        scrollDepth: maxScrollDepthRef.current,
        sectionsViewed: Array.from(sectionsViewedRef.current),
        interactions: interactionsRef.current,
      };

      console.log('[Analytics] Periodic session update starting with sessionId:', sessionId);
      console.log('[Analytics] Session data:', sessionData);
      
      const result = await analyticsService.updatePageSession(sessionData);
      console.log('[Analytics] Periodic update result:', result);
      
      if (result.success) {
        lastSessionUpdateRef.current = now;
        console.log('[Analytics] Periodic session update successful');
      } else {
        console.error('[Analytics] Periodic session update failed:', result.error);
      }
    } catch (error) {
      console.error('[Analytics] Error in periodic session update:', error);
    }
  }, [isTracking, sessionId]);

  // Actualización periódica de la sesión
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(updateSessionPeriodically, 30000); // Cada 30 segundos
    
    return () => {
      clearInterval(interval);
    };
  }, [isTracking, updateSessionPeriodically]);

  // Enviar datos antes de cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTracking && sessionId) {
        console.log('[Analytics] beforeunload triggered, sending session data');
        
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        const data = {
          sessionId,
          exitTime: new Date().toISOString(),
          duration,
          scrollDepth: maxScrollDepthRef.current,
          sectionsViewed: Array.from(sectionsViewedRef.current),
          interactions: interactionsRef.current,
        };

        sendSessionData(data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTracking, sessionId, sendSessionData]);

  return {
    sessionId,
    isTracking,
    trackButtonClick,
    trackFormSubmit,
    trackInteraction,
    clearSession,
  };
}

// Generar ID de sesión único
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

