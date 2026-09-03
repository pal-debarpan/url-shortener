import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUrl, formatErrorMessage } from '../services/api';
import { Toast } from '../components/Toast';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (!isAuthenticated) {
      // Direct unauthenticated user to signup with intent
      navigate('/signup', { state: { initialUrl: url, initialAlias: alias } });
      return;
    }

    setError(null);
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      setLoading(true);
      const res = await createUrl({
        original_url: targetUrl,
        custom_alias: alias.trim() || undefined,
      });
      setCreatedResult(res);
      setUrl('');
      setAlias('');
      setToast({ message: 'Short URL created successfully!', type: 'success' });
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Copied short URL to clipboard!', type: 'success' });
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col font-body-lg">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Navigation */}
      <header className="w-full px-gutter h-16 max-w-[1200px] mx-auto flex justify-between items-center border-b border-outline-variant/30 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-[24px]">link</span>
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">URLShawtie</span>
        </Link>
        <nav className="hidden md:flex gap-md">
          <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#features">
            Features
          </a>
          <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#how-it-works">
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-sm">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              id="nav-dashboard-link"
              className="font-label-mono text-label-mono bg-primary-container text-on-primary-container px-4 py-1.5 rounded-xl hover:bg-inverse-primary transition-colors font-medium flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Console
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                id="nav-login-link"
                className="font-label-mono text-label-mono text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5 border border-outline-variant/50 rounded-xl hover:border-outline-variant"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                id="nav-signup-link"
                className="font-label-mono text-label-mono bg-primary-container text-on-primary-container px-4 py-1.5 rounded-xl hover:bg-inverse-primary transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow w-full relative">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-gutter flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="z-10 max-w-3xl mx-auto space-y-lg">
            <div className="space-y-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/50 bg-surface-container-low/50 mb-4 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="font-label-mono text-caption text-on-surface-variant uppercase tracking-wider">v2.0 is now live</span>
              </div>
              <h1 className="font-display text-display text-on-surface leading-tight">
                Short links.<br />
                <span className="text-on-surface-variant">Simple tracking.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
                Create short URLs, customize aliases, and track clicks with developer-focused precision. Fast, minimal, and built for modern teams.
              </p>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="max-w-2xl mx-auto p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm text-left flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Shorten Action Form */}
            <form
              onSubmit={handleShorten}
              className="w-full max-w-2xl mx-auto mt-8 relative group input-glow transition-all duration-300 rounded-xl bg-surface-container-low border border-outline-variant/50 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="flex items-center flex-grow px-2">
                <span className="material-symbols-outlined text-outline-variant mr-2 text-[20px]">link</span>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste long URL..."
                  className="flex-grow bg-transparent border-none text-on-surface font-label-mono text-body-md focus:ring-0 focus:outline-none placeholder:text-outline-variant/60"
                />
              </div>

              {/* Alias Input (Optional) */}
              <div className="flex items-center border-t sm:border-t-0 sm:border-l border-outline-variant/30 px-3 py-1 sm:py-0 h-9">
                <span className="text-outline-variant font-label-mono text-caption mr-1">/</span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="custom-alias"
                  className="w-full sm:w-28 bg-transparent border-none text-on-surface font-label-mono text-body-md focus:ring-0 focus:outline-none placeholder:text-outline-variant/40 px-0"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                id="hero-shorten-btn"
                className="bg-primary-container text-on-primary-container font-label-mono text-label-mono px-6 py-2.5 rounded-xl hover:bg-inverse-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-medium shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Shorten</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Created Result Card */}
            {createdResult && (
              <div className="max-w-2xl mx-auto mt-4 p-4 bg-surface border border-primary/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left animate-in fade-in duration-200">
                <div className="overflow-hidden">
                  <div className="font-label-mono text-label-mono text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <a href={createdResult.short_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {createdResult.short_url}
                    </a>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant truncate mt-1">
                    {createdResult.original_url}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(createdResult.short_url)}
                    className="bg-surface-container-high text-on-surface hover:text-primary border border-outline-variant px-3 py-1.5 rounded-xl font-label-mono text-caption flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    Copy
                  </button>
                  <Link
                    to={`/links/${createdResult.short_code}`}
                    className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-xl font-label-mono text-caption flex items-center gap-1 transition-colors hover:opacity-90 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                    Stats
                  </Link>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 font-label-mono text-caption text-outline-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                Lightning fast
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
                Secure JWT Auth
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">api</span>
                REST API ready
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-xl px-gutter max-w-[1200px] mx-auto" id="features">
          <div className="mb-12 text-center md:text-left">
            <span className="font-label-mono text-caption text-primary uppercase tracking-wider mb-2 block">Features</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Everything you need, nothing you don't.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 hover:border-outline-variant transition-colors group flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center mb-6 group-hover:bg-primary-container/10 group-hover:border-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-[24px]">bolt</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Fast Shortening</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Instant redirect generation with minimal latency, powered by high-performance FastAPI backends.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 hover:border-outline-variant transition-colors group flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center mb-6 group-hover:bg-primary-container/10 group-hover:border-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-[24px]">edit</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Custom Aliases</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Create memorable links with custom back-halves while preventing naming conflicts automatically.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 hover:border-outline-variant transition-colors group flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center mb-6 group-hover:bg-primary-container/10 group-hover:border-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-on-surface group-hover:text-primary transition-colors text-[24px]">query_stats</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Click Tracking</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Real-time click counters for every shortened URL you manage, stored securely in PostgreSQL.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Linear Flow) */}
        <section className="py-xl px-gutter bg-surface-container-lowest/30 border-y border-outline-variant/20" id="how-it-works">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-16">Simple Workflow.</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low border-2 border-outline-variant/30 flex items-center justify-center mb-4 text-on-surface font-label-mono">01</div>
                <h4 className="font-headline-md text-body-lg font-medium text-on-surface mb-1">Paste</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[200px]">Drop your long, unwieldy URL into the input field.</p>
              </div>
              {/* Connector */}
              <div className="hidden md:block flex-shrink-0 w-16 h-[1px] bg-outline-variant/50 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-outline-variant/50 rotate-45"></div>
              </div>
              <span className="md:hidden material-symbols-outlined text-outline-variant">arrow_downward</span>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low border-2 border-primary/50 text-primary flex items-center justify-center mb-4 font-label-mono shadow-[0_0_15px_rgba(174,198,255,0.1)]">02</div>
                <h4 className="font-headline-md text-body-lg font-medium text-on-surface mb-1">Create</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[200px]">Add an optional alias and hit shorten. Done instantly.</p>
              </div>
              {/* Connector */}
              <div className="hidden md:block flex-shrink-0 w-16 h-[1px] bg-outline-variant/50 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-outline-variant/50 rotate-45"></div>
              </div>
              <span className="md:hidden material-symbols-outlined text-outline-variant">arrow_downward</span>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-low border-2 border-outline-variant/30 flex items-center justify-center mb-4 text-on-surface font-label-mono">03</div>
                <h4 className="font-headline-md text-body-lg font-medium text-on-surface mb-1">Share</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[200px]">Copy to clipboard and track every real visitor redirection.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto border-t border-outline-variant/30 bg-background">
        <div className="font-label-mono text-label-mono font-bold text-primary mb-4 md:mb-0">
          URLShawtie
        </div>
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <span className="font-caption text-caption text-on-surface-variant">Developer Console</span>
          <span className="font-caption text-caption text-on-surface-variant">FastAPI + React</span>
        </div>
        <div className="font-caption text-caption text-on-surface-variant">
          © 2024 URLShawtie. Built for developers.
        </div>
      </footer>
    </div>
  );
};
