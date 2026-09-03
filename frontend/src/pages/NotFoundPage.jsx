import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col items-center justify-center p-gutter text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary mb-6 shadow-2xl">
        <span className="material-symbols-outlined text-[32px]">link_off</span>
      </div>

      <div className="font-label-mono text-label-mono text-primary font-bold bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant mb-4">
        404 ERROR
      </div>

      <h1 className="font-display text-display text-on-surface mb-3 tracking-tight font-bold">
        Page not found
      </h1>

      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-8">
        The route you are looking for does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-high font-label-mono text-label-mono py-2.5 px-5 rounded-xl transition-colors"
        >
          Return Home
        </Link>
        <Link
          to="/dashboard"
          className="bg-primary-container text-on-primary-container font-label-mono text-label-mono font-medium py-2.5 px-5 rounded-xl hover:bg-inverse-primary transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          Go to Console
        </Link>
      </div>
    </div>
  );
};
