import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, CheckSquare, Calendar, ShieldAlert } from 'lucide-react';
import Navbar from './Navbar';

const bottomTabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/checklist', label: 'Checklist', icon: CheckSquare },
  { to: '/deadlines', label: 'Deadlines', icon: Calendar },
  { to: '/myths', label: 'Myths', icon: ShieldAlert },
];

const MainLayout = ({ children, showFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      {/* Main content — bottom padding on mobile for bottom nav */}
      <main id="main-content" className="flex-1 pb-20 lg:pb-0 animate-fade-in">
        {children}
      </main>

      {/* Footer — only on Landing */}
      {showFooter && (
        <footer className="bg-navy text-white py-10 hidden lg:block">
          <div className="page-container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[18px] mb-1">VoterPath India</p>
                <p className="text-small text-blue-200">
                  Data sourced from{' '}
                  <a
                    href="https://voters.eci.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-saffron hover:text-saffron-light focus:outline-none focus:ring-2 focus:ring-saffron rounded"
                  >
                    voters.eci.gov.in
                  </a>{' '}
                  — Election Commission of India
                </p>
              </div>
              <p className="text-meta text-blue-300">© 2026 VoterPath India. Built for India's voters.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Tab Navigation — z-[60] above content */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="flex items-center justify-around h-16">
          {bottomTabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-saffron focus:outline-none min-w-[44px] min-h-[44px] justify-center ${
                  isActive ? 'text-saffron' : 'text-gray-500'
                }`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
