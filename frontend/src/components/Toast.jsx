import React from 'react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl font-body-md text-sm ${
          isSuccess
            ? 'bg-surface-container-high border-primary text-primary'
            : isError
            ? 'bg-surface-container-high border-error text-error'
            : 'bg-surface-container-high border-outline-variant text-on-surface'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isSuccess ? 'check_circle' : isError ? 'error' : 'info'}
        </span>
        <span className="font-label-mono text-label-mono">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 hover:opacity-80 p-0.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
