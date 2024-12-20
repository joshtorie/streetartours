import { City } from '../types';

export const cities: City[] = [
  {
    id: 'nyc',
    name: 'New York City',
    description: 'Explore the vibrant street art scene across the five boroughs',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    coordinates: [-74.006, 40.7128],
    neighborhoods: [
      {
        id: 'bushwick',
        cityId: 'nyc',
        name: 'Bushwick',
        description: 'Brooklyn\'s street art mecca with colorful murals around every corner',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        coordinates: [-73.9229, 40.6958],
        tours: []
      },
      {
        id: 'williamsburg',
        cityId: 'nyc',
        name: 'Williamsburg',
        description: 'Hip neighborhood known for its innovative street art and galleries',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        coordinates: [-73.9573, 40.7064],
        tours: []
      }
    ]
  },
  {
    id: 'london',
    name: 'London',
    description: 'Discover hidden murals and graffiti in East London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    coordinates: [-0.1276, 51.5074],
    neighborhoods: [
      {
        id: 'shoreditch',
        cityId: 'london',
        name: 'Shoreditch',
        description: 'London\'s premier destination for street art and urban culture',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        coordinates: [-0.0766, 51.5229],
        tours: []
      }
    ]
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    description: 'Walk through the famous laneways filled with street art',
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144',
    coordinates: [144.9631, -37.8136],
    neighborhoods: [
      {
        id: 'fitzroy',
        cityId: 'melbourne',
        name: 'Fitzroy',
        description: 'Melbourne\'s oldest suburb known for its artistic expression',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        coordinates: [144.9789, -37.7963],
        tours: []
      }
    ]
  }
];