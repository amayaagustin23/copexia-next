'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for icon loading issues in Next.js
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined' && L.Icon.Default) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }
};

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markerTitle?: string;
  markerDescription?: string;
  className?: string;
}

export function Map({
  latitude,
  longitude,
  zoom = 15,
  markerTitle = 'Ubicación',
  markerDescription,
  className = '',
}: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setIsClient(true);

    // Trigger a resize event to ensure Leaflet calculates dimensions correctly
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground text-xs">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height: '100%', minHeight: '300px' }}>
      <MapContainer
        key={`${latitude}-${longitude}`}
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {(markerTitle || markerDescription) && (
            <Popup>
              <div className="p-1">
                {markerTitle && <div className="font-bold text-sm mb-1">{markerTitle}</div>}
                {markerDescription && <div className="text-xs text-muted-foreground">{markerDescription}</div>}
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
