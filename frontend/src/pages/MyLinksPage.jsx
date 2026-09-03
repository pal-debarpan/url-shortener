import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUrls, deleteUrl, formatErrorMessage } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { CreateLinkModal } from '../components/CreateLinkModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast } from '../components/Toast';

export const MyLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  const handleCopy = (shortUrl, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(shortUrl);
    setToast({ message: 'Copied link to clipboard!', type: 'success' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteUrl(deleteTarget.short_code);
      setLinks((prev) => prev.filter((l) => l.short_code !== deleteTarget.short_code));
      setToast({ message: 'Link deleted successfully.', type: 'success' });
      setDeleteTarget(null);
    } catch (err) {
      setToast({ message: formatErrorMessage(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalCreated = (newUrl) => {
    setLinks((prev) => [newUrl, ...prev]);
    setToast({ message: `Short link created: ${newUrl.short_code}`, type: 'success' });
  };

  // Filter links by search query
  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.short_code.toLowerCase().includes(query) ||
      link.original_url.toLowerCase().includes(query) ||
      link.short_url.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredLinks.length / pageSize) || 1;
  const paginatedLinks = filteredLinks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col md:flex-row antialiased">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar (Desktop) */}
      <Sidebar onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Mobile Top Navbar */}
      <MobileHeader onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 w-full max-w-[1200px] mx-auto flex flex-col min-h-screen">
        <div className="flex-1 px-gutter md:px-lg py-lg flex flex-col gap-md">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm border-b border-surface-container-highest pb-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">My Links</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Manage and analyze your shortened URLs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-sm w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search links..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-1.5 pl-10 pr-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-0 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-xl font-label-mono text-label-mono hover:opacity-90 transition-opacity flex items-center gap-xs justify-center whitespace-nowrap font-medium"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Link
              </button>
            </div>
          </div>

          {/* Table or States */}
          {loading ? (
            <div className="p-16 border border-outline-variant rounded-xl bg-surface flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-label-mono text-label-mono text-on-surface-variant">Loading your links...</span>
            </div>
          ) : error ? (
            <div className="p-8 border border-error-container rounded-xl bg-surface text-error text-center font-body-md">
              {error}
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="bg-[#111111] border border-[#333333] rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 mt-sm">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant">link_off</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                {searchQuery ? 'No matching links found' : "You haven't created any shortened URLs yet."}
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-md text-sm">
                {searchQuery ? 'Try clearing your search query.' : 'Create your first short link to start tracking visits and clicks.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary-container text-on-primary-container font-label-mono text-label-mono px-4 py-2 rounded-xl mt-2 hover:opacity-90 transition-opacity font-medium"
                >
                  Create your first short link
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden flex-1 flex flex-col mt-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-black border-b border-[#333333] font-label-mono text-label-mono text-on-surface-variant text-[12px]">
                      <th className="py-3 px-4 font-normal w-5/12">Original URL</th>
                      <th className="py-3 px-4 font-normal w-3/12">Short URL</th>
                      <th className="py-3 px-4 font-normal w-1/12 text-right">Clicks</th>
                      <th className="py-3 px-4 font-normal w-2/12 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md text-on-surface divide-y divide-[#222222]">
                    {paginatedLinks.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1A1A1A] transition-colors group">
                        {/* Original URL */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
                              link
                            </span>
                            <span
                              className="font-label-mono text-label-mono truncate max-w-[280px] text-on-surface-variant group-hover:text-on-surface transition-colors"
                              title={item.original_url}
                            >
                              {item.original_url}
                            </span>
                          </div>
                        </td>

                        {/* Short URL */}
                        <td className="py-3.5 px-4">
                          <Link
                            to={`/links/${item.short_code}`}
                            className="font-label-mono text-label-mono text-primary hover:underline"
                          >
                            {item.short_url}
                          </Link>
                        </td>

                        {/* Clicks */}
                        <td className="py-3.5 px-4 text-right font-label-mono text-label-mono">
                          {item.click_count.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => handleCopy(item.short_url, e)}
                              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
                              title="Copy Link"
                            >
                              <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            </button>
                            <Link
                              to={`/links/${item.short_code}`}
                              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
                              title="Stats & Details"
                            >
                              <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-surface-container-high"
                              title="Delete URL"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-auto border-t border-[#222222] p-4 flex items-center justify-between text-on-surface-variant font-label-mono text-label-mono bg-black">
                <span>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredLinks.length)} to{' '}
                  {Math.min(currentPage * pageSize, filteredLinks.length)} of {filteredLinks.length} entries
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-xl border border-[#333333] hover:bg-[#1A1A1A] hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="px-2 text-on-surface font-bold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-xl border border-[#333333] hover:bg-[#1A1A1A] hover:text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="w-full py-lg px-gutter flex justify-between items-center border-t border-outline-variant bg-background mt-auto max-w-[1200px] mx-auto">
          <span className="font-label-mono text-label-mono font-bold text-primary">
            © 2024 URLShawtie. Built for developers.
          </span>
          <div className="flex gap-md font-caption text-caption text-on-surface-variant">
            <span>FastAPI Backend</span>
            <span>React Frontend</span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleModalCreated}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Short Link"
        message={`Are you sure you want to delete the short link '${deleteTarget?.short_code}'? Any requests to this URL will no longer be redirected.`}
        confirmText="Delete Link"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
