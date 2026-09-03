import React from 'react';

export const ConfirmModal = ({ isOpen, title, message, confirmText = 'Delete', onConfirm, onCancel, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-md w-full p-gutter md:p-margin shadow-2xl">
        <div className="flex items-center gap-3 mb-3 text-error">
          <div className="w-10 h-10 rounded-full bg-error-container/20 border border-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-error text-[20px]">delete_forever</span>
          </div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{title || 'Confirm Deletion'}</h3>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
          {message || 'Are you sure you want to proceed? This action cannot be undone.'}
        </p>

        <div className="flex justify-end gap-sm">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="bg-transparent border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono text-label-mono py-2 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            id="confirm-delete-btn"
            className="bg-error-container text-on-error border border-error-container hover:brightness-110 active:scale-[0.98] font-label-mono text-label-mono font-medium py-2 px-5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-error border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
