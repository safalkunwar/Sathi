export type LatLng = {
  lat: number;
  lng: number;
};

export const MAP_CENTER: LatLng = {
  lat: 27.7172,
  lng: 85.324,
};

export const DEFAULT_ZOOM = 12;

export type MapMarker = {
  id: string;
  position: LatLng;
  title: string;
  subtitle?: string;
  type?: 'companion' | 'event' | 'partner';
};
