import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://czpsmpprjiubqjxibpmx.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

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
