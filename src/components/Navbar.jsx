import React, { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Vote } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import TranslateText from './TranslateText';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'Assistant' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/deadlines', label: 'Deadlines' },
  { to: '/myths', label: 'Myth Buster' },
  { to: '/bias-shield', label: 'Bias Shield' },
  { to: '/transparency', label: 'Transparency' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[50] bg-white border-b border-gray-200 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 focus:ring-2 focus:ring-saffron focus:outline-none rounded"
            aria-label="VoterPath India - Home"
          >
            <div className="w-9 h-9 bg-saffron rounded-full flex items-center justify-center">
              <Vote size={20} className="text-white" />
            </div>
            <span className="font-bold text-navy text-[20px] hidden sm:inline">
              VoterPath <span className="text-saffron">India</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-small font-semibold transition-colors focus:ring-2 focus:ring-saffron focus:outline-none ${
                    isActive
                      ? 'bg-saffron text-white'
                      : 'text-navy hover:bg-navy-light'
                  }`
                }
              >
                <TranslateText>{link.label}</TranslateText>
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageToggle />
            </div>
            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-navy hover:bg-navy-light focus:ring-2 focus:ring-saffron focus:outline-none transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-16 bg-white z-[49] animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <div className="page-container py-6 flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-4 rounded-card text-[18px] font-semibold transition-colors focus:ring-2 focus:ring-saffron focus:outline-none ${
                    isActive
                      ? 'bg-saffron text-white'
                      : 'text-navy hover:bg-saffron-light'
                  }`
                }
              >
                <TranslateText>{link.label}</TranslateText>
              </NavLink>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
