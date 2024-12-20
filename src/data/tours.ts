import { City } from '../types';

export const cities: City[] = [
  {
    id: 'nyc',
    name: 'New York City',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    neighborhoods: [
      {
        id: 'soho',
        name: 'SoHo',
        description: 'Historic cast-iron architecture and boutique shopping',
        image: 'https://images.unsplash.com/photo-1555529211-3237f6e13d33',
        tours: [
          {
            id: 'soho-art',
            name: 'SoHo Art & Architecture Walk',
            description: 'Discover the artistic heritage and architectural marvels of SoHo',
            duration: '2 hours',
            distance: '1.5 miles',
            steps: [
              {
                id: '1',
                title: 'Start: Broadway & Houston',
                description: 'Begin at the intersection of Broadway and Houston Street, the gateway to SoHo',
                location: { lat: 40.725, lng: -73.997 },
                image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620'
              },
              {
                id: '2',
                title: 'Cast Iron District',
                description: 'Explore the largest collection of cast-iron architecture in the world',
                location: { lat: 40.724, lng: -73.999 },
                image: 'https://images.unsplash.com/photo-1518481852452-9415b262eba4'
              }
            ]
          }
        ]
      }
    ]
  }
];