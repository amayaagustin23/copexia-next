'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

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
    // Asegurarse de que solo se renderice en el cliente
    setIsClient(true);

    // Fix para los iconos de Leaflet en Next.js
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      // Forzar redimensionamiento del mapa después de que se carga
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <div
        className={`relative rounded-lg overflow-hidden ${className} bg-muted/30 flex items-center justify-center`}
      >
        <p className="text-muted-foreground text-sm">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {(markerTitle || markerDescription) && (
            <Popup>
              {markerTitle && (
                <div className="font-semibold text-sm">{markerTitle}</div>
              )}
              {markerDescription && (
                <div className="text-xs mt-1">{markerDescription}</div>
              )}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
