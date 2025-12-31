import React, { useEffect, useState } from 'react';
import { Team, Player } from '../types';
import { getTeams, getPlayers } from '../services/api';
import { ROLE_LABELS } from '../constants';

export const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    getTeams().then(setTeams);
    getPlayers().then(setPlayers);
  }, []);

  // --- DETAIL VIEW ---
  if (selectedTeam) {
    const roster = players.filter(p => p.team === selectedTeam.name);

    return (
      <div className="animate-fade-in pb-12">
         {/* Navigation Back */}
         <button 
           onClick={() => setSelectedTeam(null)}
           className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 group transition-colors"
         >
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="font-display text-xl uppercase tracking-widest">Back to Teams</span>
         </button>

         {/* Header Info: Detail Intro + Logo */}
         <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-gradient-to-r from-black via-white/5 to-transparent p-8 rounded-xl border-l-4 border-ikl-red">
            {/* PNG Friendly: Changed bg-black to bg-white/5 */}
            <div className="w-40 h-40 bg-white/5 rounded-full flex items-center justify-center border-4 border-white/10 shadow-[0_0_40px_rgba(255,42,42,0.2)] flex-shrink-0 relative overflow-hidden">
                 {selectedTeam.logo && !selectedTeam.logo.includes('placehold') ? (
                     <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-full h-full object-contain" />
                 ) : (
                     <span className="font-display text-6xl text-gray-700">{selectedTeam.name.substring(0,2)}</span>
                 )}
            </div>
            <div className="text-center md:text-left">
                 <h1 className="text-6xl md:text-8xl font-display font-bold text-white uppercase leading-none mb-4">{selectedTeam.name}</h1>
                 {/* Detail Intro */}
                 <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-light">
                   {selectedTeam.description || "No team description available."}
                 </p>
            </div>
         </div>

         {/* Roster Grid */}
         <h2 className="text-4xl font-display font-bold text-white mb-8 flex items-center gap-4">
             <span className="w-2 h-8 bg-ikl-red"></span>
             ACTIVE ROSTER
         </h2>
         
         {roster.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {roster.map(player => (
                  <div key={player.id} className="bg-white/5 rounded-lg overflow-hidden group border border-white/5 hover:border-ikl-red/50 transition-all duration-300">
                      {/* Photo Player - Keep dark bg for player photos usually, but can be adjusted */}
                      <div className="aspect-[4/5] bg-gray-900 relative">
                          {player.image ? (
                             <img src={player.image} alt={player.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-4xl font-display text-gray-800 font-bold">
                                {player.name.substring(0,1)}
                             </div>
                          )}
                      </div>
                      <div className="p-4 text-center bg-black/40">
                          {/* Nickname */}
                          <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">{player.name}</h3>
                          <div className="mt-2 inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-400 uppercase tracking-widest">
                             {ROLE_LABELS[player.role]}
                          </div>
                      </div>
                  </div>
              ))}
           </div>
         ) : (
             <div className="p-10 text-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                 <p className="font-display text-2xl">NO ACTIVE PLAYERS FOUND</p>
             </div>
         )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="animate-fade-in">
       {/* Title with RED LED Effect on "PARTICIPATING TEAM" */}
       <div className="mb-12 flex justify-center py-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-ikl-red to-red-600 drop-shadow-[0_0_25px_rgba(255,42,42,0.6)] animate-pulse uppercase tracking-widest text-center border-b-4 border-ikl-red pb-2 px-8">
             PARTICIPATING TEAM
          </h1>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
             <div 
               key={team.id} 
               onClick={() => setSelectedTeam(team)}
               className="bg-ikl-panel border border-white/10 rounded-xl p-8 hover:border-ikl-red hover:shadow-[0_0_30px_rgba(255,42,42,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
             >
                <div className="flex flex-col items-center">
                   {/* PNG Friendly: Changed bg-black to bg-white/5 (transparent-ish) */}
                   <div className="w-40 h-40 bg-white/5 rounded-full mb-8 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-ikl-red group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                      {team.logo && !team.logo.includes('placehold') ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                      ) : (
                          <span className="font-display text-5xl text-gray-700 group-hover:text-white transition-colors z-10">{team.name.substring(0,2)}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-ikl-red/0 to-ikl-red/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </div>
                   
                   <h2 className="text-4xl font-display font-bold text-white text-center uppercase mb-4 leading-none">{team.name}</h2>
                   
                   <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-ikl-red transition-colors">
                      <span>View Roster</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};