import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapPreviewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    subtitle?: string;
  }>;
  height?: string;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  center,
  zoom = 14,
  markers = [],
  height = '320px',
  onMarkerClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [staticMapUrl, setStaticMapUrl] = useState<string | null>(null);

  const buildStaticMapUrl = useCallback(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !center) return null;

    const centerStr = `${center.lat},${center.lng}`;
    const markerParams = markers
      .map(m => `color:0xC8A25E|${m.position.lat},${m.position.lng}`)
      .join('&markers=');

    const params = new URLSearchParams({
      center: centerStr,
      zoom: String(zoom),
      size: '600x320',
      maptype: 'roadmap',
      markers: markerParams,
      key: apiKey,
    });

    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
  }, [center, markers, zoom]);

  useEffect(() => {
    const url = buildStaticMapUrl();
    setStaticMapUrl(url);
  }, [buildStaticMapUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl border border-[#2A2D31] overflow-hidden bg-[#17191C] ${className}`}
      style={{ height }}
    >
      {staticMapUrl ? (
        <img
          src={staticMapUrl}
          alt="Map preview"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#8E9299] p-4 text-center">
          <MapPin className="w-8 h-8 text-[#C8A25E]" />
          <p className="text-sm font-medium">Map preview</p>
          <p className="text-xs">Add VITE_GOOGLE_MAPS_API_KEY to enable interactive maps.</p>
        </div>
      )}

      {markers.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex flex-wrap gap-2">
            {markers.slice(0, 5).map(marker => (
              <button
                key={marker.id}
                onClick={() => onMarkerClick?.(marker.id)}
                className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-xs text-white hover:bg-[#C8A25E]/20 hover:border-[#C8A25E]/50 transition-colors"
              >
                <Navigation className="w-3 h-3 text-[#C8A25E]" />
                <span className="truncate max-w-[120px]">{marker.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
