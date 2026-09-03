import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage } from '../services/api';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signup({ email: email.trim(), password });
      navigate('/dashboard', { replace: true });
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

        <div className="w-full max-w-md z-10">
          {/* Brand Header */}
          <div className="text-center mb-lg">
            <Link to="/" className="inline-block">
              <h1 className="font-display text-display text-primary tracking-tight">URLShawtie</h1>
            </Link>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Built for developers.</p>
          </div>

          {/* Sign Up Form Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm">
            <h2 className="font-headline-md text-headline-md mb-md font-bold">Create an account</h2>

            {error && (
              <div className="mb-md p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-md">
              {/* Email Field */}
              <div>
                <label className="block font-label-mono text-label-mono text-on-surface-variant mb-base uppercase tracking-wider text-[11px]" htmlFor="signup-email">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl text-on-background px-sm py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md placeholder:text-outline-variant/50"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-label-mono text-label-mono text-on-surface-variant mb-base uppercase tracking-wider text-[11px]" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl text-on-background px-sm py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md placeholder:text-outline-variant/50"
                />

                {/* Password Requirements */}
                <div className="mt-sm space-y-xs font-caption text-caption text-on-surface-variant">
                  <div className={`flex items-center gap-xs ${isMinLength ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {isMinLength ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>At least 8 characters long</span>
                  </div>
                  <div className={`flex items-center gap-xs ${hasNumberOrSymbol ? 'text-primary' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {hasNumberOrSymbol ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Contains a number or symbol</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block font-label-mono text-label-mono text-on-surface-variant mb-base uppercase tracking-wider text-[11px]" htmlFor="signup-confirm-password">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  name="confirm_password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl text-on-background px-sm py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md placeholder:text-outline-variant/50"
                />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                id="signup-submit-btn"
                className="w-full bg-primary-container text-on-primary-container rounded-xl py-2.5 px-md font-body-lg text-body-lg font-medium hover:bg-primary-fixed active:scale-[0.98] transition-all mt-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create account</span>
                )}
              </button>
            </form>
          </div>

          {/* Secondary Action */}
          <div className="text-center mt-lg font-body-md text-body-md text-on-surface-variant">
            <span>Already have an account? </span>
            <Link
              to="/login"
              id="link-to-login"
              className="text-primary hover:text-primary-fixed hover:underline transition-colors"
            >
              Sign in
            </Link>
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
