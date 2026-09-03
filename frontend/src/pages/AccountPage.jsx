import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../components/MobileHeader';
import { CreateLinkModal } from '../components/CreateLinkModal';
import { Toast } from '../components/Toast';

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setToast({ message: `Copied ${label} to clipboard!`, type: 'success' });
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const accountId = user?.id ? `usr_${user.id.toString().padStart(6, '0')}` : 'usr_dev';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Developer';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row antialiased">
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

        <header className="mb-lg pt-4 md:pt-0">
          <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight font-bold">
            Account Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Manage your developer profile and preferences.
          </p>
        </header>

        <div className="flex flex-col gap-md">
          {/* Profile Card */}
          <section className="bg-surface border border-outline-variant rounded-xl p-gutter md:p-margin flex flex-col md:flex-row items-start md:items-center gap-gutter">
            <div className="w-16 h-16 rounded-xl bg-surface-container-highest border border-outline flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">terminal</span>
            </div>
            <div className="flex-1">
              <h2 className="font-body-lg text-body-lg text-on-background font-medium">Developer Profile</h2>
              <p className="font-label-mono text-label-mono text-on-surface-variant mt-1">
                {user?.email || 'developer@urlshawtie.com'}
              </p>
            </div>
          </section>

          {/* Details List */}
          <section className="bg-surface border border-outline-variant rounded-xl">
            <div className="border-b border-outline-variant p-gutter flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-label-mono text-label-mono text-on-surface-variant w-32 shrink-0 text-xs">
                Email Address
              </div>
              <div className="font-body-md text-body-md text-on-background flex-1">
                {user?.email || 'developer@urlshawtie.com'}
              </div>
            </div>

            <div className="border-b border-outline-variant p-gutter flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-label-mono text-label-mono text-on-surface-variant w-32 shrink-0 text-xs">
                Account ID
              </div>
              <div className="font-label-mono text-label-mono text-on-surface-variant flex-1 flex items-center gap-2">
                <span>{accountId}</span>
                <button
                  onClick={() => handleCopy(accountId, 'Account ID')}
                  className="text-on-surface-variant hover:text-on-background transition-colors p-1"
                  title="Copy Account ID"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                </button>
              </div>
            </div>

            <div className="p-gutter flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-label-mono text-label-mono text-on-surface-variant w-32 shrink-0 text-xs">
                Member Since
              </div>
              <div className="font-body-md text-body-md text-on-background flex-1">
                {memberSince}
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="mt-lg">
            <h3 className="font-label-mono text-label-mono text-error mb-4 uppercase tracking-widest text-xs font-semibold">
              Danger Zone
            </h3>
            <div className="bg-surface border border-error-container/60 rounded-xl p-gutter flex flex-col md:flex-row items-start md:items-center justify-between gap-gutter">
              <div>
                <div className="font-body-md text-body-md text-on-background font-medium">Sign Out</div>
                <div className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                  End your current active session across this device.
                </div>
              </div>
              <button
                onClick={handleSignOut}
                id="account-signout-btn"
                className="bg-transparent border border-outline-variant text-on-background font-label-mono text-label-mono py-2 px-6 rounded-xl hover:bg-surface-container-highest hover:border-error hover:text-error transition-colors duration-200 w-full md:w-auto font-medium"
              >
                Sign Out
              </button>
            </div>
          </section>
        </div>

        {/* Footer Spacer */}
        <div className="mt-auto pt-xl"></div>
      </main>

      {/* Modal */}
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => navigate('/links')}
      />
    </div>
  );
};
