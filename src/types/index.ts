export interface User {
  id: string;
  email: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  image: string;
  description: string;
  coordinates: [number, number];
  neighborhoods: Neighborhood[];
}

export interface Neighborhood {
  id: string;
  cityId: string;
  name: string;
  description: string;
  image: string;
  coordinates: [number, number];
  tours: Tour[];
}

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  description: string;
  image: string;
  coordinates: [number, number];
  year?: string;
  type: string[];
  duration: number; // in minutes
  audioGuide?: string;
  modelUrl?: string; // 3D model URL
  videoUrl?: string;
  merchandise: Merchandise[];
  ratings: Rating[];
}

export interface Merchandise {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
}

export interface Rating {
  userId: string;
  rating: number;
  comment?: string;
  date: string;
}

export interface Tour {
  id: string;
  neighborhoodId: string;
  name: string;
  description: string;
  duration: number;
  distance: number;
  artPieces: ArtPiece[];
  type: TourType;
}

export type TourType = 'ARTIST' | 'STYLE' | 'DURATION';