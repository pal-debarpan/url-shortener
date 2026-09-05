import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export const AuthCallbackPage = () => {
  const [error, setError] = useState(null);
  const { loginWithSupabase } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase client is not configured. Please set VITE_SUPABASE_ANON_KEY in frontend/.env.');
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        
        if (sessionError) throw sessionError;

        if (session && session.user) {
          await loginWithSupabase(session.user);
          navigate('/dashboard', { replace: true });
        } else {
          // Listen for state change in case session is set via hash params asynchronously
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession && currentSession.user) {
              await loginWithSupabase(currentSession.user);
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }
          });
        }
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        setError(err.message || 'Failed to authenticate with Google.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [loginWithSupabase, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background bg-grid-pattern text-on-background relative overflow-hidden p-gutter">
      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-center max-w-md w-full z-10 flex flex-col items-center">
        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-error-container/30 border border-error text-error flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-[28px]">error</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-background mb-xs">Authentication Failed</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">{error}</p>
            <p className="font-caption text-caption text-outline-variant">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="relative w-16 h-16 mb-md flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary-container/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <span className="material-symbols-outlined text-primary text-[28px]">key</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-background mb-xs">Completing Sign In</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Connecting your Google account with URLShawtie...</p>
          </>
        )}
      </div>
    </div>
  );
};
