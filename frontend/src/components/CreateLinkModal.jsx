import React, { useState } from 'react';
import { createUrl, formatErrorMessage } from '../services/api';

export const CreateLinkModal = ({ isOpen, onClose, onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic URL validation
    let urlToSubmit = originalUrl.trim();
    if (!urlToSubmit.startsWith('http://') && !urlToSubmit.startsWith('https://')) {
      urlToSubmit = `https://${urlToSubmit}`;
    }

    try {
      setLoading(true);
      const newUrl = await createUrl({
        original_url: urlToSubmit,
        custom_alias: customAlias.trim() || undefined,
      });
      setOriginalUrl('');
      setCustomAlias('');
      if (onCreated) {
        onCreated(newUrl);
      }
      onClose();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-lg w-full p-gutter md:p-margin shadow-2xl relative">
        <div className="flex justify-between items-center mb-md border-b border-outline-variant/40 pb-3">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Create Short URL</h3>
            <p className="font-caption text-caption text-on-surface-variant mt-1">Shorten a long URL with an optional custom alias</p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-md p-3 bg-error-container/30 border border-error-container text-error rounded-xl font-body-md text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Destination URL */}
          <div className="flex flex-col gap-base">
            <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[11px] tracking-wider" htmlFor="modal-destination-url">
              Destination URL *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px] pointer-events-none">
                link
              </span>
              <input
                id="modal-destination-url"
                type="text"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/my-very-long-link-path"
                className="w-full bg-[#111111] border border-[#333333] text-on-background rounded-xl font-body-md pl-10 pr-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Custom Alias */}
          <div className="flex flex-col gap-base">
            <label className="font-label-mono text-label-mono text-on-surface-variant uppercase text-[11px] tracking-wider" htmlFor="modal-custom-alias">
              Custom Alias (Optional, 3-30 chars)
            </label>
            <div className="flex">
              <span className="bg-surface-container-low border border-[#333333] border-r-0 rounded-l-xl px-3 py-2 font-label-mono text-label-mono text-on-surface-variant flex items-center shrink-0">
                short/
              </span>
              <input
                id="modal-custom-alias"
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="custom-slug"
                pattern="^[a-zA-Z0-9_-]{3,30}$"
                title="3 to 30 letters, numbers, underscores or hyphens"
                className="w-full bg-[#111111] border border-[#333333] text-on-background rounded-r-xl font-label-mono text-label-mono px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-sm mt-sm pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono text-label-mono py-2 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !originalUrl.trim()}
              id="modal-submit-btn"
              className="bg-primary-container text-on-primary-container font-label-mono text-label-mono font-medium py-2 px-6 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                  <span>Shortening...</span>
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
    </div>
  );
};
