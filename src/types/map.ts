export interface ArtLocation {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  coordinates: [number, number];
  year?: string;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}