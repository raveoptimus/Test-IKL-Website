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

  if (loading) return <div className="text-center py-20 text-2xl font-display animate-pulse text-gray-500">Loading Standings...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-16">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4">SEASON STANDINGS</h1>
        <div className="h-2 w-32 bg-ikl-red mx-auto"></div>
      </div>

      <div className="bg-ikl-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap min-w-[900px]">
            <thead>
                <tr className="bg-gradient-to-r from-ikl-red/20 to-transparent text-white border-b border-white/10">
                <th className="p-6 text-left font-display text-2xl tracking-wide">#</th>
                <th className="p-6 text-left font-display text-2xl tracking-wide w-full">TEAM</th>
                <th className="p-6 text-center font-display text-2xl tracking-wide">MATCH POINT</th>
                <th className="p-6 text-center font-display text-2xl tracking-wide">MATCH W-L</th>
                <th className="p-6 text-center font-display text-2xl tracking-wide">NET GAME</th>
                <th className="p-6 text-right font-display text-2xl tracking-wide">GAME W-L</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {teams.map((team, index) => {
                    const netGame = team.gameWins - team.gameLosses;
                    return (
                        <tr key={team.id} className="group hover:bg-white/5 transition-colors">
                            <td className="p-6 font-bold text-gray-500 text-3xl font-display">{index + 1}</td>
                            <td className="p-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-black/40 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-ikl-red/50 transition-colors overflow-hidden relative p-2">
                                    {team.logo && !team.logo.includes('placehold') ? (
                                        <img 
                                            src={team.logo} 
                                            alt={team.name} 
                                            className="w-full h-full object-contain relative z-10" 
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('.initials-fallback')?.classList.remove('opacity-0');
                                            }}
                                        />
                                    ) : null}
                                    <span className={`initials-fallback font-display font-bold text-2xl text-gray-300 absolute inset-0 flex items-center justify-center ${team.logo && !team.logo.includes('placehold') ? 'opacity-0' : ''}`}>
                                        {team.name.substring(0,2)}
                                    </span>
                                </div>
                                <span className="font-bold text-2xl md:text-3xl font-display tracking-wide uppercase text-white">{team.name}</span>
                            </div>
                            </td>
                            <td className="p-6 text-center font-display text-4xl text-white font-bold tracking-wider">
                                {team.matchPoints}
                            </td>
                            <td className="p-6 text-center font-mono text-xl text-gray-300 font-bold">
                                {team.matchWins} - {team.matchLosses}
                            </td>
                            <td className="p-6 text-center font-mono text-xl font-bold">
                                <span className={netGame > 0 ? 'text-ikl-green' : netGame < 0 ? 'text-red-500' : 'text-gray-400'}>
                                    {netGame > 0 ? `+${netGame}` : netGame}
                                </span>
                            </td>
                             <td className="p-6 text-right font-mono text-xl text-gray-400 font-bold">
                                {team.gameWins} - {team.gameLosses}
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