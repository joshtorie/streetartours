import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { City } from '../types';

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('Cities')
          .select(`
            id,
            name,
            description,
            image,
            coordinates
          `);

        if (error) throw error;
        setCities(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
}