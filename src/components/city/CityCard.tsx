import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { City } from '../../types';

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link
      to={`/cities/${city.id}`}
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        <div className="absolute bottom-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5" />
            <h3 className="text-2xl font-bold">{city.name}</h3>
          </div>
          <p className="text-sm text-gray-200">{city.description}</p>
        </div>
      </div>
    </Link>
  );
}