import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased bg-background bg-grid-pattern selection:bg-primary-container selection:text-on-primary-container justify-between">
      <main className="flex-grow flex items-center justify-center p-gutter relative overflow-hidden w-full">
        {/* Atmospheric Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="w-full max-w-[420px] z-10">
          {/* Header Section */}
          <div className="text-center mb-lg">
            <Link to="/" className="inline-block">
              <h1 className="font-display text-display text-primary mb-xs tracking-tight">URLShawtie</h1>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your developer console</p>
          </div>

          {/* Card Container */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            {isExpired && (
              <div className="mb-md p-3 bg-primary-container/20 border border-primary text-primary rounded-xl font-body-md text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}

            {error && (
              <div className="mb-md p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              {/* Email Input */}
              <div className="flex flex-col gap-base">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px]" htmlFor="login-email">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@urlshawtie.com"
                    className="w-full bg-[#111111] border border-[#333333] text-on-background font-body-md rounded-xl pl-[40px] pr-sm py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none placeholder:text-outline-variant/50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-base">
                <div className="flex justify-between items-center">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px]" htmlFor="login-password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111111] border border-[#333333] text-on-background font-body-md rounded-xl pl-[40px] pr-sm py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none placeholder:text-outline-variant/50"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="w-full bg-primary-container text-on-primary-container font-label-mono text-label-mono font-bold rounded-xl py-[10px] px-gutter mt-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-sm my-md">
              <div className="flex-grow h-px bg-outline-variant/40"></div>
              <span className="font-caption text-caption text-outline-variant">OR</span>
              <div className="flex-grow h-px bg-outline-variant/40"></div>
            </div>

            {/* Secondary Action */}
            <div className="text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  id="link-to-signup"
                  className="text-primary hover:text-primary-fixed underline decoration-primary/30 hover:decoration-primary transition-colors ml-xs"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant w-full py-lg px-gutter flex justify-between items-center max-w-[1200px] mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row items-center gap-md md:gap-xl w-full justify-between text-center md:text-left">
          <div className="font-label-mono text-label-mono font-bold text-primary">
            URLShawtie
          </div>
          <div className="font-caption text-caption text-on-surface-variant">
            © 2024 URLShawtie. Built for developers.
          </div>
        </div>
      </footer>
    </div>
  );
};
