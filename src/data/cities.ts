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
        tours: [
          {
            id: 'bushwick-artists',
            neighborhoodId: 'bushwick',
            name: 'Bushwick Artists Tour',
            description: 'Discover works by renowned street artists in Bushwick',
            duration: 90,
            distance: 2.5,
            type: 'ARTIST',
            artPieces: []
          },
          {
            id: 'bushwick-murals',
            neighborhoodId: 'bushwick',
            name: 'Colorful Murals Tour',
            description: 'Experience the most vibrant and colorful murals',
            duration: 60,
            distance: 1.8,
            type: 'STYLE',
            artPieces: []
          }
        ]
      },
      {
        id: 'williamsburg',
        cityId: 'nyc',
        name: 'Williamsburg',
        description: 'Hip neighborhood known for its innovative street art and galleries',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        coordinates: [-73.9573, 40.7064],
        tours: [
          {
            id: 'williamsburg-quick',
            neighborhoodId: 'williamsburg',
            name: 'Quick Street Art Walk',
            description: 'A quick tour of the best street art spots',
            duration: 45,
            distance: 1.2,
            type: 'DURATION',
            artPieces: []
          }
        ]
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
        tours: [
          {
            id: 'shoreditch-banksy',
            neighborhoodId: 'shoreditch',
            name: 'Banksy Trail',
            description: 'Follow the trail of Banksy\'s most famous works',
            duration: 120,
            distance: 3.0,
            type: 'ARTIST',
            artPieces: []
          },
          {
            id: 'shoreditch-stencil',
            neighborhoodId: 'shoreditch',
            name: 'Stencil Art Tour',
            description: 'Explore the best stencil art in Shoreditch',
            duration: 90,
            distance: 2.2,
            type: 'STYLE',
            artPieces: []
          }
        ]
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
        tours: [
          {
            id: 'fitzroy-contemporary',
            neighborhoodId: 'fitzroy',
            name: 'Contemporary Art Tour',
            description: 'Modern street art masterpieces in Fitzroy',
            duration: 150,
            distance: 4.0,
            type: 'STYLE',
            artPieces: []
          }
        ]
      }
    ]
  }
];