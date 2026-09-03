import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUrls, createUrl, formatErrorMessage } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { CreateLinkModal } from '../components/CreateLinkModal';
import { Toast } from '../components/Toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Creation form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUrls();
      setLinks(data || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    let targetUrl = originalUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      setSubmitting(true);
      const newUrl = await createUrl({
        original_url: targetUrl,
        custom_alias: customAlias.trim() || undefined,
      });
      setOriginalUrl('');
      setCustomAlias('');
      setLinks((prev) => [newUrl, ...prev]);
      setToast({ message: `Short link created: ${newUrl.short_code}`, type: 'success' });
    } catch (err) {
      setFormError(formatErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (shortUrl, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(shortUrl);
    setToast({ message: 'Copied link to clipboard!', type: 'success' });
  };

  const handleModalCreated = (newUrl) => {
    setLinks((prev) => [newUrl, ...prev]);
    setToast({ message: `Short link created: ${newUrl.short_code}`, type: 'success' });
  };

  const recentLinks = links.slice(0, 5);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar for Desktop */}
      <Sidebar onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Mobile Top App Bar */}
      <MobileHeader onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col max-w-[1200px] w-full min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-outline-variant flex items-center justify-between px-margin sticky top-0 bg-background/90 backdrop-blur-sm z-30">
          <h2 className="font-headline-md text-headline-md text-on-background font-bold">Dashboard</h2>
          <div className="flex items-center gap-sm">
            <span className="font-label-mono text-label-mono text-on-surface-variant">
              {user?.email || 'developer@urlshawtie.com'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-surface-container-highest border border-outline-variant flex items-center justify-center overflow-hidden text-primary font-bold">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <div className="p-margin flex flex-col gap-lg flex-1">
          {/* Bento Creation Card */}
          <section className="bg-surface border border-outline-variant rounded-xl p-margin flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-on-background font-semibold">Create a short link</h3>

            {formError && (
              <div className="p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-sm w-full items-start md:items-end">
              {/* Long URL */}
              <div className="flex-1 flex flex-col gap-base w-full">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[10px] tracking-wider" htmlFor="dash-long-url">
                  Destination URL *
                </label>
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    link
                  </span>
                  <input
                    id="dash-long-url"
                    type="text"
                    required
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://very-long-url.com/path/to/resource"
                    className="w-full bg-[#111111] border border-[#333333] text-on-background rounded-xl font-body-md pl-10 pr-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Custom Alias */}
              <div className="w-full md:w-64 flex flex-col gap-base">
                <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[10px] tracking-wider" htmlFor="dash-custom-alias">
                  Custom Alias (Optional)
                </label>
                <div className="flex">
                  <span className="bg-surface-container-low border border-[#333333] border-r-0 rounded-l-xl px-3 py-2 font-label-mono text-label-mono text-on-surface-variant flex items-center shrink-0">
                    shwt/
                  </span>
                  <input
                    id="dash-custom-alias"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="alias"
                    pattern="^[a-zA-Z0-9_-]{3,30}$"
                    title="3-30 letters, numbers, hyphens or underscores"
                    className="w-full bg-[#111111] border border-[#333333] text-on-background rounded-r-xl font-label-mono text-label-mono px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !originalUrl.trim()}
                id="dash-create-btn"
                className="w-full md:w-auto bg-primary-container text-on-primary-container font-label-mono text-label-mono px-gutter py-2 rounded-xl whitespace-nowrap hover:opacity-90 active:scale-[0.98] transition-all h-[42px] flex items-center justify-center font-medium disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Create</span>
                )}
              </button>
            </form>
          </section>

          {/* Recent Activity List */}
          <section className="flex flex-col gap-md mt-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-body-lg text-body-lg font-medium text-on-background">Recent Activity</h3>
              <Link to="/links" id="view-all-links" className="font-label-mono text-label-mono text-primary hover:underline flex items-center gap-1">
                <span>View all</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {loading ? (
              <div className="p-8 border border-outline-variant rounded-xl bg-surface flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-label-mono text-caption text-on-surface-variant">Loading links...</span>
              </div>
            ) : error ? (
              <div className="p-6 border border-error-container rounded-xl bg-surface text-error font-body-md text-center">
                {error}
              </div>
            ) : recentLinks.length === 0 ? (
              <div className="border border-outline-variant rounded-xl bg-surface p-12 text-center flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant">link_off</span>
                <h4 className="font-body-lg text-on-surface font-medium">You haven't created any shortened URLs yet.</h4>
                <p className="font-body-md text-on-surface-variant max-w-md text-sm">
                  Create your first short link above or click the button below to get started.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary-container text-on-primary-container font-label-mono text-label-mono px-4 py-2 rounded-xl mt-2 hover:opacity-90 transition-opacity"
                >
                  Create your first short link
                </button>
              </div>
            ) : (
              <div className="border border-outline-variant rounded-xl bg-surface overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[1.5fr_2fr_auto] gap-sm p-sm bg-[#000000] border-b border-[#222222] font-label-mono text-label-mono text-on-surface-variant text-[11px] uppercase tracking-wider">
                  <div>Short Link</div>
                  <div>Destination</div>
                  <div className="w-[120px] text-right">Actions</div>
                </div>

                {/* Items */}
                {recentLinks.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1.5fr_2fr_auto] gap-sm p-3 border-b border-[#222222] items-center hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="font-label-mono text-label-mono text-primary truncate flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary-container shrink-0"></div>
                      <Link to={`/links/${item.short_code}`} className="hover:underline truncate">
                        {item.short_url}
                      </Link>
                    </div>

                    <div className="font-body-md text-body-md text-on-surface-variant truncate" title={item.original_url}>
                      {item.original_url}
                    </div>

                    <div className="w-[120px] flex justify-end items-center gap-2">
                      <button
                        onClick={(e) => handleCopy(item.short_url, e)}
                        title="Copy to clipboard"
                        className="text-on-surface-variant hover:text-on-background bg-transparent border border-[#333333] hover:border-primary rounded-xl px-2 py-1 flex items-center gap-1 font-label-mono text-[11px] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        Copy
                      </button>
                      <Link
                        to={`/links/${item.short_code}`}
                        title="View Details"
                        className="text-on-surface-variant hover:text-primary p-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleModalCreated}
      />
    </div>
  );
};
