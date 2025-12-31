import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAppConfig, syncDataFromSheets } from '../services/api';

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
    <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center space-y-10 md:hidden animate-fade-in p-6">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      
      <div className="flex flex-col space-y-8 text-center w-full max-w-sm">
        <Link to="/" onClick={onClose} className="text-5xl font-display font-bold text-white hover:text-ikl-red tracking-widest transition-transform active:scale-95 py-2 border-b border-white/5">SBBT</Link>
        <Link to="/teams" onClick={onClose} className="text-5xl font-display font-bold text-white hover:text-ikl-red tracking-widest transition-transform active:scale-95 py-2 border-b border-white/5">TEAMS</Link>
        <Link to="/stats" onClick={onClose} className="text-5xl font-display font-bold text-white hover:text-ikl-red tracking-widest transition-transform active:scale-95 py-2 border-b border-white/5">STATS</Link>
        <Link to="/standings" onClick={onClose} className="text-5xl font-display font-bold text-white hover:text-ikl-red tracking-widest transition-transform active:scale-95 py-2 border-b border-white/5">STANDINGS</Link>
      </div>

      <div className="absolute bottom-12 text-gray-500 font-display text-xl tracking-widest">
        IKL FALL 2025
      </div>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("https://placehold.co/400x400/000000/ff2a2a?text=IKL+FALL");
  const [kvUrl, setKvUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch dynamic logo & KV configuration on mount
    const fetchConfig = () => {
        getAppConfig().then(config => {
            if (config.logoUrl) setLogoUrl(config.logoUrl);
            if (config.kvUrl) setKvUrl(config.kvUrl);
        });
    };

    fetchConfig();
    
    // Attempt background sync
    syncDataFromSheets().then(result => {
       if (result.success) {
           console.log("Remote data synced successfully.");
           fetchConfig(); // Re-fetch in case config changed
       }
    });

    // Listen for updates from Admin panel
    const handleStorageUpdate = () => fetchConfig();
    window.addEventListener('storage-config-updated', handleStorageUpdate);

    return () => {
        window.removeEventListener('storage-config-updated', handleStorageUpdate);
    };
  }, []); 

  return (
    <div className="min-h-screen bg-ikl-darker text-white flex flex-col relative overflow-hidden">
      {/* --- DYNAMIC GLOBAL BACKGROUND (KV) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* KV Image Layer */}
         {kvUrl ? (
             <div className="absolute top-0 left-0 w-full h-[60vh] md:h-[80vh] opacity-40 transition-opacity duration-1000 ease-out">
                <img 
                    src={kvUrl} 
                    alt="Season Theme" 
                    className="w-full h-full object-cover object-top mask-image-b-gradient"
                    referrerPolicy="no-referrer"
                />
             </div>
         ) : (
             // Fallback Gradient if no KV
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-ikl-red/10 to-transparent opacity-20"></div>
         )}
         
         {/* Gradient Overlay for Readability (Fades KV into black at bottom) */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#050505]/80 to-[#050505]"></div>
         
         {/* Ambient Glows */}
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ikl-red/5 rounded-full blur-[120px]"></div>
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] mix-blend-overlay"></div>
         
         {/* Texture Overlay */}
         <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <div className="flex-shrink-0 flex items-center space-x-4">
              {/* Dynamic Logo Section */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                    src={logoUrl} 
                    alt="IKL Logo" 
                    className="h-10 md:h-14 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                       // Fallback if image fails (optional)
                    }}
                />
              </div>
              <div className="hidden sm:flex flex-col">
                  <span className="font-display font-bold text-2xl md:text-3xl tracking-[0.15em] text-white leading-none drop-shadow-lg">
                    INDONESIA KINGS LAGA
                  </span>
                  <span className="font-display font-bold text-lg md:text-xl text-ikl-red tracking-[0.3em] leading-none opacity-90 mt-1 drop-shadow-md">
                    FALL 2025
                  </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <NavLink to="/" label="SBBT" active={location.pathname === '/'} />
                <NavLink to="/teams" label="TEAMS" active={location.pathname === '/teams'} />
                <NavLink to="/stats" label="STATS" active={location.pathname === '/stats'} />
                <NavLink to="/standings" label="STANDINGS" active={location.pathname === '/standings'} />
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-3 rounded-md text-white hover:bg-white/10 focus:outline-none transition-colors"
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
      <footer className="z-10 bg-[#080808]/90 border-t border-white/5 py-16 relative overflow-hidden backdrop-blur-sm">
        {/* Decor line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ikl-red to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-widest">INDONESIA KINGS LAGA</h2>
          <p className="text-gray-500 font-display text-xl mb-10 tracking-wide">
            OFFICIAL ESPORTS PLATFORM
          </p>
          
          <div className="flex justify-center space-x-10 mb-10">
             <a href="#" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 font-bold uppercase tracking-wider">Instagram</a>
             <a href="#" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 font-bold uppercase tracking-wider">YouTube</a>
             <a href="#" className="text-gray-500 hover:text-white transition-all transform hover:scale-110 font-bold uppercase tracking-wider">Discord</a>
          </div>
          
          <p className="text-gray-700 text-sm">
            &copy; 2025 IKL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};