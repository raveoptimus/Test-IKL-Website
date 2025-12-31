import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAppConfig } from '../services/api';

const NavLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`relative px-4 py-2 font-display tracking-wider text-xl transition-all duration-300 group overflow-hidden ${
      active
        ? 'text-white'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    <span className="relative z-10">{label}</span>
    {/* Active/Hover Glow Indicator */}
    <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-ikl-red to-transparent transition-all duration-300 ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'}`}></span>
  </Link>
);

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 md:hidden animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 text-white text-3xl hover:text-ikl-red transition-colors">&times;</button>
      <Link to="/" onClick={onClose} className="text-3xl font-display text-white hover:text-ikl-red tracking-widest">SBBT</Link>
      <Link to="/teams" onClick={onClose} className="text-3xl font-display text-white hover:text-ikl-red tracking-widest">TEAMS</Link>
      <Link to="/stats" onClick={onClose} className="text-3xl font-display text-white hover:text-ikl-red tracking-widest">STATS</Link>
      <Link to="/standings" onClick={onClose} className="text-3xl font-display text-white hover:text-ikl-red tracking-widest">STANDINGS</Link>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("https://placehold.co/400x400/000000/ff2a2a?text=IKL+FALL");

  useEffect(() => {
    // Fetch dynamic logo configuration on mount
    const fetchConfig = () => {
        getAppConfig().then(config => {
            if (config.logoUrl) setLogoUrl(config.logoUrl);
        });
    };

    fetchConfig();

    // Listen for updates from Admin panel
    const handleStorageUpdate = () => fetchConfig();
    window.addEventListener('storage-config-updated', handleStorageUpdate);

    return () => {
        window.removeEventListener('storage-config-updated', handleStorageUpdate);
    };
  }, []); 

  return (
    <div className="min-h-screen bg-ikl-darker text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-ikl-red/10 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ikl-red/5 rounded-full blur-[120px]"></div>
        {/* Hexagon Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center space-x-4">
              {/* Dynamic Logo Section */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-ikl-red/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                    src={logoUrl} 
                    alt="IKL Logo" 
                    className="h-12 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                       // Fallback if image fails (optional)
                    }}
                />
              </div>
              <div className="hidden sm:flex flex-col">
                  <span className="font-display font-bold text-2xl tracking-[0.2em] text-white leading-none">
                    INDONESIA KINGS LAGA
                  </span>
                  <span className="font-display font-bold text-lg text-ikl-red tracking-[0.4em] leading-none opacity-80">
                    FALL 2025
                  </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <NavLink to="/" label="SBBT" active={location.pathname === '/'} />
                <NavLink to="/teams" label="TEAMS" active={location.pathname === '/teams'} />
                <NavLink to="/stats" label="STATS" active={location.pathname === '/stats'} />
                <NavLink to="/standings" label="STANDINGS" active={location.pathname === '/standings'} />
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition-colors"
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
      <main className="flex-grow z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {children}
      </main>

      {/* Footer */}
      <footer className="z-10 bg-[#080808] border-t border-white/5 py-12 relative overflow-hidden">
        {/* Decor line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ikl-red to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-widest">INDONESIA KINGS LAGA</h2>
          <p className="text-gray-500 font-display text-lg mb-6">
            OFFICIAL ESPORTS PLATFORM
          </p>
          
          <div className="flex justify-center space-x-8 mb-8">
             <a href="#" className="text-gray-600 hover:text-white transition-all transform hover:scale-110">Instagram</a>
             <a href="#" className="text-gray-600 hover:text-white transition-all transform hover:scale-110">YouTube</a>
             <a href="#" className="text-gray-600 hover:text-white transition-all transform hover:scale-110">Discord</a>
          </div>
          
          <p className="text-gray-700 text-xs">
            &copy; 2025 IKL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};