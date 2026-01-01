import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { getTeams } from '../services/api';

export const Standings: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
      getTeams().then(data => {
        // Sort by Match Points desc, then Net Game Win desc
        setTeams(data.sort((a,b) => {
            if (b.matchPoints !== a.matchPoints) return b.matchPoints - a.matchPoints;
            const netA = a.gameWins - a.gameLosses;
            const netB = b.gameWins - b.gameLosses;
            return netB - netA;
        }));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.addEventListener('data-updated', loadData);
    return () => window.removeEventListener('data-updated', loadData);
  }, []);

  if (loading) return (
      <div className="flex h-[50vh] items-center justify-center">
          <div className="w-16 h-16 border-4 border-ikl-red border-t-transparent rounded-full animate-spin"></div>
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-16 px-2 md:px-0">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-4xl md:text-8xl font-display font-bold text-white mb-2 md:mb-4 uppercase tracking-tighter">SEASON <br className="md:hidden" /> STANDINGS</h1>
        <div className="h-1.5 w-24 md:h-2 md:w-32 bg-ikl-red mx-auto"></div>
      </div>

      <div className="bg-[#0a0a0a] rounded-t-xl md:rounded-t-2xl border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="w-full">
            <table className="w-full text-left border-collapse table-auto">
            <thead>
                <tr className="bg-gradient-to-r from-red-950 to-[#111] text-gray-300 border-b border-white/10 text-[10px] md:text-xl uppercase tracking-widest font-display">
                    <th className="p-2 md:p-6 text-center border-r border-white/5 md:border-none w-8 md:w-auto">#</th>
                    <th className="p-2 md:p-6 w-auto md:w-full">TEAM</th>
                    <th className="p-2 md:p-6 text-center text-white w-10 md:w-auto">PTS</th>
                    <th className="p-2 md:p-6 text-center whitespace-nowrap w-14 md:w-auto">M. W-L</th>
                    <th className="p-2 md:p-6 text-center w-10 md:w-auto">NET</th>
                    <th className="p-2 md:p-6 text-center whitespace-nowrap w-14 md:w-auto">G. W-L</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0f0f0f]">
                {teams.map((team, index) => {
                    const netGame = team.gameWins - team.gameLosses;
                    return (
                        <tr key={team.id} className="group hover:bg-white/5 transition-colors">
                            {/* Rank Column */}
                            <td className="p-2 md:p-6 font-display text-lg md:text-3xl text-gray-500 font-bold text-center border-r border-white/5 md:border-none">
                                {index + 1}
                            </td>
                            
                            {/* Team Column */}
                            <td className="p-2 md:p-6">
                                <div className="flex items-center space-x-2 md:space-x-4">
                                    <div className="w-8 h-8 md:w-14 md:h-14 bg-black/40 rounded md:rounded-lg flex items-center justify-center border border-white/10 shrink-0 overflow-hidden relative">
                                        {team.logo && !team.logo.includes('placehold') ? (
                                            <img 
                                                src={team.logo} 
                                                alt={team.name} 
                                                className="w-full h-full object-contain" 
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement?.querySelector('.initials-fallback')?.classList.remove('opacity-0');
                                                }}
                                            />
                                        ) : null}
                                        <span className={`initials-fallback font-display font-bold text-gray-500 absolute inset-0 flex items-center justify-center ${team.logo && !team.logo.includes('placehold') ? 'opacity-0' : ''}`}>
                                            {team.name.substring(0,2)}
                                        </span>
                                    </div>
                                    <span className="font-display text-sm md:text-3xl font-bold text-white uppercase tracking-wide leading-tight truncate max-w-[100px] sm:max-w-none md:whitespace-normal">
                                        {team.name}
                                    </span>
                                </div>
                            </td>

                            {/* Stats Columns */}
                            <td className="p-2 md:p-6 text-center font-display text-lg md:text-4xl text-white font-bold tracking-wider">
                                {team.matchPoints}
                            </td>
                            <td className="p-2 md:p-6 text-center font-mono text-xs md:text-xl text-gray-400 font-bold whitespace-nowrap">
                                {team.matchWins}-{team.matchLosses}
                            </td>
                            <td className="p-2 md:p-6 text-center font-mono text-xs md:text-xl font-bold">
                                <span className={netGame > 0 ? 'text-ikl-green' : netGame < 0 ? 'text-red-500' : 'text-gray-500'}>
                                    {netGame > 0 ? `+${netGame}` : netGame}
                                </span>
                            </td>
                             <td className="p-2 md:p-6 text-center font-mono text-xs md:text-xl text-gray-500 font-bold whitespace-nowrap">
                                {team.gameWins}-{team.gameLosses}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};