import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqykyqbffwxlkgvqshnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeWt5cWJmZnd4bGtndnFzaG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTAyNjEsImV4cCI6MjA5ODU2NjI2MX0.9_l_7-3GN29iMfY-lCpl1fNWeiWwD0gZdakSS_KmxQc';

export const supabase = createClient(supabaseUrl, supabaseKey);
