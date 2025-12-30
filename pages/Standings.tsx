import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { getTeams } from '../services/api';

export const Standings: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams().then(data => {
      // Sort by points desc
      setTeams(data.sort((a,b) => b.points - a.points));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20">Loading Standings...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-display font-bold text-white mb-2">SEASON STANDINGS</h1>
        <div className="h-1 w-24 bg-ikl-red mx-auto"></div>
      </div>

      <div className="bg-ikl-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-ikl-red/20 to-transparent text-white border-b border-white/10">
              <th className="p-5 text-left font-display text-xl">#</th>
              <th className="p-5 text-left font-display text-xl">TEAM</th>
              <th className="p-5 text-center font-display text-xl">W - L</th>
              <th className="p-5 text-right font-display text-xl">POINTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {teams.map((team, index) => (
              <tr key={team.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-5 font-bold text-gray-500 text-xl">{index + 1}</td>
                <td className="p-5">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/10 group-hover:border-ikl-red/50 transition-colors">
                         {/* Placeholder Logo */}
                         <span className="font-display font-bold text-lg text-gray-300">{team.name.substring(0,2)}</span>
                      </div>
                      <span className="font-bold text-xl tracking-wide uppercase">{team.name}</span>
                   </div>
                </td>
                <td className="p-5 text-center font-mono text-lg">
                   <span className="text-ikl-green">{team.wins}</span> - <span className="text-red-400">{team.losses}</span>
                </td>
                <td className="p-5 text-right font-display text-3xl text-white font-bold">
                   {team.points > 0 ? `+${team.points}` : team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};