'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markerTitle?: string;
  markerDescription?: string;
  className?: string;
}

/**
 * A robust Leaflet map component for Next.js.
 * Uses a native Leaflet implementation to avoid common hydration and lifecycle issues with react-leaflet.
 */
export function Map({
  latitude,
  longitude,
  zoom = 15,
  markerTitle = 'Ubicación',
  markerDescription,
  className = '',
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  useEffect(() => {
    // Ensure we are in a browser environment
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isCancelled = false;

    const initMap = async () => {
      // Dynamic import to prevent SSR issues
      const L = (await import('leaflet')).default;

      if (isCancelled || !mapRef.current) return;

      // Clean up previous instance if it exists
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }

      // Fix for default Leaflet marker icons in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      try {
        // Create map instance
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
          touchZoom: true,
        });

        leafletInstance.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Add a marker
        const marker = L.marker([latitude, longitude]).addTo(map);

        if (markerTitle || markerDescription) {
          const popupContent = `
            <div style="font-family: inherit; padding: 4px;">
              <h5 style="margin: 0 0 4px 0; font-weight: 700; font-size: 14px;">${markerTitle}</h5>
              ${markerDescription ? `<p style="margin: 0; font-size: 12px; color: #666; line-height: 1.4;">${markerDescription}</p>` : ''}
            </div>
          `;
          marker.bindPopup(popupContent, { closeButton: false });
          marker.openPopup();
        }

        // Force a resize calculation to fix partial loading/rendering bugs
        setTimeout(() => {
          if (!isCancelled && map) {
            map.invalidateSize();
          }
        }, 300);

      } catch (error) {
        console.error('Error initializing Leaflet map:', error);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [latitude, longitude, zoom, markerTitle, markerDescription]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-lg bg-muted/20 border border-border/50 overflow-hidden shadow-inner ${className}`}
      style={{ minHeight: '180px', height: '100%' }}
    />
  );
}
