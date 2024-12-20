// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and public API key
const supabaseUrl = 'https://bckufhwabrscilsqcwnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJja3VmaHdhYnJzY2lsc3Fjd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3Mzc5MDksImV4cCI6MjA1MDMxMzkwOX0.lNDNd2V5pNLBojave3jSUkK2OII9Vl2cq-ZfZi0XKvw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);