import { supabase } from './supabaseClient';

async function testSupabaseConnection() {
  try {
    // Test fetching cities
    const { data: cities, error: citiesError } = await supabase
      .from('Cities')
      .select('*')
      .limit(1);

    if (citiesError) {
      console.error('Error fetching cities:', citiesError);
    } else {
      console.log('Successfully fetched cities:', cities);
    }

    // Test fetching neighborhoods
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('Neighborhoods')
      .select('*')
      .limit(1);

    if (neighborhoodsError) {
      console.error('Error fetching neighborhoods:', neighborhoodsError);
    } else {
      console.log('Successfully fetched neighborhoods:', neighborhoods);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSupabaseConnection();
