import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAppConfig } from '../services/api';

const NavLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`px-4 py-2 font-display tracking-wider text-xl transition-all duration-300 ${
      active
        ? 'text-ikl-red border-b-2 border-ikl-red'
        : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-600'
    }`}
  >
    {label}
  </Link>
);

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 md:hidden">
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl">&times;</button>
      <Link to="/" onClick={onClose} className="text-2xl font-display text-white hover:text-ikl-red">SBBT</Link>
      <Link to="/teams" onClick={onClose} className="text-2xl font-display text-white hover:text-ikl-red">TEAMS</Link>
      <Link to="/stats" onClick={onClose} className="text-2xl font-display text-white hover:text-ikl-red">STATS</Link>
      <Link to="/standings" onClick={onClose} className="text-2xl font-display text-white hover:text-ikl-red">STANDINGS</Link>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("https://placehold.co/400x400/000000/ff2a2a?text=IKL+FALL");

  useEffect(() => {
    // Fetch dynamic logo configuration on mount
    getAppConfig().then(config => {
      if (config.logoUrl) setLogoUrl(config.logoUrl);
    });
  }, [location.pathname]); // Re-check when changing pages (e.g. coming from Admin)

  return (
    <div className="min-h-screen bg-ikl-darker text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-ikl-red/20 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ikl-red/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-ikl-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center space-x-3">
              {/* Dynamic Logo Section */}
              <img 
                src={logoUrl} 
                alt="IKL Logo" 
                className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
              <span className="font-display font-bold text-2xl tracking-widest text-white hidden sm:block">
                FALL <span className="text-ikl-red">2025</span>
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" label="SBBT" active={location.pathname === '/'} />
                <NavLink to="/teams" label="TEAMS" active={location.pathname === '/teams'} />
                <NavLink to="/stats" label="STATS" active={location.pathname === '/stats'} />
                <NavLink to="/standings" label="STANDINGS" active={location.pathname === '/standings'} />
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Content */}
      <main className="flex-grow z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="z-10 bg-ikl-panel border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 font-display text-lg">
            &copy; 2025 Indonesia Kings Laga. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
             <a href="#" className="text-gray-600 hover:text-ikl-red transition-colors">Instagram</a>
             <a href="#" className="text-gray-600 hover:text-ikl-red transition-colors">YouTube</a>
             <a href="#" className="text-gray-600 hover:text-ikl-red transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};