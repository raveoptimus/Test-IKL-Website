import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Standings } from './Standings';
import { getAppConfig, getPlayers, getTeams } from '../services/api';
import { AppConfig, Player, Team } from '../types';

export const Home: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [highlightPlayers, setHighlightPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getAppConfig().then(setConfig);
    
    // Fetch players and teams for the highlights
    Promise.all([getPlayers(), getTeams()]).then(([allPlayers, allTeams]) => {
        setTeams(allTeams);
        
        // 1. Try to find specific highlighted players (if they exist in the sheet)
        const targetNames = ['Senkoo', 'ZhanQ', 'Raven'];
        
        // Search for players matching target names
        let displayPlayers = targetNames.map(target => 
            allPlayers.find(p => p.name.toLowerCase().includes(target.toLowerCase()))
        ).filter((p): p is Player => p !== undefined);

        // 2. If we found fewer than 3, fill the rest with ANY available players from the sheet
        // This prevents empty "TBD" cards if the specific players aren't in the database yet.
        if (displayPlayers.length < 3 && allPlayers.length > 0) {
            // Filter out ones we already found to avoid duplicates
            const existingIds = new Set(displayPlayers.map(p => p.id));
            const remaining = allPlayers.filter(p => !existingIds.has(p.id));
            
            // Fill up to 3 with remaining players
            const fillCount = 3 - displayPlayers.length;
            const fillers = remaining.slice(0, fillCount);
            
            displayPlayers = [...displayPlayers, ...fillers];
        }

        // 3. If we STILL have fewer than 3 (e.g. empty database), only then fallback to dummy data
        if (displayPlayers.length < 3) {
             const needed = 3 - displayPlayers.length;
             // Determine which names are missing to use as labels
             const existingNames = new Set(displayPlayers.map(p => p.name));
             const missingTargets = targetNames.filter(t => !displayPlayers.some(p => p.name.includes(t)));
             
             const dummies = Array.from({ length: needed }).map((_, i) => ({
                id: `temp-${i}`,
                name: missingTargets[i] || `Player ${i+1}`,
                team: 'IKL',
                teamAbv: 'IKL',
                role: 'mid',
                image: '', 
                stats: {}
            } as any as Player));
            displayPlayers = [...displayPlayers, ...dummies];
        }

        // Ensure we explicitly sort/arrange them if we found the specific ones to match the design (Center highlighted)
        // If we found the specific names, we try to order them [Senkoo, ZhanQ, Raven] for the visual center logic
        if (targetNames.every(t => displayPlayers.some(p => p.name.includes(t)))) {
             const ordered = [
                 displayPlayers.find(p => p.name.includes(targetNames[0])),
                 displayPlayers.find(p => p.name.includes(targetNames[1])),
                 displayPlayers.find(p => p.name.includes(targetNames[2]))
             ].filter(Boolean) as Player[];
             if (ordered.length === 3) displayPlayers = ordered;
        }

        setHighlightPlayers(displayPlayers.slice(0, 3));
    });

    const handleUpdate = () => getAppConfig().then(setConfig);
    window.addEventListener('storage-config-updated', handleUpdate);
    return () => window.removeEventListener('storage-config-updated', handleUpdate);
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. Dedicated KV (Hero Section) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image */}
        {config?.kvUrl && (
          <div className="absolute inset-0 z-0">
             <img 
               src={config.kvUrl} 
               alt="IKL Key Visual" 
               className="w-full h-full object-cover object-top opacity-60"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
             <h1 className="text-5xl md:text-9xl font-display font-bold text-white mb-2 leading-[0.9] md:leading-[0.8] tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                INDONESIA<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-ikl-gold to-yellow-700 drop-shadow-sm">KINGS LAGA</span>
             </h1>
             <p className="text-2xl md:text-6xl font-display font-bold tracking-[0.2em] uppercase mb-12 text-transparent bg-clip-text bg-gradient-to-b from-ikl-red to-red-600 drop-shadow-[0_0_25px_rgba(255,42,42,0.8)] animate-pulse">
                FALL SEASON 2025
             </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
           <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Scroll Down</span>
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* 2. SBBT Feature Highlight */}
      <section className="py-16 md:py-24 bg-[#080808] border-t border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-ikl-red/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] rounded-xl border border-white/10 p-6 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl relative overflow-hidden group hover:border-ikl-red/30 transition-colors">
                 
                 <div className="flex-1 text-center md:text-left relative z-10 order-2 md:order-1">
                    <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-4 md:mb-6 leading-none">
                       SEMUA BISA <br/>
                       <span className="text-ikl-red">BIKIN TIM</span>
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8 max-w-xl">
                       Create your ultimate 5-man roster. Compete against others in the fantasy league.
                    </p>
                    <Link to="/sbbt" className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-display font-bold text-lg md:text-xl uppercase tracking-widest rounded-xl hover:bg-ikl-red hover:text-white transition-all transform hover:-translate-y-1">
                       Build Your Team <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                 </div>

                 {/* Visual Representation of Cards - SBBT Style */}
                 <div className="flex-1 flex justify-center gap-2 md:gap-4 relative z-10 order-1 md:order-2 w-full">
                     {highlightPlayers.map((player, index) => {
                        // "ZhanQ" is the 2nd item (index 1) in our target list, so it's the center
                        // OR if we are using random players, just keep the middle one highlighted
                        const isCenter = index === 1; 
                        const teamData = teams.find(t => t.name === player.team);
                        const nickname = player.name.includes('.') ? player.name.split('.').pop() : player.name;

                        return (
                            <div key={player.id} className={`w-24 md:w-44 rounded-xl border-2 bg-[#151515] flex flex-col overflow-hidden relative transform transition-all duration-500 shadow-2xl ${isCenter ? '-mt-8 md:-mt-12 scale-110 border-ikl-gold shadow-[0_0_30px_rgba(251,191,36,0.3)] z-20' : 'scale-90 border-white/10 opacity-80 z-10'}`}>
                                
                                {/* Image Area */}
                                <div className="aspect-[4/5] relative overflow-hidden flex items-end justify-center bg-[#0a0a0a]">
                                     {/* Tech Grid Pattern */}
                                     <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '15px 15px'}}></div>
                                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                                     
                                     {/* Team Logo Watermark */}
                                     {teamData?.logo && (
                                         <img src={teamData.logo} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-[0.05] grayscale pointer-events-none" referrerPolicy="no-referrer" />
                                     )}

                                     {player.image ? (
                                         <img src={player.image} alt={player.name} className="absolute inset-0 w-full h-[95%] object-contain object-bottom" referrerPolicy="no-referrer" />
                                     ) : (
                                         <div className="absolute inset-0 flex items-center justify-center text-4xl font-display font-bold text-white/10 select-none">
                                            {player.team.substring(0,1)}
                                         </div>
                                     )}
                                </div>

                                {/* Footer Area */}
                                <div className="bg-[#080808] p-2 md:p-3 border-t border-white/10 flex flex-col items-center justify-center min-h-[60px] md:min-h-[80px]">
                                    <div className={`font-display font-bold uppercase tracking-wide text-center leading-none mb-1 md:mb-2 truncate w-full ${isCenter ? 'text-lg md:text-3xl text-ikl-gold' : 'text-sm md:text-2xl text-white'}`}>
                                        {nickname}
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        {teamData?.logo && (
                                           <img src={teamData.logo} alt="Team" className="w-4 h-4 md:w-6 md:h-6 object-contain" referrerPolicy="no-referrer" />
                                        )}
                                        <span className="text-gray-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">{player.teamAbv || player.team}</span>
                                    </div>
                                </div>
                            </div>
                        );
                     })}
                     {/* Fallback visual if loading */}
                     {highlightPlayers.length === 0 && (
                         <div className="flex gap-4">
                             {[1,2,3].map(i => <div key={i} className="w-24 h-36 md:w-32 md:h-48 bg-white/5 animate-pulse rounded-xl"></div>)}
                         </div>
                     )}
                 </div>
            </div>
         </div>
      </section>

      {/* 3. Standings (Full) */}
      <section className="py-20 bg-[#050505]">
          <Standings />
      </section>

      {/* 4. About Us (Updatable) */}
      <section className="py-24 bg-[#080808] border-t border-white/5">
         <div className="max-w-6xl mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                 {/* Left: Logo */}
                 <div className="flex justify-center md:justify-end">
                     <div className="w-48 h-48 md:w-80 md:h-80 relative">
                         <div className="absolute inset-0 bg-ikl-red/20 blur-[60px] rounded-full"></div>
                         <img 
                            src={config?.logoUrl} 
                            alt="IKL Logo" 
                            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                            referrerPolicy="no-referrer"
                         />
                     </div>
                 </div>
                 
                 {/* Right: Text */}
                 <div className="text-center md:text-left">
                     <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-widest border-l-0 md:border-l-4 border-ikl-gold pl-0 md:pl-6">
                         About Us
                     </h2>
                     <div className="prose prose-invert prose-lg">
                        <p className="text-gray-400 leading-relaxed font-light text-base md:text-xl whitespace-pre-wrap">
                            {config?.aboutText || "Loading About Us content..."}
                        </p>
                     </div>
                 </div>
             </div>
         </div>
      </section>
    </div>
  );
};