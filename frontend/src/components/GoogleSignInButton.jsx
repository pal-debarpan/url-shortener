import React, { useState } from 'react';
import { signInWithGoogle } from '../services/supabase';

export const GoogleSignInButton = ({ label = 'Continue with Google', onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    if (onError) onError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      const msg = err.message || 'Failed to initialize Google Sign-In.';
      if (onError) {
        onError(msg);
      } else {
        alert(msg);
      }
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full bg-[#161616] hover:bg-[#222222] text-on-background border border-[#333333] hover:border-outline font-body-md font-medium rounded-xl py-[11px] px-md transition-all duration-200 flex items-center justify-center gap-3 group active:scale-[0.98] shadow-sm disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-on-background border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span className="text-on-background group-hover:text-primary transition-colors">
            {label}
          </span>
        </>
      )}
    </button>
  );
};
