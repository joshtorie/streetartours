import React from 'react';
import { City } from '../types';
import { MapIcon } from 'lucide-react';

interface CitySelectorProps {
  cities: City[];
  onSelectCity: (city: City) => void;
}

export function CitySelector({ cities, onSelectCity }: CitySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cities.map((city) => (
        <button
          key={city.id}
          onClick={() => onSelectCity(city)}
          className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div className="absolute bottom-0 p-6 text-white">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                <h3 className="text-2xl font-bold">{city.name}</h3>
              </div>
              <p className="mt-2">{city.neighborhoods.length} neighborhoods</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}