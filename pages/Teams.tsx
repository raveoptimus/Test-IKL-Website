import React, { useEffect, useState } from 'react';
import { Team, Player } from '../types';
import { getTeams, getPlayers } from '../services/api';
import { ROLE_LABELS } from '../constants';

export const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const loadData = () => {
    getTeams().then(setTeams);
    getPlayers().then(setPlayers);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('data-updated', loadData);
    return () => window.removeEventListener('data-updated', loadData);
  }, []);

  // --- DETAIL VIEW ---
  if (selectedTeam) {
    const roster = players.filter(p => p.team === selectedTeam.name);

    return (
      <div className="animate-fade-in pb-16">
         {/* Navigation Back */}
         <button 
           onClick={() => setSelectedTeam(null)}
           className="flex items-center space-x-3 text-gray-400 hover:text-white mb-6 md:mb-10 group transition-colors px-4 md:px-2 pt-4"
         >
            <svg className="w-6 h-6 md:w-8 md:h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="font-display text-xl md:text-2xl uppercase tracking-widest">Back to Teams</span>
         </button>

         {/* Header Info: Detail Intro + Logo */}
         <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 mb-12 md:mb-20 bg-gradient-to-r from-black via-white/5 to-transparent p-6 md:p-10 rounded-xl border-t-4 md:border-t-0 md:border-l-8 border-ikl-red shadow-2xl mx-4 md:mx-0">
            {/* PNG Friendly: Changed rounded-full to rounded-3xl to prevent cropping */}
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[#111] rounded-2xl md:rounded-3xl flex items-center justify-center border-4 border-white/10 shadow-[0_0_50px_rgba(255,42,42,0.3)] flex-shrink-0 relative overflow-hidden p-4 md:p-6">
                 {selectedTeam.logo && !selectedTeam.logo.includes('placehold') ? (
                     <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                 ) : (
                     <span className="font-display text-5xl md:text-7xl text-gray-700">{selectedTeam.name.substring(0,2)}</span>
                 )}
            </div>
            <div className="text-center md:text-left">
                 <h1 className="text-5xl md:text-9xl font-display font-bold text-white uppercase leading-none mb-4 md:mb-6 drop-shadow-lg break-words">{selectedTeam.name}</h1>
                 {/* Detail Intro */}
                 <p className="text-lg md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light">
                   {selectedTeam.description || "No team description available."}
                 </p>
            </div>
         </div>

         {/* Roster Grid */}
         <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 md:mb-10 flex items-center gap-4 md:gap-6 px-4 md:px-2">
             <span className="w-1.5 md:w-2 h-8 md:h-10 bg-ikl-red"></span>
             ROSTER
         </h2>
         
         {roster.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 px-4 md:px-2">
              {roster.map(player => (
                  <div key={player.id} className="bg-white/5 rounded-xl overflow-hidden group border border-white/5 hover:border-ikl-red/50 transition-all duration-300">
                      {/* Photo Player with Tech Grid Background */}
                      <div className="aspect-[4/5] relative overflow-hidden flex items-end justify-center bg-[#151515]">
                          {/* Tech Grid Pattern */}
                          <div className="absolute inset-0 opacity-20" style={{
                             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                             backgroundSize: '20px 20px'
                          }}></div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                          {player.image ? (
                             <img src={player.image} alt={player.name} className="w-full h-[95%] object-contain object-bottom transition-transform duration-500 group-hover:scale-105 relative z-10" referrerPolicy="no-referrer" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-5xl font-display text-gray-800 font-bold relative z-10">
                                {player.name.substring(0,1)}
                             </div>
                          )}
                      </div>

                      {/* Footer Info Area - Solid Black Background */}
                      <div className="p-3 md:p-4 text-center bg-[#080808] border-t border-white/10 relative z-20 min-h-[80px] md:min-h-[90px] flex flex-col items-center justify-center">
                          {/* Nickname - Smaller font to prevent ugly wrapping on mobile */}
                          <h3 className="text-lg md:text-2xl font-display font-bold text-white uppercase tracking-wide mb-1 md:mb-2 break-words leading-none w-full">
                              {player.name}
                          </h3>
                          {/* Role Badge */}
                          <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-[#1a1a1a] rounded border border-white/10">
                             <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{ROLE_LABELS[player.role]}</span>
                          </div>
                      </div>
                  </div>
              ))}
           </div>
         ) : (
             <div className="p-10 md:p-16 text-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10 m-4 md:m-2">
                 <p className="font-display text-2xl md:text-3xl">NO ACTIVE PLAYERS FOUND</p>
             </div>
         )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="animate-fade-in pb-12">
       {/* Title with RED LED Effect on "PARTICIPATING TEAM" */}
       <div className="mb-10 md:mb-16 flex justify-center py-6">
          <h1 className="text-5xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-ikl-red to-red-600 drop-shadow-[0_0_35px_rgba(255,42,42,0.6)] animate-pulse uppercase tracking-widest text-center border-b-4 md:border-b-8 border-ikl-red pb-4 px-4 md:px-10 leading-none">
             PARTICIPATING TEAM
          </h1>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {teams.map(team => (
             <div 
               key={team.id} 
               onClick={() => setSelectedTeam(team)}
               className="bg-ikl-panel border border-white/10 rounded-2xl p-6 md:p-10 hover:border-ikl-red hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-between min-h-[280px] md:min-h-[320px]"
             >
                <div className="flex flex-col items-center w-full">
                   {/* Logo Container - Enlarged & Highlighted */}
                   <div className="w-36 h-36 md:w-56 md:h-56 bg-[#111] rounded-3xl mb-6 md:mb-10 border border-white/10 flex items-center justify-center group-hover:border-ikl-red group-hover:shadow-[0_0_30px_rgba(255,42,42,0.3)] transition-all duration-300 relative overflow-hidden p-4 md:p-6">
                      {team.logo && !team.logo.includes('placehold') ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-contain relative z-10" referrerPolicy="no-referrer" />
                      ) : (
                          <span className="font-display text-6xl md:text-7xl text-gray-700 group-hover:text-white transition-colors z-10">{team.name.substring(0,2)}</span>
                      )}
                      {/* Internal Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-ikl-red/0 to-ikl-red/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl font-display font-bold text-white text-center uppercase mb-4 md:mb-6 leading-none tracking-wide break-words w-full group-hover:text-ikl-red transition-colors">{team.name}</h2>
                </div>
                
                <div className="flex items-center gap-2 text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors mt-2 md:mt-4">
                   <span>View Roster</span>
                   <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};