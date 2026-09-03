import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUrl, getUrlStats, deleteUrl, formatErrorMessage } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { CreateLinkModal } from '../components/CreateLinkModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';

export const LinkDetailsPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both url info and stats endpoint
      const [urlData, statsData] = await Promise.all([
        getUrl(shortCode),
        getUrlStats(shortCode).catch(() => null),
      ]);

      setLink(urlData);
      setStats(statsData);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [shortCode]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Copied to clipboard!', type: 'success' });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUrl(shortCode);
      setToast({ message: 'Link deleted successfully', type: 'success' });
      navigate('/links', { replace: true });
    } catch (err) {
      setToast({ message: formatErrorMessage(err), type: 'error' });
      setIsDeleting(false);
    }
  };

  const formattedDate = stats?.created_at
    ? new Date(stats.created_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md flex antialiased">
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
      <main className="flex-1 md:ml-64 w-full flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <MobileHeader onOpenCreateModal={() => setIsModalOpen(true)} />

        {/* Content Area */}
        <div className="flex-1 w-full max-w-[1200px] mx-auto p-gutter md:p-margin space-y-lg">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono text-caption">
            <Link to="/links" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Back to My Links
            </Link>
            <span>/</span>
            <span className="text-on-surface">{shortCode}</span>
          </div>

          {loading ? (
            <div className="p-16 border border-outline-variant rounded-xl bg-surface flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-label-mono text-label-mono text-on-surface-variant">Loading link details...</span>
            </div>
          ) : error ? (
            <div className="p-8 border border-error-container rounded-xl bg-surface text-error text-center font-body-md">
              <p className="mb-4">{error}</p>
              <Link
                to="/links"
                className="bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2 rounded-xl font-label-mono text-label-mono hover:bg-surface-container-highest transition-colors inline-flex items-center gap-2"
              >
                Return to My Links
              </Link>
            </div>
          ) : link ? (
            <>
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs font-bold">Link Details</h2>
                  <div className="flex items-center gap-sm">
                    <span className="font-label-mono text-label-mono text-primary bg-surface-container-high px-sm py-xs rounded-xl border border-outline-variant">
                      {link.short_url}
                    </span>
                    <button
                      onClick={() => handleCopy(link.short_url)}
                      className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
                      title="Copy short link"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high transition-colors px-md py-sm rounded-xl font-body-md flex items-center gap-xs font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    Open Original
                  </a>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="bg-surface-container text-error border border-error-container hover:bg-error-container/20 transition-colors px-md py-sm rounded-xl font-body-md flex items-center gap-xs font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete Link
                  </button>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-margin">
                {/* Left Column: Configuration Metadata */}
                <div className="lg:col-span-8 space-y-margin">
                  <div className="bg-surface-container-low border border-outline-variant rounded-xl p-margin">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-md font-semibold">Configuration</h3>
                    <div className="space-y-md">
                      {/* Destination URL */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-xs">
                        <div className="font-label-mono text-label-mono text-on-surface-variant self-center text-xs">Destination URL</div>
                        <div className="md:col-span-2">
                          <div className="bg-surface border border-outline-variant rounded-xl p-sm flex items-center justify-between gap-2">
                            <span className="font-label-mono text-label-mono text-on-surface truncate" title={link.original_url}>
                              {link.original_url}
                            </span>
                            <button
                              onClick={() => handleCopy(link.original_url)}
                              className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                              title="Copy destination URL"
                            >
                              <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Short Code */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-xs">
                        <div className="font-label-mono text-label-mono text-on-surface-variant self-center text-xs">Short Code</div>
                        <div className="md:col-span-2 font-label-mono text-label-mono text-primary font-bold self-center">
                          {link.short_code}
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-xs">
                        <div className="font-label-mono text-label-mono text-on-surface-variant self-center text-xs">Created</div>
                        <div className="md:col-span-2 font-body-md text-on-surface self-center">
                          {formattedDate}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-xs">
                        <div className="font-label-mono text-label-mono text-on-surface-variant self-center text-xs">Status</div>
                        <div className="md:col-span-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="font-label-mono text-label-mono text-on-surface">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Real Click Stats Hero Card */}
                <div className="lg:col-span-4 space-y-margin">
                  <div className="bg-surface-container-low border border-outline-variant rounded-xl p-margin flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[180px]">
                    <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <h4 className="font-label-mono text-label-mono text-on-surface-variant mb-sm relative z-10 text-xs uppercase tracking-wider">
                      Total Clicks
                    </h4>
                    <div className="font-display text-display text-primary relative z-10 tracking-tight font-bold">
                      {link.click_count.toLocaleString()}
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-2 relative z-10">
                      Live counter incremented on each redirect
                    </p>
                  </div>

                  {/* Public Link Card */}
                  <div className="bg-surface-container-low border border-outline-variant rounded-xl p-margin space-y-3">
                    <h4 className="font-label-mono text-label-mono text-on-surface font-semibold">Test Redirect</h4>
                    <p className="font-body-md text-on-surface-variant text-xs">
                      Visiting the shortened link increments the click count and redirects visitors immediately:
                    </p>
                    <a
                      href={link.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary-container text-on-primary-container font-label-mono text-label-mono py-2 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px]">call_made</span>
                      Visit Short Link
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="w-full py-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto border-t border-outline-variant mt-auto">
          <div className="font-label-mono text-label-mono font-bold text-primary mb-sm md:mb-0">
            URLShawtie
          </div>
          <div className="font-caption text-caption text-on-surface-variant">
            © 2024 URLShawtie. Built for developers.
          </div>
        </footer>
      </main>

      {/* Modals */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => navigate('/links')}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Short Link"
        message={`Are you sure you want to delete the short link '${shortCode}'?`}
        confirmText="Delete Link"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
