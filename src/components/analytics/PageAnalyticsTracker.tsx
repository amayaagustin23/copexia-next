'use client';

import { usePageAnalytics } from '@/lib/hooks/usePageAnalytics';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface PageAnalyticsTrackerProps {
  /**
   * Habilitar/deshabilitar tracking
   */
  enabled?: boolean;

  /**
   * Páginas a excluir del tracking (regex patterns)
   */
  excludePages?: RegExp[];

  /**
   * Track scroll depth
   */
  trackScrollDepth?: boolean;

  /**
   * Track sections visibility
   */
  trackSections?: boolean;
}

export default function PageAnalyticsTracker({
  enabled = true,
  excludePages = [],
  trackScrollDepth = true,
  trackSections = true,
}: PageAnalyticsTrackerProps) {
  const pathname = usePathname();

  // Verificar si la página actual debe ser excluida
  const shouldTrack = enabled && !excludePages.some((pattern) => pattern.test(pathname));

  const { consent } = useCookieConsent();
  const hasConsent = consent === 'granted';

  // Inicializar analytics
  const { isTracking } = usePageAnalytics({
    enabled: shouldTrack && hasConsent,
    trackScrollDepth,
    trackSections,
    scrollThreshold: 25,
  });

  // Log en desarrollo
  useEffect(() => {
    console.log(
      `[PageAnalytics] ${isTracking ? 'Tracking' : 'Not tracking'} page: ${pathname}`
    );
    console.log('[PageAnalytics] Config:', {
      enabled,
      shouldTrack,
      excludePages: excludePages.map(p => p.toString()),
      trackScrollDepth,
      trackSections,
    });
  }, [isTracking, pathname, enabled, shouldTrack, excludePages, trackScrollDepth, trackSections]);

  // Este componente no renderiza nada
  return null;
}

/**
 * Configuración por defecto de páginas a excluir
 */
export const DEFAULT_EXCLUDED_PAGES = [
  /\/login$/i,
  /\/forgot-password$/i,
  /\/reset-password$/i,
  /\/admin/i,
  /\/api\//i,
];

/**
 * Componente con configuración por defecto
 */
export function DefaultPageAnalyticsTracker() {
  return (
    <PageAnalyticsTracker
      enabled={true} // Habilitado para desarrollo y producción
      excludePages={DEFAULT_EXCLUDED_PAGES}
      trackScrollDepth={true}
      trackSections={true}
    />
  );
}

