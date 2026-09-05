import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://czpsmpprjiubqjxibpmx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHNtcHByaml1YnFqeGlicG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTQ3ODMsImV4cCI6MjEwMzQ5MDc4M30.UCtfY50PtkmCw21130qParUW0E4eAYKsmUzAeqOieVk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey === 'your_supabase_anon_key_here' || 
  !supabaseAnonKey.startsWith('ey');

const createSafeClient = () => {
  if (isPlaceholderKey) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const supabase = createSafeClient();

export const signInWithGoogle = async () => {
  if (isPlaceholderKey || !supabase) {
    throw new Error(
      'Supabase Anon Key is missing or invalid. Please set a valid VITE_SUPABASE_ANON_KEY in frontend/.env to enable Google Authentication.'
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};
