import { City } from '../types';

export const cities: City[] = [
  {
    id: 'nyc',
    name: 'New York City',
    description: 'Explore the vibrant street art scene across the five boroughs',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    coordinates: [-74.006, 40.7128]
  },
  {
    id: 'london',
    name: 'London',
    description: 'Discover hidden murals and graffiti in East London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    coordinates: [-0.1276, 51.5074]
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    description: 'Walk through the famous laneways filled with street art',
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144',
    coordinates: [144.9631, -37.8136]
  }
];