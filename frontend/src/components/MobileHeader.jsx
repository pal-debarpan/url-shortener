import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MobileHeader = ({ onOpenCreateModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/links', label: 'My Links', icon: 'link' },
    { to: '/account', label: 'Account', icon: 'person' },
  ];

  return (
    <header className="md:hidden bg-background border-b border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-gutter h-16 max-w-[1200px] mx-auto">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-surface-container-highest border border-outline flex items-center justify-center text-primary font-bold">
            <span className="material-symbols-outlined text-[18px]">link</span>
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">URLShawtie</span>
        </NavLink>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="bg-primary-container text-on-primary-container font-label-mono text-caption px-3 py-1.5 rounded-xl font-medium flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            New
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-on-surface-variant hover:text-primary transition-colors p-1"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-surface-container-lowest border-b border-outline-variant px-gutter py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-sm px-4 py-2 rounded-xl transition-colors font-label-mono text-label-mono ${
                  isActive
                    ? 'text-primary font-bold bg-surface-container-low'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-sm px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors font-label-mono text-label-mono text-left mt-2 border-t border-outline-variant/30 pt-3"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
