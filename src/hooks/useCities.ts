import { useState, useEffect } from 'react';
import { City } from '../types';
import { cities as initialCities } from '../data/cities';

export function useCities() {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = (query: string) => {
    if (!query.trim()) {
      setCities(initialCities);
      return;
    }

    const filtered = initialCities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.description.toLowerCase().includes(query.toLowerCase())
    );
    setCities(filtered);
  };

  return {
    cities,
    loading,
    error,
    searchCities,
  };
}