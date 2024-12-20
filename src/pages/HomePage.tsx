import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/search/SearchBar';
import { CityCard } from '../components/city/CityCard';
import { useCities } from '../hooks/useCities';

export function HomePage() {
  const { cities, searchCities } = useCities();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchCities(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Street Art in Your City
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore curated tours of the best street art around the world
          </p>
          <SearchBar
            placeholder="Search for a city..."
            onSearch={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map(city => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </main>
    </div>
  );
}