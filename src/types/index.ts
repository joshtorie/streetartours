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
  coordinates: any; // Using any for now as it's a PostGIS geometry type
  neighborhoods: Neighborhood[];
}

export interface Neighborhood {
  id: string;
  city_id: string; // Changed to match database column name
  name: string;
  description: string;
  image: string;
  coordinates: any; // Using any for now as it's a PostGIS geometry type
  tours: Tour[];
}

export interface Artist {
  id: string;
  name: string;
  instagram: string;
}

export interface ArtPiece {
  id: string;
  tour_id: string; // Changed to match database column name
  artist_id: string; // Changed to match database column name
  image: string;
  video: string;
  audio: string;
  description: string;
}

export interface Tour {
  id: string;
  neighborhood_id: string; // Changed to match database column name
  name: string;
  description: string;
  duration: number;
  distance: number;
  type: TourType;
  art_pieces?: ArtPiece[]; // Optional as it might be included in joins
}

export type TourType = 'ARTIST' | 'STYLE' | 'DURATION';