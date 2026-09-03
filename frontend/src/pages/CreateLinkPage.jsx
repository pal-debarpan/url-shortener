import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUrl, formatErrorMessage } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { CreateLinkModal } from '../components/CreateLinkModal';
import { Toast } from '../components/Toast';

export const CreateLinkPage = () => {
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let targetUrl = originalUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      setLoading(true);
      const newUrl = await createUrl({
        original_url: targetUrl,
        custom_alias: customAlias.trim() || undefined,
      });
      setToast({ message: `Short link created: ${newUrl.short_code}`, type: 'success' });
      navigate(`/links/${newUrl.short_code}`);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md flex flex-col md:flex-row antialiased">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* SideNavBar (Desktop) */}
      <Sidebar onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-gutter md:p-margin max-w-[800px] w-full mx-auto flex flex-col min-h-screen">
        {/* Mobile TopAppBar */}
        <MobileHeader onOpenCreateModal={() => setIsModalOpen(true)} />

        <div className="flex items-center gap-2 text-on-surface-variant font-label-mono text-caption mb-4">
          <Link to="/links" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to My Links
          </Link>
          <span>/</span>
          <span className="text-on-surface">New Link</span>
        </div>

        <header className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight font-bold">
            Create Short Link
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Generate a fast redirect URL with an optional custom slug.
          </p>
        </header>

        <div className="bg-surface border border-outline-variant rounded-xl p-gutter md:p-margin">
          {error && (
            <div className="mb-md p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {/* Destination URL */}
            <div className="flex flex-col gap-base">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[11px] tracking-wider" htmlFor="create-dest-url">
                Destination URL *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px] pointer-events-none">
                  link
                </span>
                <input
                  id="create-dest-url"
                  type="text"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full bg-[#111111] border border-[#333333] text-on-background font-body-md rounded-xl pl-[40px] pr-sm py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                />
              </div>
            </div>

            {/* Custom Alias */}
            <div className="flex flex-col gap-base">
              <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[11px] tracking-wider" htmlFor="create-custom-alias">
                Custom Alias (Optional, 3-30 characters)
              </label>
              <div className="flex">
                <span className="bg-surface-container-low border border-[#333333] border-r-0 rounded-l-xl px-3 py-2.5 font-label-mono text-label-mono text-on-surface-variant flex items-center shrink-0">
                  shwt/
                </span>
                <input
                  id="create-custom-alias"
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="custom-alias"
                  pattern="^[a-zA-Z0-9_-]{3,30}$"
                  title="3 to 30 characters: letters, numbers, underscores, or hyphens"
                  className="w-full bg-[#111111] border border-[#333333] text-on-background font-label-mono text-label-mono rounded-r-xl px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-sm mt-sm">
              <Link
                to="/links"
                className="bg-transparent border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono text-label-mono py-2.5 px-5 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !originalUrl.trim()}
                id="create-page-submit-btn"
                className="bg-primary-container text-on-primary-container font-label-mono text-label-mono font-medium py-2.5 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create Link</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Modal fallback */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(newUrl) => navigate(`/links/${newUrl.short_code}`)}
      />
    </div>
  );
};
