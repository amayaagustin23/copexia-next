'use client';

import { analyticsService } from '@/lib/services/analyticsService';
import type { PageInteraction } from '@/types/analytics';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// --- Constants & Helpers ---
const SESSION_ID_KEY = 'analytics_session_id';
const SESSION_START_TIME_KEY = 'analytics_session_start_time';

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

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// --- Main Hook ---
export function usePageAnalytics(options: UsePageAnalyticsOptions = {}) {
  const {
    enabled = true,
    trackScrollDepth = true,
    trackSections = true,
    scrollThreshold = 25,
  } = options;

  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string>('');
  const [currentFullPath, setCurrentFullPath] = useState<string>(''); // Pathname + Hash
  const [isTracking, setIsTracking] = useState(false);

  // Refs for session metrics (mutable without re-render)
  // Refs for logic
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const sectionsViewedRef = useRef<Set<string>>(new Set());
  const interactionsRef = useRef<PageInteraction[]>([]);
  const lastScrollRef = useRef<number>(0);
  const isNewSessionRef = useRef<boolean>(true); // Default to true until checked

  // --- Session Initialization (Once) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!enabled) return; // STRICT CHECK

    let storedId = localStorage.getItem(SESSION_ID_KEY);
    const storedStart = localStorage.getItem(SESSION_START_TIME_KEY);

    // Validate expiration (30 mins)
    if (storedId && storedStart) {
      const duration = Date.now() - parseInt(storedStart, 10);
      if (duration > 30 * 60 * 1000) {
        console.log('[Analytics] Session expired. Generating new one.');
        storedId = null;
      }
    }

    if (!storedId) {
      // NEW SESSION
      storedId = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, storedId);
      localStorage.setItem(SESSION_START_TIME_KEY, Date.now().toString());
      startTimeRef.current = Date.now();
      isNewSessionRef.current = true; // Mark as new -> Needs POST
    } else {
      // EXISTING SESSION
      if (storedStart) startTimeRef.current = parseInt(storedStart, 10);
      isNewSessionRef.current = false; // Mark as existing -> Skip POST
    }

    setSessionId(storedId);
    console.log('[Analytics] Session ID:', storedId, '| Is New?', isNewSessionRef.current);
  }, [enabled]);


  // --- Helper: Get Device Info ---
  const getDeviceInfo = useCallback((): DeviceInfo => {
    const ua = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const isTablet = /Tablet|iPad/i.test(ua);
    return {
      type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      browser: ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : 'Unknown', // Simplified
      os: ua.includes('Mac') ? 'macOS' : ua.includes('Windows') ? 'Windows' : 'Unknown',
    };
  }, []);


  // --- Core Action: Start Session (Create Visit/PageView) ---
  const startSession = useCallback(async (path: string) => {
    if (!enabled || !sessionId) return;

    console.log('🚀 [Analytics] STARTING Page Context:', path);

    // Reset metrics for the NEW PAGE VIEW context
    startTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    sectionsViewedRef.current.clear();
    interactionsRef.current = [];

    // CONDITIONAL POST: Only if it's a completely new session (not in localStorage)
    if (isNewSessionRef.current) {
      console.log('📡 [Analytics] New Session -> Sending POST /visits');

      const visitData = {
        sessionId: sessionId,
        page: path,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        deviceInfo: getDeviceInfo(),
        screenInfo: {
          resolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
        },
        language: navigator.language,
      };

      try {
        const res = await analyticsService.trackPageVisit(visitData);
        if (res.success) {
          setIsTracking(true);
          // After successful creation, treating as existing for future navigations?
          // Actually, user said: "si ya existe... no mande el post".
          // So subsequent navigations (change url) should ALSO skip POST?
          // Yes. Because "ya existe en localstorage".
          isNewSessionRef.current = false;
        } else {
          console.error('[Analytics] POST Failed:', res.error);
        }
      } catch (e) {
        console.error('[Analytics] Error POST:', e);
      }
    } else {
      console.log('⏩ [Analytics] Session Exists -> Skipping POST. Metrics will be sent on Update (PUT).');
      setIsTracking(true);
    }
  }, [enabled, sessionId, getDeviceInfo]);


  // --- Core Action: End Session (Update Metrics) ---
  const endSession = useCallback(async (sid: string) => {
    if (!sid || !enabled) return;

    console.log('💾 [Analytics] SYNCING SESSION METRICS (Update) ID:', sid);

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const payload = {
      sessionId: sid,
      exitTime: new Date().toISOString(),
      duration,
      scrollDepth: maxScrollDepthRef.current,
      sectionsViewed: Array.from(sectionsViewedRef.current),
      interactions: interactionsRef.current,
    };

    try {
      await analyticsService.updatePageSession(payload);
    } catch (e) {
      console.error('[Analytics] Failed to sync session metrics:', e);
    }
  }, []);

  // Beacon for unload
  const sendBeacon = useCallback((sid: string) => {
    if (!enabled) return;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const payload = {
      sessionId: sid,
      exitTime: new Date().toISOString(),
      duration,
      scrollDepth: maxScrollDepthRef.current,
      sectionsViewed: Array.from(sectionsViewedRef.current),
      interactions: interactionsRef.current,
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:9000/api/v1';
    navigator.sendBeacon(`${apiBaseUrl}/analytics/sessions/${sid}`, blob);
  }, []);


  // --- Navigation & Scroll Logic ---

  const lastTrackedPathRef = useRef<string>('');

  // 1. Listen to Router Path Changes (Real Navigation: / -> /blog)
  useEffect(() => {
    if (!sessionId || !enabled) return;

    // Current Router Path
    const targetPath = pathname; // We ignore Hash from router, we handle it in ScrollSpy or initial load if needed

    // Check if we truly changed "Page" (ignoring internal section changes for a moment)
    // If we are moving from /home#services to /blog, we must trigger.
    // If we are just refreshing /home, we might not need to?
    // But this effect runs on Mount too.

    // We want to verify against the "Base" path of the last tracking.
    // Or simply: If pathname changes, we Force a new session/view.

    const currentBase = lastTrackedPathRef.current.split('#')[0];

    // Trigger only if Pathname differs or Initial Load (empty ref)
    if (targetPath !== currentBase || lastTrackedPathRef.current === '') {

      // Validate if we aren't already tracking this exact path (e.g. strict react re-render)
      if (lastTrackedPathRef.current === targetPath) return;

      // End previous
      if (lastTrackedPathRef.current) {
        endSession(sessionId);
      }

      // Start New
      // Check if there is a hash initially? 
      // Window location hash might be available on mount.
      let initialPath = targetPath;
      if (typeof window !== 'undefined' && window.location.hash) {
        initialPath += window.location.hash;
      }

      console.log('[Analytics] Router Navigation ->', initialPath);
      lastTrackedPathRef.current = initialPath;
      setCurrentFullPath(initialPath); // Keep state for UI if needed
      startSession(initialPath);
    }
  }, [pathname, sessionId, startSession, endSession]);


  const transitionTimer = useRef<NodeJS.Timeout | null>(null);

  // 2. Scroll Spy (Virtual Navigation) & Metrics
  const handleScroll = useCallback(() => {
    if (!sessionId) return;

    const now = Date.now();
    // Throttle scroll processing
    if (now - lastScrollRef.current < 100) return;
    lastScrollRef.current = now;

    // Scroll Depth
    if (trackScrollDepth) {
      const sc = calculateScrollDepth();
      if (sc > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = sc;
        if (sc >= scrollThreshold && sc % scrollThreshold === 0) {
          trackInteraction('scroll', `${sc}%`);
        }
      }
    }

    // Section Detection & Hash Navigation
    if (trackSections) {
      const sections = document.querySelectorAll('section[id]');
      let activeId = '';
      const scrollY = window.scrollY;
      const offset = 120;

      sections.forEach((sec) => {
        const top = (sec as HTMLElement).offsetTop;
        const height = (sec as HTMLElement).offsetHeight;
        if (scrollY >= top - offset && scrollY < top + height - offset) {
          activeId = sec.id;
        }
      });

      const intendedHash = activeId ? `#${activeId}` : '';
      const intendedPath = pathname + intendedHash;

      // Check if we logically changed section/page
      if (intendedPath !== lastTrackedPathRef.current) {

        // Clear any pending transition (Debounce)
        if (transitionTimer.current) clearTimeout(transitionTimer.current);

        // Start Timer: User must settle on this section for 1000ms
        transitionTimer.current = setTimeout(() => {
          if (intendedPath !== lastTrackedPathRef.current) {
            console.log('[Analytics] Section Change Detected (Debounced) ->', intendedPath);

            // 1. End Previous Context
            endSession(sessionId);

            // 2. Update Ref & State
            lastTrackedPathRef.current = intendedPath;
            setCurrentFullPath(intendedPath);

            // 3. Start New Context
            startSession(intendedPath);
          }
        }, 1000);

      } else {
        // We are stable on the current track, ensure no pending timer exists
        if (transitionTimer.current) {
          clearTimeout(transitionTimer.current);
          transitionTimer.current = null;
        }
      }

      // Track "Section Viewed" event (metadata only)
      if (activeId && !sectionsViewedRef.current.has(activeId)) {
        sectionsViewedRef.current.add(activeId);
        trackInteraction('section_view', activeId);
      }
    }
  }, [trackScrollDepth, trackSections, sessionId, pathname, startSession, endSession, scrollThreshold]);


  // Setup Scroll Listener
  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, handleScroll]);

  // Handle BeforeUnload
  useEffect(() => {
    const onUnload = () => {
      if (sessionId) sendBeacon(sessionId);
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [sessionId, sendBeacon]);

  // Interaction Helper
  const trackInteraction = (type: PageInteraction['type'], target: string, metadata?: any) => {
    interactionsRef.current.push({
      type,
      target,
      timestamp: new Date().toISOString(),
      metadata,
    });
  };

  return {
    sessionId,
    isTracking,
    trackButtonClick: (id: string, text?: string) => trackInteraction('button_click', id, { text }),
    trackFormSubmit: (id: string) => trackInteraction('form_submit', id),
    trackInteraction,
    clearSession: () => {
      localStorage.removeItem(SESSION_ID_KEY);
      setSessionId('');
    }
  };
}

function calculateScrollDepth(): number {
  if (typeof window === 'undefined') return 0;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const trackLength = documentHeight - windowHeight;
  return trackLength <= 0 ? 100 : Math.min(Math.round((scrollTop / trackLength) * 100), 100);
}

