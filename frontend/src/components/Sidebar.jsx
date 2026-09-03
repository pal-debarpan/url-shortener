import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ onOpenCreateModal }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/links', label: 'My Links', icon: 'link' },
    { to: '/account', label: 'Account', icon: 'person' },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex-col py-md z-40 select-none">
      {/* Brand Header */}
      <div className="px-gutter mb-lg flex items-center gap-sm">
        <div className="w-8 h-8 rounded-xl bg-surface-container-highest border border-outline flex items-center justify-center text-primary font-bold text-lg">
          <span className="material-symbols-outlined text-[20px]">link</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary leading-none">URLShawtie</h1>
          <p className="font-caption text-caption text-on-surface-variant mt-1">Developer Console</p>
        </div>
      </div>

      {/* Create Link CTA Button */}
      <div className="px-gutter mb-md">
        <button
          onClick={onOpenCreateModal}
          id="sidebar-create-link-btn"
          className="w-full bg-primary-container text-on-primary-container font-label-mono text-label-mono py-2 px-4 rounded-xl transition-all duration-150 ease-in-out hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 font-medium"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Link
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 font-label-mono text-label-mono">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-sm pl-4 py-2 transition-all duration-150 ease-in-out ${
                isActive
                  ? 'text-primary font-bold border-l-2 border-primary bg-surface-container-low'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign Out at bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          id="sidebar-signout-btn"
          className="w-full flex items-center gap-sm text-on-surface-variant pl-4 py-2 hover:bg-surface-container-low hover:text-error transition-all duration-150 ease-in-out font-label-mono text-label-mono text-left"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
